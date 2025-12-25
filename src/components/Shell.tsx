"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // pages that should NOT show the shell (no navbar/footer)
  const noShellPaths = ["/login", "/register"];
  const showShell = !noShellPaths.includes(pathname || "");

  if (!showShell) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
