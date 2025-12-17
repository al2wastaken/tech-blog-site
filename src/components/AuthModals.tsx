import React, { useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

export function LoginModal({ isOpen, onClose, user, onLogout }: { isOpen: boolean; onClose: () => void; user?: { name: string; administrator: boolean } | null; onLogout?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  // Modal açıldığında animasyon başlat
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

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
      // notify other parts of the app about the login
      window.dispatchEvent(new CustomEvent('session-login'));
      setTimeout(() => {
        onClose();
        try {
          const path = typeof window !== 'undefined' ? window.location.pathname : "/";
          if (path === "/login" || path === "/register") {
            router.push("/");
          } else {
            router.refresh();
          }
        } catch (e) {
          router.push("/");
        }
      }, 800);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleLogin}
        className={`flex flex-col gap-4 transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Giriş Yap</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-2 rounded border border-white/20 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-2 rounded border border-white/20 focus:outline-none"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Giriş Yap</button>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <div className="text-center text-sm mt-2">
          Hesabınız yok mu? <button type="button" className="text-blue-600 underline" onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-register-modal')); }}>Kayıt Ol</button>
        </div>
        {/* Eğer giriş yapılmışsa çıkış yap butonu göster */}
        {user && onLogout && (
          <button
            type="button"
            className="mt-2 bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition"
            onClick={onLogout}
          >
            Çıkış Yap
          </button>
        )}
      </form>
    </Modal>
  );
}

export function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [administrator, setAdministrator] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

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
      setTimeout(() => {
        onClose();
        window.dispatchEvent(new CustomEvent('open-login-modal'));
      }, 1200);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleRegister}
        className={`flex flex-col gap-4 transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Kayıt Ol</h2>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-4 py-2 rounded border border-white/20 focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-2 rounded border border-white/20 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-2 rounded border border-white/20 focus:outline-none"
          required
        />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={administrator} onChange={e => setAdministrator(e.target.checked)} />
          Yönetici olarak kaydol
        </label>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Kayıt Ol</button>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <div className="text-center text-sm mt-2">
          Zaten hesabınız var mı? <button type="button" className="text-blue-600 underline" onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-login-modal')); }}>Giriş Yap</button>
        </div>
      </form>
    </Modal>
  );
}
