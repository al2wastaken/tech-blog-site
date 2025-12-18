'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Cat = { _id: string; name: string; slug?: string; color?: string };

export default function EditCategoryPage() {
  const params = (useParams() as any) || {};
  const id = params.id as string;
  const [cat, setCat] = useState<Cat | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    fetch(`/api/categories/${encodeURIComponent(id)}`).then((r) => r.json()).then((d) => setCat(d)).catch(() => setCat(null));
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    if (!cat) return;
    setSaving(true);
    const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-session-token': token }, body: JSON.stringify(cat) });
    setSaving(false);
    if (res.ok) router.push('/dashboard/categories');
    else { const data = await res.json().catch(()=>({})); alert(data.error || 'Hata'); }
  }

  if (!cat) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kategoriyi Düzenle</h1>
      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium">İsim</label>
          <input value={cat.name} onChange={(e) => setCat({ ...cat, name: e.target.value })} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input value={cat.slug || ''} onChange={(e) => setCat({ ...cat, slug: e.target.value })} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Renk (hex)</label>
          <input type="color" value={cat.color || '#000000'} onChange={(e) => setCat({ ...cat, color: e.target.value })} className="w-12 h-8 p-0 border rounded" />
        </div>
        <div>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </div>
      </form>
    </div>
  );
}
