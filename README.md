This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Cortex Notes
  
  Your AI-powered second brain: write notes, find them instantly and ask AI questions about them.

  **Live demo:** https://cortex-notes-sigma.vercel.app/

  ## Features

  - Email sign-up and login with Supabase Auth (with email confirmation)
  - Notes sidebar with live titles, created dates and fuzzy search (Fuse.js)
  - Autosaving editor: notes save a second after you stop typing
  - Delete notes with a confirmation dialog
  - Ask AI: ask questions about your own notes, powered by Groq
  - Light, dark and system themes

  ## Tech Stack

  - [Next.js 16](https://nextjs.org) (App Router, Server Actions)
  - [Supabase](https://supabase.com) for auth and the Postgres database
  - [Prisma 7](https://www.prisma.io) ORM
  - [shadcn/ui](https://ui.shadcn.com) and Tailwind CSS
  - [Groq](https://groq.com) for AI answers
  - Deployed on [Vercel](https://vercel.com)

  ## Learn More

  To learn more about Next.js, take a look at the following resources:

  - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
  - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

  You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

  ## Deploy on Vercel

  The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-    next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
