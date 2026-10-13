"use server";

import { headers } from "next/headers";

import { prisma } from "@/db/prisma";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { errorMessage: string | null };

async function saveUser(id: string, email: string) {
  await prisma.user.upsert({
    where: { id },
    update: { email },
    create: { id, email },
  });
}

function handleError(error: unknown): ActionResult {
  if (error instanceof Error) return { errorMessage: error.message };
  return { errorMessage: "Something went wrong. Please try again." };
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) throw error;

    // Backfills the row for anyone who signed up before the database existed.
    await saveUser(data.user.id, data.user.email!);

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  try {
    const origin = (await headers()).get("origin");
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) throw error;

    // Supabase returns a user with no identities when the email is already registered.
    if (!data.user || data.user.identities?.length === 0) {
      throw new Error("An account with this email already exists.");
    }

    await saveUser(data.user.id, data.user.email!);

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
