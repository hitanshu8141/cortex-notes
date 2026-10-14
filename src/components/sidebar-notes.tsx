"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";

import { useNote } from "@/components/providers/note-provider";
import { SidebarNoteItem } from "@/components/sidebar-note-item";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  SidebarMenu,
} from "@/components/ui/sidebar";

export type SidebarNote = { id: string; text: string; createdAt: string };

export function SidebarNotes({ notes }: { notes: SidebarNote[] }) {
  const { editedTexts } = useNote();
  const [query, setQuery] = useState("");
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Server list, minus locally deleted notes, with live text from the editor.
  const localNotes = useMemo(
    () =>
      notes
        .filter((note) => !deletedIds.includes(note.id))
        .map((note) => ({ ...note, text: editedTexts[note.id] ?? note.text })),
    [notes, deletedIds, editedTexts],
  );

  const fuse = useMemo(
    () => new Fuse(localNotes, { keys: ["text"], threshold: 0.4 }),
    [localNotes],
  );

  const filteredNotes = query.trim()
    ? fuse.search(query).map((result) => result.item)
    : localNotes;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
          <SidebarInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your notes..."
            className="pl-8"
          />
        </div>

        {filteredNotes.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-center text-sm">
            {localNotes.length === 0 ? "No notes yet" : "No notes found"}
          </p>
        ) : (
          <SidebarMenu>
            {filteredNotes.map((note) => (
              <SidebarNoteItem
                key={note.id}
                note={note}
                onDeleted={() => setDeletedIds((ids) => [...ids, note.id])}
              />
            ))}
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
