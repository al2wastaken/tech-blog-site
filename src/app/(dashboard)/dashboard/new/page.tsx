'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [categories, setCategories] = useState<Array<{ _id?: string; name: string }>>([]);
  const [url, setUrl] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const router = useRouter();

  useEffect(() => {
    setSessionName(typeof window !== 'undefined' ? localStorage.getItem('session_name') || '' : '');
    // fetch categories from API
    (async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data || []);
        if ((!category || category === 'general') && data && data.length) {
          setCategory(data[0].name);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('session_token');
    if (!token) return router.push('/login');
    setSaving(true);
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': token,
      },
      body: JSON.stringify({ title, content, category, url: url || undefined, author: sessionName, date: new Date(date).toISOString() }),
    });
    setSaving(false);
    if (res.ok) router.push('/dashboard');
    else alert('Failed to create');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border p-2 rounded" />
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
          <label className="block text-sm font-medium">Author</label>
          <div className="mt-1 w-full p-2 rounded border bg-zinc-50/5">{sessionName || '—'}</div>
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 w-full border p-2 rounded h-48" />
        </div>
        <div>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
