"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { updateNoteAction } from "@/actions/notes";
import { useNote } from "@/components/providers/note-provider";
import { Textarea } from "@/components/ui/textarea";

const SAVE_DELAY_MS = 1000;

type NoteTextInputProps = {
  noteId: string;
  startingText: string;
};

export function NoteTextInput({ noteId, startingText }: NoteTextInputProps) {
  const { editedTexts, setNoteText } = useNote();
  // Prefer unsaved edits from this session over the server copy.
  const [text, setText] = useState(editedTexts[noteId] ?? startingText);
  const pendingSave = useRef<{ timer: number; text: string } | null>(null);

  async function save(textToSave: string) {
    const { errorMessage } = await updateNoteAction(noteId, textToSave);
    if (errorMessage) toast.error(errorMessage);
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newText = event.target.value;
    setText(newText);
    setNoteText(noteId, newText);

    // Save once the user pauses typing.
    if (pendingSave.current) window.clearTimeout(pendingSave.current.timer);
    const timer = window.setTimeout(() => {
      pendingSave.current = null;
      save(newText);
    }, SAVE_DELAY_MS);
    pendingSave.current = { timer, text: newText };
  }

  // Save right away if the user switches notes mid-typing.
  useEffect(() => {
    return () => {
      if (pendingSave.current) {
        window.clearTimeout(pendingSave.current.timer);
        updateNoteAction(noteId, pendingSave.current.text);
      }
    };
  }, [noteId]);

  return (
    <Textarea
      value={text}
      onChange={handleChange}
      placeholder="Type your notes here..."
      autoFocus
      className="min-h-[60vh] flex-1 resize-none p-4 text-base md:text-base"
    />
  );
}
