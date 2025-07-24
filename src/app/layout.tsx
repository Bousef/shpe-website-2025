import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import FooterSection from "./_components/FooterSection";
import { TRPCReactProvider } from "~/trpc/react";
import { env } from "~/env";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SHPE UCF",
  description: "shpeucf.com",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// app/layout.tsx (or wherever your RootLayout lives)

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const warnings: string[] = [];

  if (!env.SUPABASE_URL) {
    warnings.push(
      "Missing SUPABASE_URL! Server auth features will be disabled.",
    );
  }

  if (!env.SUPABASE_ANON_KEY) {
    warnings.push(
      "Missing SUPABASE_ANON_KEY! Server auth features will be disabled.",
    );
  }

  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    warnings.push(
      "Missing NEXT_PUBLIC_SUPABASE_URL! Client auth features will be disabled.",
    );
  }
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    warnings.push(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY! Client auth features will be disabled.",
    );
  }

  if (warnings.length > 0) {
    console.warn(
      "\x1b[33m Environment variable warnings:\n",
      warnings.join("\n "),
    );
  }

  console.warn("\x1b[0m");

  return (
    <html lang="en" className={`${geist.variable}`}>
      {env.NODE_ENV === "production" ? (
        <Script src="https://web.squarecdn.com/v1/square.js"></Script>
      ) : (
        <Script src="https://sandbox.web.squarecdn.com/v1/square.js"></Script>
      )}
      {/* 
        - min-h-screen: at least viewport height 
        - flex flex-col: stack header/main/footer vertically 
      */}
      <body className="flex min-h-screen flex-col">
        <TRPCReactProvider>
          {/*
            - flex-grow: takes up leftover space so footer is pushed down on short pages
          */}
          <main className="flex-grow">{children}</main>

          {/* always rendered at the bottom */}
          <FooterSection />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
