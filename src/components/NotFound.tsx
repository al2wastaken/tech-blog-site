import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.history.replaceState) {
      window.history.replaceState(null, "", window.location.href);
    }
    // 404 status manipülasyonu
    if (typeof document !== "undefined") {
      // Next.js'de SSR'da status kodu ayarlamak için özel bir handler gerekir, client-side'da ise fetch ile test edilebilir.
      document.title = "404 - Sayfa Bulunamadı";
    }
  }, []);

  if (typeof window !== "undefined") {
    // Client-side: fetch ile 404 status döndürülüp döndürülmediği test edilebilir
    fetch(window.location.href, { method: "HEAD" }).then((res) => {
      if (res.status !== 404) {
        // Manipülasyon: 404 statusu yoksa, bir hata mesajı göster
        // ...
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Bu sayfaya erişim yetkiniz yok veya bulunamadı.</p>
      <Link href="/" className="text-blue-600 underline">Anasayfaya Dön</Link>
    </div>
  );
}
