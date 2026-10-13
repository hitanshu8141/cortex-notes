"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { errorMessage: string | null };

function handleError(error: unknown): ActionResult {
  if (error instanceof Error) return { errorMessage: error.message };
  return { errorMessage: "Something went wrong. Please try again." };
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  try {
    const origin = (await headers()).get("origin");
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}
