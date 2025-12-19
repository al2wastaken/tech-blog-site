"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { LoginModal, RegisterModal } from "./AuthModals";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; administrator: boolean } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

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
    const updateUser = () => {
      const name = window.localStorage.getItem("session_name");
      const admin = window.localStorage.getItem("session_admin");
      if (!name) {
        setUser(null);
        return;
      }
      setUser({ name, administrator: admin === "1" });
    };
    updateUser();
    window.addEventListener('session-logout', updateUser);
    window.addEventListener('session-login', updateUser);
    return () => {
      window.removeEventListener('session-logout', updateUser);
      window.removeEventListener('session-login', updateUser);
    };
  }, []);


  function handleLogout() {
    window.localStorage.removeItem("session_token");
    window.localStorage.removeItem("session_name");
    window.localStorage.removeItem("session_admin");
    // ensure other parts of the app know about logout
    window.dispatchEvent(new CustomEvent('session-logout'));
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
    // navigate to homepage and refresh (logins handled via modal)
    router.push("/");
    router.refresh();
  }

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownOpen && userBtnRef.current && !userBtnRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <header className="bg-zinc-900 border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-zinc-50">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" priority />
          <span className="">2<span className="text-blue-600">Bytes</span></span>
        </Link>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden text-zinc-50 text-2xl ml-auto"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menüyü Aç/Kapat"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
        {/* Giriş Yap veya Kullanıcı Bilgisi */}
        {!user ? (
          <button type="button" onClick={() => setLoginOpen(true)} className="hidden md:inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition ml-4">Giriş Yap</button>
        ) : (
          <div className="relative hidden md:inline-block ml-4">
            <button
              ref={userBtnRef}
              type="button"
              className="bg-zinc-900 text-zinc-50 px-4 py-2 rounded-full font-semibold border border-white/20 hover:bg-zinc-800 transition"
              tabIndex={0}
              onClick={e => e.preventDefault()}
              onMouseEnter={() => {
                if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 120);
              }}
            >
              {user.name}
            </button>
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-zinc-900 rounded-2xl shadow-lg border border-white/20 z-50 animate-fade-in"
                onMouseEnter={() => {
                  if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                  setDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 120);
                }}
              >
                <ul>
                  {user.administrator && (
                    <li>
                      <button className="w-full text-left px-4 py-2 rounded-2xl border border-zinc-900 hover:border-white/20 hover:bg-zinc-800 transition" onMouseDown={(e) => { e.preventDefault(); router.push("/dashboard"); }}>Dashboard</button>
                    </li>
                  )}
                  <li>
                    <button className="w-full text-left px-4 py-2 rounded-2xl border border-zinc-900 hover:border-white/20 hover:bg-zinc-800 transition" onMouseDown={(e) => { e.preventDefault(); handleLogout(); }}>Çıkış Yap</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-zinc-900 shadow-lg">
          <ul className="flex flex-col gap-2 py-4 px-6 text-base">
            {!user ? (
              <li><button type="button" onClick={() => setLoginOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition mt-6">Giriş Yap</button></li>
            ) : (
              <>
                <li>
                  <span className="block bg-zinc-800 text-zinc-50 px-4 py-2 rounded-full font-semibold border border-white/20 mt-2 cursor-default">{user.name}</span>
                </li>
                {user.administrator && (
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-zinc-800 transition" onClick={() => router.push("/dashboard")}>Dashboard</button>
                  </li>
                )}
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-zinc-800 transition" onClick={handleLogout}>Çıkış Yap</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
      {/* Modals */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} user={user} onLogout={handleLogout} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </header>
  );
}
