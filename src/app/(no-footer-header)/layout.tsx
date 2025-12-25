import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";

import GlobalHeader from "../../components/GlobalHeader";
import GlobalFooter from "../../components/GlobalFooter";

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
      {children}
    </>
  );
}
