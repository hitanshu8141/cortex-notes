"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createNoteAction } from "@/actions/notes";
import { Button } from "@/components/ui/button";

export function NewNoteButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const noteId = crypto.randomUUID();
      const { errorMessage } = await createNoteAction(noteId);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      router.push(`/?noteId=${noteId}`);
      toast.success("New note created");
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending} className="w-32">
      {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
      New Note
    </Button>
  );
}
