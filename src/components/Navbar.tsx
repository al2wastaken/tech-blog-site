"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { LoginModal, RegisterModal } from "./AuthModals";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; administrator: boolean } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const router = useRouter();

  // Modal tetikleyicileri arası geçiş için event dinleyicileri
  useEffect(() => {
    const openLogin = () => setLoginOpen(true);
    const openRegister = () => setRegisterOpen(true);
    window.addEventListener('open-login-modal', openLogin);
    window.addEventListener('open-register-modal', openRegister);
    return () => {
      window.removeEventListener('open-login-modal', openLogin);
      window.removeEventListener('open-register-modal', openRegister);
    };
  }, []);

  useEffect(() => {
    const name = window.localStorage.getItem("session_name");
    const admin = window.localStorage.getItem("session_admin");
    if (!name) {
      setUser(null);
      return;
    }
    setUser({ name, administrator: admin === "1" });
  }, []);

  function handleAccountClick() {
    if (user?.administrator) {
      router.push("/dashboard");
    } else {
      window.localStorage.removeItem("session_token");
      window.localStorage.removeItem("session_name");
      window.localStorage.removeItem("session_admin");
      setUser(null);
      router.push("/login");
    }
  }

  return (
    <header className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="">2<span className="text-blue-600">Bytes</span></span>
        </a>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden text-zinc-900 dark:text-zinc-50 text-2xl ml-auto"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menüyü Aç/Kapat"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-6 text-base">
            <li><a href="#" className="text-blue-600 font-bold transition-colors transition-all">Anasayfa</a></li>
            <li><a href="#Güncel-yazilar" className="font-bold hover:text-blue-600 transition-colors transition-all">İncelemeler</a></li>
            <li><a href="#" className="font-bold hover:text-blue-600 transition-colors transition-all">Yazılım</a></li>
            <li><a href="#" className="font-bold hover:text-blue-600 transition-colors transition-all">Hakkımızda</a></li>
          </ul>
        </nav>
        {/* Giriş Yap veya Kullanıcı Bilgisi */}
        {!user ? (
          <button type="button" onClick={() => setLoginOpen(true)} className="hidden md:inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition ml-4">Giriş Yap</button>
        ) : (
          <button onClick={handleAccountClick} className="hidden md:inline-block bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 px-4 py-2 rounded-full font-semibold border border-zinc-300 dark:border-zinc-700 ml-4 hover:bg-blue-50 dark:hover:bg-zinc-700 transition">
            {user.name}
          </button>
        )}
      </div>
      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-zinc-900 shadow-lg">
          <ul className="flex flex-col gap-2 py-4 px-6 text-base">
            <li><a href="#" className="text-blue-600 font-bold transition-colors transition-all">Anasayfa</a></li>
            <li><a href="#Güncel-yazilar" className="font-bold hover:text-blue-600 transition-colors transition-all">İncelemeler</a></li>
            <li><a href="#" className="font-bold hover:text-blue-600 transition-colors transition-all">Yazılım</a></li>
            <li><a href="#" className="font-bold hover:text-blue-600 transition-colors transition-all">Hakkımızda</a></li>
            {!user ? (
              <li><button type="button" onClick={() => setLoginOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition mt-2">Giriş Yap</button></li>
            ) : (
              <li><button onClick={handleAccountClick} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 px-4 py-2 rounded-full font-semibold border border-zinc-300 dark:border-zinc-700 mt-2 hover:bg-blue-50 dark:hover:bg-zinc-700 transition">{user.name}</button></li>
            )}
          </ul>
        </nav>
      )}
      {/* Modals */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </header>
  );
}
