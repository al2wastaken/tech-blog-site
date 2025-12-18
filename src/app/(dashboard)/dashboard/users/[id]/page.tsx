'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type UserData = { _id: string; name: string; email: string; administrator?: boolean };

export default function EditUserPage() {
  const params = (useParams() as any) || {};
  const id = params.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    fetch(`/api/users/${encodeURIComponent(id)}`, { headers: { 'x-session-token': token } })
      .then((r) => r.json())
      .then((d) => setUser(d))
      .catch(() => setUser(null));
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    if (!user) return;
    setSaving(true);
    const body: any = { name: user.name, email: user.email, administrator: !!user.administrator };
    if (password && password.trim()) body.password = password;
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-session-token': token }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) router.push('/dashboard/users');
    else { const data = await res.json().catch(()=>({})); alert(data.error || 'Hata'); }
  }

  if (!user) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kullanıcıyı Düzenle</h1>
      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium">İsim</label>
          <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">E-posta</label>
          <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Şifre (boş bırakılırsa değişmez)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Yeni şifre (opsiyonel)" className="mt-1 w-full border p-2 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={!!user.administrator} onChange={(e) => setUser({ ...user, administrator: e.target.checked })} />
          <label className="text-sm">Yönetici</label>
        </div>
        <div>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </div>
      </form>
    </div>
  );
}
