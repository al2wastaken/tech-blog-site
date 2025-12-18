'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Blog = { _id: string; title: string; date?: string; author?: string; category?: string };

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  async function handleDelete(id: string) {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) {
      alert('Giriş yapmalısınız');
      return router.push('/login');
    }
    try {
      setDeletingId(id);
      const res = await fetch(`/api/blogs/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-session-token': token },
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Silme sırasında hata oluştu');
      }
    } catch (e) {
      alert('Silme isteği başarısız');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bloglar</h1>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/blogs/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            New Blog
          </Link>
        </div>
      </div>
      <ul className="space-y-3">
        {blogs.map((b) => (
          <li key={b._id} className="p-3 border border-white/20 rounded flex justify-between">
            <div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-zinc-500">{b.date ? new Date(b.date).toLocaleString() : ''}</div>
                  <div className="text-sm text-zinc-500">{b.category} — {b.author}</div>
            </div>
            <div className="space-x-2">
              <Link href={`/dashboard/blogs/${b._id}`} className="text-blue-600">Edit</Link>
              <button
                onClick={() => handleDelete(b._id)}
                disabled={deletingId === b._id}
                className="btn btn-danger"
              >
                {deletingId === b._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
