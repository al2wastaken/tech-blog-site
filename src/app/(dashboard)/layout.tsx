import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";

import GlobalHeader from "../../components/GlobalHeader";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "2Bytes - Teknoloji Blogu",
  description: "2 öğrenci tarafından hazırlanan teknoloji blogu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`font-serif bg-zinc-900 text-zinc-50 overflow-x-hidden ${montserrat.variable}`}>
        <GlobalHeader />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
