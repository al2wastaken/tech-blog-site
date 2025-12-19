"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRequireAdmin() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("session_token") : null;
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) {
          // If token invalid or not admin, redirect to home
          router.push('/');
        }
      })
      .catch(() => {
        router.push('/');
      });
  }, [router]);
}
