import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import FooterSection from "./_components/FooterSection";
import { TRPCReactProvider } from "~/trpc/react";

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
  return (
    <html lang="en" className={`${geist.variable}`}>
      {/* 
        - min-h-screen: at least viewport height 
        - flex flex-col: stack header/main/footer vertically 
      */}
      <body className="min-h-screen flex flex-col">
        <TRPCReactProvider>
          {/*
            - flex-grow: takes up leftover space so footer is pushed down on short pages
          */}
          <main className="flex-grow">
            {children}
          </main>

          {/* always rendered at the bottom */}
          <FooterSection />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

