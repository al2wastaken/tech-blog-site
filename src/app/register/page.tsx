"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [administrator, setAdministrator] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, administrator }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Kayıt başarısız");
    } else {
      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyor...");
      setTimeout(() => router.push("/login"), 1200);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleRegister} className="bg-white dark:bg-zinc-900 p-8 rounded shadow w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Kayıt Ol</h2>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 focus:outline-none"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={administrator}
            onChange={e => setAdministrator(e.target.checked)}
          />
          Yönetici (administrator)
        </label>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Kayıt Ol</button>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
      </form>
    </div>
  );
}
