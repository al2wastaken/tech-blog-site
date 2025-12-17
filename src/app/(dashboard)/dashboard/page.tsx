'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Blog = { _id: string; title: string; date?: string; author?: string; category?: string };

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/blogs')
      .then((r) => r.json())
      .then((data) => setBlogs(data || []))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/categories/new"
            className="inline-block bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-3 py-2 rounded border border-zinc-700"
          >
            New Category
          </Link>
          <Link
            href="/dashboard/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            New Blog
          </Link>
        </div>
      </div>
      <ul className="space-y-3">
        {blogs.map((b) => (
          <li key={b._id} className="p-3 border rounded flex justify-between">
            <div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-zinc-500">{b.date ? new Date(b.date).toLocaleString() : ''}</div>
                  <div className="text-sm text-zinc-500">{b.category} — {b.author}</div>
            </div>
            <div className="space-x-2">
              <Link href={`/dashboard/edit/${b._id}`} className="text-blue-600">Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
