"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BlogCardSkeleton } from '@/components/Skeleton';

export default function SearchClient() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const categoryParam = searchParams.get("category") || "";
    const [query, setQuery] = useState(q);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const limit = 5;

    useEffect(() => {
        setQuery(q);
        setResults([]);
        const initial = Math.max(1, parseInt(searchParams.get("page") || "1"));
        setPage(initial);
        fetchResults(initial, categoryParam, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, searchParams.get("page"), categoryParam]);

    async function fetchResults(p = page, category = categoryParam, append = false) {
        if (!q && !category) {
            setResults([]);
            setTotal(0);
            return;
        }
        setLoading(true);
        try {
            const catQuery = category ? `&category=${encodeURIComponent(category)}` : "";
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${p}&limit=${limit}${catQuery}`);
            const data = await res.json();
            const rawResults = data.results || [];
            setTotal(data.total || 0);

            // fetch categories once to resolve ids -> { name, color }
            let categories: any[] = [];
            try {
                const cRes = await fetch(`/api/categories`);
                if (cRes.ok) categories = await cRes.json();
            } catch (er) {
                console.warn('Failed to load categories', er);
            }

            const catById: Record<string, any> = {};
            for (const c of categories) catById[String(c._id)] = c;

            const enriched = rawResults.map((b: any) => {
                const cat = catById[String(b.category)] || catById[String(b.categoryId)];
                return {
                    ...b,
                    _categoryName: cat ? cat.name : (typeof b.category === 'string' ? b.category : 'Genel'),
                    _categoryColor: cat ? cat.color : '#0ea5e9',
                };
            });

            setResults(prev => append ? [...prev, ...enriched] : enriched);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function loadMore() {
        const next = page + 1;
        await fetchResults(next, categoryParam, true);
        setPage(next);
    }

    // search is performed from navbar (URL `q` param) — no local page form

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-0">
            <Breadcrumbs items={[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Arama' },
                ...(categoryParam ? [{ label: `Kategori`, href: `/search?category=${encodeURIComponent(categoryParam)}` }] : []),
            ]} />
            

            <div className="mb-4 text-sm text-zinc-400">{loading ? "Aranıyor..." : `${total} sonuç`}</div>

            <div className="space-y-4">
                {loading ? (
                    <>
                        <BlogCardSkeleton />
                        <BlogCardSkeleton />
                        <BlogCardSkeleton />
                    </>
                ) : (
                    results.length === 0 ? <div className="text-zinc-400">Sonuç bulunamadı.</div> : results.map((b: any) => (
                        <BlogCard
                            key={b._id}
                            image={b.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}     
                            category={b._categoryName || b.category || "Genel"}
                            categoryColor={b._categoryColor || "#0ea5e9"}
                            date={new Date(b.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
                            author={b.author || "Yazar"}
                            title={b.title}
                            description={String(b.content || "").replace(/<[^>]*>/g, "").slice(0, 220)}
                            url={String(b.url || b._id)}
                        />
                    ))
                )}
            </div>
            {results.length < total && (
              <div className="mt-6 flex justify-center">
                <button onClick={loadMore} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Yükleniyor...' : 'Daha fazla gör'}</button>
              </div>
            )}
        </div>
    );
}
