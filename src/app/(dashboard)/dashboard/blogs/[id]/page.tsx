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
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
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
        setCategory(b?.category || (cats && cats[0]?._id) || '');
        setDate(b?.date ? new Date(b.date).toISOString().slice(0, 10) : '');
        setImageUrl(b?.image || '');
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
      body: JSON.stringify({ title, content, category, url, author: sessionName, date: date ? new Date(date).toISOString() : undefined, image: imageUrl || undefined }),
    });
    setSaving(false);
    if (res.ok) router.push('/dashboard');
    else alert('Failed to save');
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
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
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full border p-2 rounded bg-zinc-950">
              {categories.map((c) => (
                <option key={c._id || c.name} value={c._id}>{c.name}</option>
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
              <div className="mt-2">
                <button type="button" onClick={() => setImageUrl('')} className="text-sm text-red-500">Resmi Kaldır</button>
              </div>
            </div>
          ) : null}
        </div>
        <div>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
