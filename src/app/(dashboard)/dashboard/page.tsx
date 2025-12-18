'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';

type Blog = { _id: string; title: string; date?: string; author?: string; category?: string };

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogCount, setBlogCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
        if (!token) {
          router.push('/login');
          return;
        }

        const [blogsRes, catsRes] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/categories'),
        ]);
        const blogsData = await blogsRes.json().catch(() => []);
        const catsData = await catsRes.json().catch(() => []);

        const usersRes = await fetch('/api/users', { headers: { 'x-session-token': token } });
        const usersData = usersRes.ok ? await usersRes.json().catch(() => []) : [];

        setBlogs(blogsData || []);
        setBlogCount(Array.isArray(blogsData) ? blogsData.length : (blogsData?.length ?? 0));
        setCategoryCount(Array.isArray(catsData) ? catsData.length : (catsData?.length ?? 0));
        setUserCount(Array.isArray(usersData) ? usersData.length : (usersData?.length ?? 0));
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900 rounded-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faNewspaper} className="text-white text-lg" />
          </div>
          <div>
            <div className="text-sm text-zinc-400">Bloglar</div>
            <div className="text-2xl font-bold">{blogCount}</div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 rounded-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faTags} className="text-white text-lg" />
          </div>
          <div>
            <div className="text-sm text-zinc-400">Kategoriler</div>
            <div className="text-2xl font-bold">{categoryCount}</div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 rounded-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faUsers} className="text-white text-lg" />
          </div>
          <div>
            <div className="text-sm text-zinc-400">Kullanıcılar</div>
            <div className="text-2xl font-bold">{userCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
