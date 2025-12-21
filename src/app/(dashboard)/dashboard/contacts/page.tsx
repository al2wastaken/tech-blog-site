"use client";
import React, { useEffect, useState } from "react";
import useRequireAdmin from "@/lib/useRequireAdmin";

type Contact = {
  _id: string;
  name: string;
  email: string;
  message: string;
  ip?: string;
  createdAt?: string;
};

export default function ContactsPage() {
  useRequireAdmin();
  const [items, setItems] = useState<Contact[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    setLoading(true);
    fetch('/api/contacts', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.json())
      .then((data) => { if (mounted) setItems(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setItems([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function remove(id: string) {
    if (!confirm('Bu girdiyi silmek istediğinize emin misiniz?')) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    try {
      const res = await fetch('/api/contacts', { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ id }) });
      const data = await res.json();
      if (!res.ok) { alert(data?.error || 'Silme başarısız'); return; }
      setItems((s) => (s || []).filter(i => i._id !== id));
    } catch (e) {
      alert('Sunucu hatası');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!items || items.length === 0) return <div>Henüz ileti gönderilmemiş.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">İletişim Mesajları</h1>
      <div className="space-y-4">
        {items.map((c) => (
          <div key={c._id} className="p-4 bg-zinc-900 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.name} <span className="text-sm text-zinc-500">({c.email})</span></div>
                <div className="text-xs text-zinc-500">IP: {c.ip || '—'} • {new Date(c.createdAt || '').toLocaleString()}</div>
              </div>
              <div>
                <button onClick={() => remove(c._id)} className="px-3 py-1 bg-red-600 text-white rounded">Sil</button>
              </div>
            </div>
            <div className="mt-3 text-zinc-300">{c.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
