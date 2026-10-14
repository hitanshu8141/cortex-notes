"use server";

import { GoogleGenAI } from "@google/genai";
import { refresh } from "next/cache";

import { prisma } from "@/db/prisma";
import { getUser } from "@/lib/supabase/server";

type ActionResult = { errorMessage: string | null };

function handleError(error: unknown): ActionResult {
  if (error instanceof Error) return { errorMessage: error.message };
  return { errorMessage: "Something went wrong. Please try again." };
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

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Ask AI isn't set up yet: add GEMINI_API_KEY to .env.local.");
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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Here are my notes:\n\n${formattedNotes || "(I have no notes yet.)"}\n\nQuestion: ${question}`,
      config: {
        systemInstruction:
          "You are a helpful assistant that answers questions about the user's notes. " +
          "Keep answers concise and use plain text without markdown. " +
          "If the notes don't contain the answer, say so.",
      },
    });

    return { errorMessage: null, answer: response.text ?? "" };
  } catch (error) {
    return { ...handleError(error), answer: null };
  }
}
