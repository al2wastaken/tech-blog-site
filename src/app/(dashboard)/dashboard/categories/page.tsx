'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

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
    if (!token) return router.push('/login');
    setDeleting(delId);
    const res = await fetch(`/api/categories/${encodeURIComponent(delId)}`, { method: 'DELETE', headers: { 'x-session-token': token } });
    setDeleting(null);
    if (res.ok) setCats((p) => p.filter((c) => c._id !== delId));
    else { const data = await res.json().catch(()=>({})); alert(data.error || 'Hata'); }
    setConfirmId(null);
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
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Kategoriyi sil</h3>
          <p>Kategoriyi silmek istediğinize emin misiniz?</p>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600" onClick={() => setConfirmOpen(false)}>İptal</button>
            <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => doDelete()} disabled={!!deleting}>{deleting ? 'Siliniyor...' : 'Sil'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
