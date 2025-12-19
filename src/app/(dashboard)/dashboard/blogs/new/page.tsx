'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [categories, setCategories] = useState<Array<{ _id?: string; name: string }>>([]);
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
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
          setCategory(data[0]._id);
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
      body: JSON.stringify({ title, content, category, url: url || undefined, author: sessionName, date: new Date(date).toISOString(), image: imageUrl || undefined }),
    });
    setSaving(false);
    if (res.ok) router.push('/dashboard/blogs');
    else alert('Failed to create');
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = localStorage.getItem('session_token') || '';
      const res = await fetch('/api/upload', { method: 'POST', body: fd, headers: token ? { 'x-session-token': token } : undefined as any });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data && data.url) setImageUrl(data.url);
    } catch (err) {
      alert('Resim yüklenemedi');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          {categories && categories.length > 0 ? (
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full border p-2 rounded bg-zinc-950">
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
          <label className="block text-sm font-medium">Resim (projeye yükle veya URL gir)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full" />
          <div className="mt-2">
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Opsiyonel: veya resim URL'si girin" className="w-full border p-2 rounded" />
          </div>
          {uploading ? <div className="text-sm text-zinc-400 mt-2">Yükleniyor...</div> : null}
          {imageUrl ? (
            <div className="mt-2">
              <img src={imageUrl} alt="preview" className="rounded max-h-48 object-cover" />
            </div>
          ) : null}
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
