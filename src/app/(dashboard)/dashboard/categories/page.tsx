'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Cat = { _id: string; name: string; slug?: string; color?: string };

export default function CategoriesAdminPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    fetch('/api/categories').then((r) => r.json()).then((d) => setCats(d || [])).finally(() => setLoading(false));
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm('Kategoriyi silmek istediğinize emin misiniz?')) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    setDeleting(id);
    const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-session-token': token } });
    setDeleting(null);
    if (res.ok) setCats((p) => p.filter((c) => c._id !== id));
    else { const data = await res.json().catch(()=>({})); alert(data.error || 'Hata'); }
  }

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        <Link href="/dashboard/categories/new" className="btn">Yeni Kategori</Link>
      </div>
      <ul className="space-y-2">
        {cats.map((c) => (
          <li key={c._id} className="p-3 bg-zinc-900 rounded flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div style={{ width: 20, height: 20, background: c.color || '#000' }} className="rounded" />
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-zinc-500">{c.slug}</div>
              </div>
            </div>
            <div className="space-x-2">
              <Link href={`/dashboard/categories/${c._id}`} className="text-blue-500">Düzenle</Link>
              <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id} className="btn btn-danger">{deleting === c._id ? 'Siliniyor...' : 'Sil'}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
