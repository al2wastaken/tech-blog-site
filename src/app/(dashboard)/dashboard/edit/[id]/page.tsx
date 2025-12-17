'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id as string;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Array<{ _id?: string; name: string }>>([]);
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    setSessionName(typeof window !== 'undefined' ? localStorage.getItem('session_name') || '' : '');

    (async () => {
      try {
        const [r, cRes] = await Promise.all([fetch(`/api/blogs/${id}`), fetch('/api/categories')]);
        const b = r.ok ? await r.json() : null;
        const cats = cRes.ok ? await cRes.json() : [];
        setCategories(cats || []);
        setTitle(b?.title || '');
        setContent(b?.content || '');
        setCategory(b?.category || (cats && cats[0]?.name) || '');
        setDate(b?.date ? new Date(b.date).toISOString().slice(0, 10) : '');
        setUrl(b?.url || '');
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('session_token');
    if (!token) return router.push('/login');
    setSaving(true);
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-session-token': token },
      body: JSON.stringify({ title, content, category, url, author: sessionName, date: date ? new Date(date).toISOString() : undefined }),
    });
    setSaving(false);
    if (res.ok) router.push('/dashboard');
    else alert('Failed to save');
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 w-full border p-2 rounded h-48" />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          {categories && categories.length > 0 ? (
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full border p-2 rounded">
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          ) : (
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full border p-2 rounded" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Dizin Yolu (URL slug)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="örn: benim-ilk-yazim" className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
