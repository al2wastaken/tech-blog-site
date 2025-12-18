'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
      .then((data) => {
        if (!mounted) return;
        setBlog(data || null);
      })
      .catch(() => setBlog(null))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [url, router]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Yazı bulunamadı.</div>;

  return (
    <div className="prose lg:prose-xl max-w-3xl mx-auto p-6">
      <h1>{blog.title}</h1>
      <div className="text-sm text-zinc-500 mb-4">{blog.category} — {blog.date ? new Date(blog.date).toLocaleString() : ''} — {blog.author}</div>
      <div dangerouslySetInnerHTML={{ __html: String(blog.content) }} />
    </div>
  );
}
