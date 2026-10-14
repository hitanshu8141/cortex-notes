"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { DeleteNoteButton } from "@/components/delete-note-button";
import type { SidebarNote } from "@/components/sidebar-notes";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type SidebarNoteItemProps = {
  note: SidebarNote;
  onDeleted: () => void;
};

export function SidebarNoteItem({ note, onDeleted }: SidebarNoteItemProps) {
  const isActive = useSearchParams().get("noteId") === note.id;
  const title = note.text.trim().split("\n")[0];

  return (
    <SidebarMenuItem className="group/note flex items-center gap-1">
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="h-auto flex-1 flex-col items-start gap-0.5 py-2"
      >
        <Link href={`/?noteId=${note.id}`}>
          <span
            className={
              title ? "w-full truncate" : "text-muted-foreground w-full italic"
            }
          >
            {title || "Empty note"}
          </span>
          <span className="text-muted-foreground text-xs">
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
        </Link>
      </SidebarMenuButton>
      <DeleteNoteButton noteId={note.id} onDeleted={onDeleted} />
    </SidebarMenuItem>
  );
}
