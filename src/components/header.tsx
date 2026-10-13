import Link from "next/link";
import { Brain } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
            <Brain className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Cortex <span className="text-muted-foreground">Notes</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/sign-up">Sign up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
