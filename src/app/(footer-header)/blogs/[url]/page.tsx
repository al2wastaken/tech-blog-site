'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular, faCalendar as faCalendarRegular } from "@fortawesome/free-regular-svg-icons";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CategoryBadge from '@/components/CategoryBadge';
import Sidebar from '@/components/Sidebar';

type Blog = { title: string; category?: string; date?: string; author?: string; content?: string } | null;

export default function BlogPageClient() {
  const params = useParams() as { url?: string };
  const router = useRouter();
  const url = params?.url || '';
  const [blog, setBlog] = useState<Blog>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!url) return;
    let mounted = true;
    setLoading(true);
    fetch(`/api/blogs/${encodeURIComponent(url)}`)
      .then(async (res) => {
        if (res.status === 404) {
          // navigate to not-found
          router.push('/not-found');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(async (data) => {
        if (!mounted) return;
        let b = data || null;
        if (b && b.category) {
          try {
            const catRes = await fetch(`/api/categories/${encodeURIComponent(String(b.category))}`);
            if (catRes.ok) {
              const cat = await catRes.json();
              b = { ...b, _categoryName: cat.name, _categoryColor: cat.color };
            }
          } catch (e) {
            // ignore
          }
        }
        setBlog(b);
      })
      .catch(() => setBlog(null))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [url, router]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Yazı bulunamadı.</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
      <main className="lg:col-span-2 prose lg:prose-xl max-w-none p-6 bg-transparent">
        <div className="mb-2">
          <CategoryBadge name={String((blog as any)._categoryName || blog.category || '')} color={(blog as any)._categoryColor} />        
        </div>
        <h1 className="text-4xl mb-2">{blog.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-6">
          <div className="text-zinc-500"><FontAwesomeIcon icon={faCalendarRegular} className="text-xs max-w-[1em] w-auto" /> {blog.date ? new Date(blog.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }) : ''}</div>
          <div className="text-zinc-500"><FontAwesomeIcon icon={faUserRegular} className="text-xs max-w-[1em] w-auto" /> {blog.author || ''}</div>
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: String(blog.content) }} />
      </main>

      <aside className="lg:col-span-1">
        <Sidebar />
      </aside>
    </div>
  );
}
