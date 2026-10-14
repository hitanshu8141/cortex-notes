"use client";

import { useState, useTransition } from "react";
import type { User } from "@supabase/supabase-js";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { askAIAction } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Exchange = { question: string; answer: string };

// `user` is the Supabase auth user, passed down from the server.
export function AskAIButton({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    if (!user) {
      toast.error("You must be logged in to use Ask AI.");
      return;
    }
    setOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const asked = question.trim();
    if (!asked) return;

    startTransition(async () => {
      const { errorMessage, answer } = await askAIAction(asked);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      setExchanges((previous) => [
        ...previous,
        { question: asked, answer: answer ?? "" },
      ]);
      setQuestion("");
    });
  }

  return (
    <>
      <Button variant="secondary" onClick={handleOpen} className="w-32">
        <Sparkles />
        Ask AI
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ask AI about your notes</DialogTitle>
            <DialogDescription>
              Answers come from Google Gemini, using only your notes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
            {exchanges.length === 0 && !isPending && (
              <p className="text-muted-foreground text-sm">
                Try &quot;Summarise my notes&quot; or &quot;What did I write
                about yesterday?&quot;
              </p>
            )}
            {exchanges.map((exchange, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-lg px-3 py-2 text-sm">
                  {exchange.question}
                </p>
                <p className="bg-muted max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap">
                  {exchange.answer}
                </p>
              </div>
            ))}
            {isPending && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" /> Thinking...
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question about your notes..."
              disabled={isPending}
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={isPending || !question.trim()}
              aria-label="Send question"
            >
              <Send />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
