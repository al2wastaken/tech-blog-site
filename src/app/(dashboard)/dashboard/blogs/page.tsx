"use client";

import { useEffect, useState } from 'react';
import CategoryBadge from '@/components/CategoryBadge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Modal from '@/components/Modal';

type Blog = {
  _id: string;
  title: string;
  date?: string;
  author?: string;
  // category may be stored as id/slug/name string or populated as an object
  category?: string | { name: string; color?: string };
};

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string; color?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    // fetch all categories once, then fetch blogs and merge category info from local categories array
    Promise.all([fetch('/api/categories').then((r) => r.json()), fetch('/api/blogs').then((r) => r.json())])
      .then(([cats, blogsData]) => {
        const catsList = cats || [];
        setCategories(catsList);
        const merged = (blogsData || []).map((b: any) => {
          if (!b) return b;
          // if blog stores category as id (string), look up in catsList
          if (b.category && typeof b.category === 'string') {
            const found = catsList.find((c: any) => String(c._id) === String(b.category));
            return { ...b, category: found ? { name: found.name, color: found.color } : b.category } as Blog;
          }
          if (b.category && typeof b.category === 'object') {
            return { ...b, category: { name: b.category.name, color: b.category.color } } as Blog;
          }
          return b as Blog;
        });
        setBlogs(merged);
      })
      .catch(() => { setCategories([]); setBlogs([]); })
      .finally(() => setLoading(false));
  }, [router]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    setConfirmId(id);
    setConfirmOpen(true);
  }

  async function doDelete(id?: string | null) {
    const delId = id || confirmId;
    if (!delId) return;
    setConfirmOpen(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) {
      alert('Giriş yapmalısınız');
      return router.push('/login');
    }
    try {
      setDeletingId(delId);
      const res = await fetch(`/api/blogs/${encodeURIComponent(delId)}`, {
        method: 'DELETE',
        headers: { 'x-session-token': token },
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== delId));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Silme sırasında hata oluştu');
      }
    } catch (e) {
      alert('Silme isteği başarısız');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
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
          <li key={b._id} className="p-3 bg-zinc-900 rounded flex justify-between">
            <div>
                  <div className="font-semibold flex items-center gap-3">
                    <span>{b.title}</span>
                    {(() => {
                      // resolve category from state if blog stores id
                      let cat: any = null;
                      if (b.category && typeof b.category === 'string') {
                        cat = categories.find((c) => String(c._id) === String(b.category));
                      } else if (b.category && typeof b.category === 'object') {
                        cat = b.category;
                      }
                      if (!cat) return null;
                      return (
                        <>
                          <CategoryBadge name={cat.name} color={cat.color} />
                        </>
                      );
                    })()}
                  </div>
                  <div className="text-sm text-zinc-500">{b.date ? new Date(b.date).toLocaleString() : ''}</div>
                  <div className="text-sm text-zinc-500">{b.author}</div>
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
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Gönderiyi sil</h3>
          <p>Bu gönderiyi silmek istediğinize emin misiniz?</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
              onClick={() => setConfirmOpen(false)}
            >
              İptal
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={() => doDelete()}
              disabled={!!deletingId}
            >
              {deletingId ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
