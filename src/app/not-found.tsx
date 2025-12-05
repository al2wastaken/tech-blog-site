"use client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">Aradığınız sayfa bulunamadı.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Ana Sayfaya Dön
        </button>
      </div>
      <Footer />
    </div>
  );
}
