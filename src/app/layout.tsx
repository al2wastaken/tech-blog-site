import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "2Bits - Teknoloji Blogu",
  description: "2 öğrenci tarafından hazırlanan teknoloji blogu.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${montserrat.variable} antialiased min-h-screen flex flex-col bg-zinc-900 text-zinc-50 overflow-x-hidden`}> 
        {children}
      </body>
    </html>
  );
}
