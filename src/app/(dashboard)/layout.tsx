import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import React from "react";

import GlobalHeader from "../../components/GlobalHeader";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "2Bits - Teknoloji Blogu",
  description: "2 öğrenci tarafından hazırlanan teknoloji blogu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <React.Suspense fallback={null}>
        <GlobalHeader />
      </React.Suspense>
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}
