"use client";

import { createContext, useCallback, useContext, useState } from "react";

type NoteContextValue = {
  // Latest text of every note edited in this session, by note id.
  editedTexts: Record<string, string>;
  setNoteText: (noteId: string, text: string) => void;
};

// Lets the sidebar show note text as the user types, before it's saved.
const NoteContext = createContext<NoteContextValue | null>(null);

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});

  const setNoteText = useCallback((noteId: string, text: string) => {
    setEditedTexts((texts) => ({ ...texts, [noteId]: text }));
  }, []);

  return (
    <NoteContext.Provider value={{ editedTexts, setNoteText }}>
      {children}
    </NoteContext.Provider>
  );
}

export function useNote() {
  const context = useContext(NoteContext);
  if (!context) throw new Error("useNote must be used within a NoteProvider.");
  return context;
}
