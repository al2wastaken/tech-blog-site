'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

type User = { _id: string; name: string; email: string; administrator?: boolean };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    fetch('/api/users', { headers: { 'x-session-token': token } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          // show error and keep users as empty array to avoid crash
          if (data && (data.error || data.message)) alert(data.error || data.message);
          setUsers([]);
          // if unauthorized/forbidden, redirect to login
          if (data && (data.error === 'Unauthorized' || data.error === 'Invalid token' || data.error === 'Forbidden')) {
            router.push('/login');
          }
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kullanıcılar</h1>
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u._id} className="p-3 bg-zinc-900 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.name} {u.administrator ? <span className="text-xs text-green-400">(Admin)</span> : null}</div>
              <div className="text-sm text-zinc-500">{u.email}</div>
            </div>
            <div>
              <Link href={`/dashboard/users/${u._id}`} className="text-blue-500">Düzenle</Link>
              <button
                onClick={() => { setConfirmId(u._id); setConfirmOpen(true); }}
                disabled={deleting === u._id}
                className="ml-3 btn btn-danger"
              >
                {deleting === u._id ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Kullanıcıyı sil</h3>
          <p>Bu kullanıcıyı silmek istediğinize emin misiniz?</p>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600" onClick={() => setConfirmOpen(false)}>İptal</button>
            <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={async () => {
              const id = confirmId;
              if (!id) return;
              setConfirmOpen(false);
              const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
              if (!token) return router.push('/login');
              setDeleting(id);
              const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-session-token': token } });
              setDeleting(null);
              setConfirmId(null);
              if (res.ok) setUsers((p) => p.filter((x) => x._id !== id));
              else { const data = await res.json().catch(()=>({})); alert(data.error || 'Hata'); }
            }} disabled={!!deleting}>{deleting ? 'Siliniyor...' : 'Sil'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
