import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { Header, HeaderSkeleton } from "@/components/header";
import { NoteProvider } from "@/components/providers/note-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cortex Notes",
  description: "Your AI-powered second brain for notes",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <NoteProvider>
              <SidebarProvider>
                {/* Renders nothing when logged out. */}
                <Suspense fallback={null}>
                  <AppSidebar />
                </Suspense>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Suspense fallback={<HeaderSkeleton />}>
                    <Header />
                  </Suspense>
                  <main className="flex flex-1 flex-col">{children}</main>
                </div>
              </SidebarProvider>
            </NoteProvider>
          </TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
