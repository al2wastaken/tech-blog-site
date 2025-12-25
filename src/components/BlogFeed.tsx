"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { BlogCardSkeleton } from "./Skeleton";

type RawBlog = {
  _id?: string;
  title?: string;
  date?: string | Date;
  author?: string;
  content?: string;
  image?: string;
  category?: string | { name?: string; color?: string };
  categoryId?: string;
  url?: string;
};

function formatDate(date?: Date | string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return String(date);
  }
}

export default function BlogFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetch('/api/categories').then((r) => r.json()).catch(() => []),
      fetch(`/api/blogs?page=1&limit=${limit}`).then((r) => r.json()).catch(() => ({ results: [] })),
    ])
      .then(([cats, blogsResp]) => {
        const catsList = cats || [];
        const results = blogsResp.results || [];
        // skip the first (latest shown in hero) only on initial load
        const slice = results.slice(1);
        const mapped = slice.map((b: RawBlog) => {
          let cat: any = null;
          if (b.category && typeof b.category === 'object') cat = b.category;
          else if (b.category && typeof b.category === 'string') cat = catsList.find((c: any) => String(c._id) === String(b.category)) || null;
          else if (b.categoryId) cat = catsList.find((c: any) => String(c._id) === String(b.categoryId)) || null;
          return {
            image: b.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            category: cat?.name || 'Genel',
            categoryColor: cat?.color || 'bg-blue-600',
            date: formatDate(b.date),
            author: b.author || 'Yazar',
            title: b.title || 'Başlıksız',
            description: (b.content && String(b.content).slice(0, 180)) || 'Özet yok',
            url: b.url || b._id || '#',
          };
        });
        if (mounted) {
          setPosts(mapped);
          setTotal(blogsResp.total || 0);
          setPage(1);
        }
      })
      .catch(() => { if (mounted) { setPosts([]); setTotal(0); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [limit]);

  async function loadMore() {
    const next = page + 1;
    setLoading(true);
    try {
      const resp = await fetch(`/api/blogs?page=${next}&limit=${limit}`);
      const data = await resp.json();
      const catsRes = await fetch('/api/categories');
      const catsList = catsRes.ok ? await catsRes.json() : [];
      const mapped = (data.results || []).map((b: RawBlog) => {
        let cat: any = null;
        if (b.category && typeof b.category === 'object') cat = b.category;
        else if (b.category && typeof b.category === 'string') cat = catsList.find((c: any) => String(c._id) === String(b.category)) || null;
        else if (b.categoryId) cat = catsList.find((c: any) => String(c._id) === String(b.categoryId)) || null;
        return {
          image: b.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          category: cat?.name || 'Genel',
          categoryColor: cat?.color || 'bg-blue-600',
          date: formatDate(b.date),
          author: b.author || 'Yazar',
          title: b.title || 'Başlıksız',
          description: (b.content && String(b.content).slice(0, 180)) || 'Özet yok',
          url: b.url || b._id || '#',
        };
      });
      setPosts((p) => [...p, ...mapped]);
      setPage(next);
      setTotal(data.total || total);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const canLoadMore = posts.length < Math.max(0, total - 1); // -1 because we skipped latest

  if (loading) {
    return (
      <main className="flex-1 w-full">
        <div className="flex flex-col gap-4 sm:gap-6">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col gap-4 sm:gap-6">
        {posts.map((post, i) => (
          <BlogCard key={i} {...post} />
        ))}
      </div>
      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button onClick={loadMore} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Yükleniyor...' : 'Daha fazla gör'}
          </button>
        </div>
      )}
    </main>
  );
}
