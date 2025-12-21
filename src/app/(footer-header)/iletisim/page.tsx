"use client";
import React, { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Gönderiliyor...");
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error || 'Gönderilemedi');
        return;
      }
      setStatus('Mesajınız alındı. Teşekkürler!');
      setName(''); setEmail(''); setMessage('');
    } catch (e) {
      setStatus('Sunucu ile bağlantı kurulamadı');
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">İletişim</h1>
      <p className="text-zinc-300 mb-6">Bizimle iletişime geçmek için aşağıdaki formu kullanın veya <a href="mailto:info@example.com" className="text-blue-500">info@example.com</a> adresine e-posta gönderin.</p>

      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm mb-1">İsim</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10" />
        </div>
        <div>
          <label className="block text-sm mb-1">E-posta</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10" />
        </div>
        <div>
          <label className="block text-sm mb-1">Mesaj</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10" />
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Gönder</button>
        </div>
        {status && <div className="text-sm text-zinc-300">{status}</div>}
      </form>
    </div>
  );
}
