import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 mr-0 md:sticky md:top-0 md:h-screen h-auto self-start">
      <div className="bg-zinc-900 shadow p-4 mb-4 h-full">
        <h3 className="text-lg font-bold mb-3">Dashboard</h3>
        <ul className="space-y-2">
          <li><Link href="/dashboard" className="block px-2 py-1 rounded hover:bg-zinc-800">Genel Bilgiler</Link></li>
          <li><Link href="/dashboard/blogs" className="block px-2 py-1 rounded hover:bg-zinc-800">Bloglar</Link></li>
          <li><Link href="/dashboard/categories" className="block px-2 py-1 rounded hover:bg-zinc-800">Kategoriler</Link></li>
          <li><Link href="/dashboard/users" className="block px-2 py-1 rounded hover:bg-zinc-800">Kullanıcılar</Link></li>
        </ul>
      </div>
    </aside>
  );
}
