'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type User = { _id: string; name: string; email: string; administrator?: boolean };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
    if (!token) return router.push('/login');
    fetch('/api/users', { headers: { 'x-session-token': token } })
      .then((r) => r.json())
      .then((data) => setUsers(data || []))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kullanıcılar</h1>
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u._id} className="p-3 bg-zinc-900 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.name} {u.administrator ? <span className="text-xs text-green-400">(Admin)</span> : null}</div>
              <div className="text-sm text-zinc-500">{u.email}</div>
            </div>
            <div>
              <Link href={`/dashboard/users/${u._id}`} className="text-blue-500">Düzenle</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
