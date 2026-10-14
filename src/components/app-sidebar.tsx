import { NotebookPen } from "lucide-react";

import { SidebarNotes } from "@/components/sidebar-notes";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { getUser } from "@/lib/supabase/server";

export async function AppSidebar() {
  const user = await getUser();
  // The sidebar is only for logged-in users.
  if (!user) return null;

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, text: true, createdAt: true },
  });

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex-row items-center gap-2 border-b px-4">
        <NotebookPen className="text-primary size-5" />
        <h2 className="text-lg font-semibold">Your Notes</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNotes
          notes={notes.map((note) => ({
            ...note,
            createdAt: note.createdAt.toISOString(),
          }))}
        />
      </SidebarContent>
    </Sidebar>
  );
}
