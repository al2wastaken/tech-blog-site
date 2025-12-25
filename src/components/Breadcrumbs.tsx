"use client";
import Link from "next/link";
import React from "react";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              {!isLast && it.href ? (
                <Link href={it.href} className="text-zinc-300 hover:text-blue-500">{it.label}</Link>
              ) : (
                <span className="text-zinc-200 font-medium truncate">{it.label}</span>
              )}
              {!isLast && <span className="text-zinc-500">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
