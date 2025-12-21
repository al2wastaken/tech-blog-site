"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMore() {
    if (loadingMore) return;
    const next = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/blogs?page=${next}&limit=5`);
      if (res.ok) {
        const payload = await res.json();
        setRecent((s) => [...s, ...(payload.results || [])]);
        setPage(payload.page || next);
        setTotal(payload.total || 0);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const c = await fetch(`/api/categories`);
        if (mounted && c.ok) setCategories(await c.json());
      } catch (e) {
        // ignore
      }
      try {
        const b = await fetch(`/api/blogs?page=1&limit=5`);
        if (mounted && b.ok) {
          const payload = await b.json();
          setRecent(payload.results || []);
          setTotal(payload.total || 0);
          setPage(payload.page || 1);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <aside className="w-full md:w-80 flex-shrink-0">
      <div className="border border-white/20 bg-zinc-900 rounded-xl shadow p-4 mb-4">
        <form action="/search" method="get" className="flex flex-row gap-2">
          <input name="q" value={q} onChange={(e) => setQ(e.target.value)} type="text" placeholder="Site içi ara..." className="rounded-xl flex-1 min-w-0 h-10 px-4 rounded border border-white/20 focus:outline-none bg-transparent" />
          <button type="submit" className="h-10 px-4 bg-blue-600 text-white rounded font-semibold shrink-0 flex items-center justify-center"><FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs max-w-[1em]" /></button>
        </form>
      </div>

      <div className="border border-white/20 bg-zinc-900 rounded-xl shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-lg font-bold mb-4">Kategoriler</h3>
        <ul className="space-y-2">
          {categories.length === 0 ? (
            <li className="text-zinc-500">Yükleniyor...</li>
          ) : categories.map((c) => (
            <li key={c._id}><Link href={`/search?category=${encodeURIComponent(c._id)}`} className="flex justify-between hover:text-blue-600">{c.name} <span className="text-xs text-zinc-500">{/* count unknown */}</span></Link></li>
          ))}
        </ul>
      </div>

      <div className="border border-white/20 bg-zinc-900 rounded-xl shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-lg font-bold mb-4">Son Yazılar</h3>
        <ul className="space-y-3">
          {recent.length === 0 ? (
            <li className="text-zinc-500">Yükleniyor...</li>
          ) : recent.map((r) => (
            <li key={r._id}>
              <Link href={`/blogs/${encodeURIComponent(String(r.url || r._id))}`} className="block hover:text-blue-600">{r.title}</Link>
              <div className="text-xs text-zinc-500">{new Date(r.date).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
        {recent.length > 0 && recent.length < total && (
          <div className="mt-4 text-center">
            <button onClick={loadMore} disabled={loadingMore} className="px-3 py-2 bg-blue-600 text-white rounded font-semibold">
              {loadingMore ? "Yükleniyor..." : "Daha Fazla Gör"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
