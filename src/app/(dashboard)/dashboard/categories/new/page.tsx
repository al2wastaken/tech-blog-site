'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCategoryPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#000000');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) {
      alert('Giriş yapmalısınız');
      return router.push('/login');
    }
    if (!name.trim()) return alert('İsim gerekli');
    setSaving(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session-token': token },
      body: JSON.stringify({ name: name.trim(), slug: slug.trim() || undefined, color: color }),
    });
    setSaving(false);
    if (res.ok) {
      router.push('/dashboard/categories');
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Kayıt sırasında hata oluştu');
    }
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Yeni Kategori Oluştur</h1>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Kategori Adı</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Dizin (opsiyonel)</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="örn: web-gelistirme" className="mt-1 w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Renk (hex)</label>
          <div className="mt-1">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-8 p-0 border rounded" />
            <input value={color} onChange={(e) => setColor(e.target.value)} className="ml-3 mt-1 border p-2 rounded" />
          </div>
        </div>
        <div>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Oluştur'}</button>
        </div>
      </form>
    </div>
  );
}
