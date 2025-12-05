"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Giriş başarısız");
    } else {
      setSuccess("Giriş başarılı! Yönlendiriliyor...");
      if (data.token) {
        window.localStorage.setItem("session_token", data.token);
      }
      if (data.user) {
        window.localStorage.setItem("session_name", data.user.name);
        window.localStorage.setItem("session_admin", data.user.administrator ? "1" : "0");
      }
      setTimeout(() => router.push("/"), 1200);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-900 p-8 rounded shadow w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Giriş Yap</h2>
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
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Giriş Yap</button>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
      </form>
    </div>
  );
}
