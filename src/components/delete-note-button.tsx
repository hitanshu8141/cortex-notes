"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteNoteAction } from "@/actions/notes";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteNoteButtonProps = {
  noteId: string;
  onDeleted: () => void;
};

export function DeleteNoteButton({ noteId, onDeleted }: DeleteNoteButtonProps) {
  const router = useRouter();
  const openNoteId = useSearchParams().get("noteId");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const { errorMessage } = await deleteNoteAction(noteId);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      setOpen(false);
      onDeleted();
      toast.success("Note deleted", {
        description: "Your note has been permanently deleted.",
      });
      if (noteId === openNoteId) router.replace("/");
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete note"
          className="text-muted-foreground hover:text-destructive shrink-0"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your note. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          {/* A plain button so the dialog stays open while deleting. */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="w-24"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
