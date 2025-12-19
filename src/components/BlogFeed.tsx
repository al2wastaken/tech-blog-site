"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

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
  const [posts, setPosts] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('/api/categories').then((r) => r.json()).catch(() => []),
      fetch('/api/blogs').then((r) => r.json()).catch(() => []),
    ])
      .then(([cats, blogsData]) => {
        const catsList = cats || [];
        const sorted = (blogsData || []).slice().sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        // skip the first (latest shown in hero)
        const slice = sorted.slice(1); // all except the newest
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
        if (mounted) setPosts(mapped);
      })
      .catch(() => { if (mounted) setPosts([]); });
    return () => { mounted = false; };
  }, []);

  if (posts === null) return <div>Loading...</div>;

  return (
    <main className="flex-1 w-full">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-zinc-50">Güncel Yazılar</h2>
        <div className="h-1 w-12 sm:w-16 bg-blue-600 rounded" />
      </div>
      <div className="flex flex-col gap-4 sm:gap-6">
        {posts.map((post, i) => (
          <BlogCard key={i} {...post} />
        ))}
      </div>
    </main>
  );
}
