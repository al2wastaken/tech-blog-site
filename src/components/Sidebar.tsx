import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-80 flex-shrink-0 md:pl-0 pl-0 sm:pl-0">
      {/* Search Widget */}
      <div className="bg-zinc-900 rounded-lg shadow p-4 mb-4">
        <form className="flex flex-row gap-2">
          <input type="text" placeholder="Site içi ara..." className="flex-1 min-w-0 h-10 px-4 rounded border border-white/20 focus:outline-none" />
          <button type="submit" className="h-10 px-4 bg-blue-600 text-white rounded font-semibold shrink-0 flex items-center justify-center"><FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs max-w-[1em]" /></button>
        </form>
      </div>
      {/* Categories Widget */}
      <div className="bg-zinc-900 rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-lg font-bold mb-4">Kategoriler</h3>
        <ul className="space-y-2">
          <li><Link href="#" className="flex justify-between hover:text-blue-600">Yapay Zeka <span className="text-xs text-zinc-500">(12)</span></Link></li>
          <li><Link href="#" className="flex justify-between hover:text-blue-600">Web Geliştirme <span className="text-xs text-zinc-500">(8)</span></Link></li>
          <li><Link href="#" className="flex justify-between hover:text-blue-600">Siber Güvenlik <span className="text-xs text-zinc-500">(5)</span></Link></li>
          <li><Link href="#" className="flex justify-between hover:text-blue-600">Mobil Teknoloji <span className="text-xs text-zinc-500">(15)</span></Link></li>
        </ul>
      </div>
      {/* Newsletter Widget */}
      <div className="bg-zinc-900 rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-bold mb-2">Bültene Katıl</h3>
        <p className="mb-2">En yeni teknoloji haberleri her hafta mail kutunda.</p>
        <input type="email" placeholder="E-posta adresin" className="w-full px-4 py-2 rounded border border-white/20 mb-2 focus:outline-none" />
      </div>
    </aside>
  );
}
