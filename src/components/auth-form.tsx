"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginAction, signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  type: "login" | "signUp";
};

export function AuthForm({ type }: AuthFormProps) {
  const isLogin = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const { errorMessage } = isLogin
        ? await loginAction(formData)
        : await signUpAction(formData);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      if (isLogin) {
        toast.success("Logged in", { description: "Welcome back!" });
        router.replace("/");
      } else {
        toast.success("Account created", {
          description: "Check your email to confirm your account.",
        });
      }
    });
  }

  return (
    <form action={handleSubmit}>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            required
            disabled={isPending}
          />
        </div>
      </CardContent>

      <CardFooter className="mt-6 flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {isLogin ? "Login" : "Sign up"}
        </Button>
        <p className="text-muted-foreground mt-2 text-sm">
          {isLogin ? "Don't have an account yet?" : "Already have an account?"}
        </p>
        <Button asChild variant="link" size="sm">
          <Link href={isLogin ? "/sign-up" : "/login"}>
            {isLogin ? "Sign up" : "Login"}
          </Link>
        </Button>
      </CardFooter>
    </form>
  );
}
