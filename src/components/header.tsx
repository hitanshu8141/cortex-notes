import Link from "next/link";
import { Brain, Loader2 } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getUser } from "@/lib/supabase/server";

function HeaderShell({
  children,
  showSidebarTrigger = false,
}: {
  children: React.ReactNode;
  showSidebarTrigger?: boolean;
}) {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {showSidebarTrigger && <SidebarTrigger />}
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
              <Brain className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Cortex <span className="text-muted-foreground">Notes</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {children}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export async function Header() {
  const user = await getUser();

  return (
    <HeaderShell showSidebarTrigger={!!user}>
      {user ? (
        <>
          <span className="text-muted-foreground hidden text-sm sm:inline">
            {user.email}
          </span>
          <LogoutButton />
        </>
      ) : (
        <>
          <Button asChild>
            <Link href="/sign-up">Sign up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </>
      )}
    </HeaderShell>
  );
}

// Shown while Header is waiting on the user's session.
export function HeaderSkeleton() {
  return (
    <HeaderShell>
      <Loader2 className="text-muted-foreground size-5 animate-spin" />
    </HeaderShell>
  );
}
