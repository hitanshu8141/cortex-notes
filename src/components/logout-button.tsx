"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const { errorMessage } = await logoutAction();

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      toast.success("Logged out", {
        description: "You have been successfully logged out.",
      });
      router.replace("/");
    });
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
      className="w-24"
    >
      {isPending ? <Loader2 className="animate-spin" /> : "Log out"}
    </Button>
  );
}
