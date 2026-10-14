import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AskAIButton } from "@/components/ask-ai-button";
import { NewNoteButton } from "@/components/new-note-button";
import { NoteTextInput } from "@/components/note-text-input";
import { prisma } from "@/db/prisma";
import { getUser } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      }
    >
      <NotesHome searchParams={searchParams} />
    </Suspense>
  );
}

async function NotesHome({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const user = await getUser();
  const { noteId } = await searchParams;

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to Cortex Notes
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your AI-powered second brain.
        </p>
      </div>
    );
  }

  const buttons = (
    <div className="flex items-center justify-end gap-2">
      <NewNoteButton />
      <AskAIButton user={user} />
    </div>
  );

  const note =
    typeof noteId === "string" && UUID_PATTERN.test(noteId)
      ? await prisma.note.findUnique({
          where: { id: noteId, authorId: user.id },
          select: { id: true, text: true },
        })
      : null;

  if (!note) {
    // No valid note selected: open the most recent one, if any.
    const newest = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    if (newest) redirect(`/?noteId=${newest.id}`);

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        {buttons}
        <div className="text-muted-foreground flex flex-1 items-center justify-center text-center">
          You don&apos;t have any notes yet. Click New Note to start writing.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      {buttons}
      <NoteTextInput key={note.id} noteId={note.id} startingText={note.text} />
    </div>
  );
}
