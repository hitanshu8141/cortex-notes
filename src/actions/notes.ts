"use server";

import Groq from "groq-sdk";
import { refresh } from "next/cache";

import { prisma } from "@/db/prisma";
import { getUser } from "@/lib/supabase/server";

type ActionResult = { errorMessage: string | null };

function handleError(error: unknown): ActionResult {
  if (error instanceof Error) return { errorMessage: error.message };
  return { errorMessage: "Something went wrong. Please try again." };
}

// Turns Groq API errors into messages a user can act on.
function handleAIError(error: unknown): ActionResult {
  if (error instanceof Groq.APIError) {
    if (error.status === 401) {
      return { errorMessage: "Ask AI's GROQ_API_KEY is invalid. Check .env.local." };
    }
    if (error.status === 429) {
      return { errorMessage: "Ask AI is getting too many requests. Try again in a minute." };
    }
    if (error.status && error.status >= 500) {
      return { errorMessage: "The AI service is temporarily unavailable. Try again shortly." };
    }
  }
  return handleError(error);
}

async function requireUser(action: string) {
  const user = await getUser();
  if (!user) throw new Error(`You must be logged in to ${action}.`);
  return user;
}

export async function createNoteAction(noteId: string): Promise<ActionResult> {
  try {
    const user = await requireUser("create a note");
    await prisma.note.create({
      data: { id: noteId, authorId: user.id, text: "" },
    });

    // Re-render the sidebar so the new note shows up.
    refresh();

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateNoteAction(
  noteId: string,
  text: string,
): Promise<ActionResult> {
  try {
    const user = await requireUser("save notes");
    await prisma.note.update({
      where: { id: noteId, authorId: user.id },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteNoteAction(noteId: string): Promise<ActionResult> {
  try {
    const user = await requireUser("delete notes");
    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function askAIAction(
  question: string,
): Promise<ActionResult & { answer: string | null }> {
  try {
    // The user comes from Supabase; Prisma only loads their notes.
    const user = await requireUser("use Ask AI");

    if (!process.env.GROQ_API_KEY) {
      throw new Error("Ask AI isn't set up yet: add GROQ_API_KEY to .env.local.");
    }

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { text: true, createdAt: true },
    });

    const formattedNotes = notes
      .filter((note) => note.text.trim())
      .map(
        (note) =>
          `Note (created ${note.createdAt.toLocaleDateString()}):\n${note.text}`,
      )
      .join("\n\n---\n\n");

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that answers questions about the user's notes. " +
            "Keep answers concise and use plain text without markdown. " +
            "If the notes don't contain the answer, say so.",
        },
        {
          role: "user",
          content: `Here are my notes:\n\n${formattedNotes || "(I have no notes yet.)"}\n\nQuestion: ${question}`,
        },
      ],
    });

    return {
      errorMessage: null,
      answer: completion.choices[0]?.message.content ?? "",
    };
  } catch (error) {
    return { ...handleAIError(error), answer: null };
  }
}
