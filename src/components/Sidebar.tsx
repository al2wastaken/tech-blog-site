import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-80 flex-shrink-0">
      {/* Search Widget */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
        <form className="flex">
          <input type="text" placeholder="Site içi ara..." className="flex-1 px-4 py-2 rounded-l border border-zinc-300 dark:border-zinc-700 focus:outline-none" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r"><FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs max-w-[1em] w-auto" /></button>
        </form>
      </div>
      {/* Categories Widget */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Kategoriler</h3>
        <ul className="space-y-2">
          <li><a href="#" className="flex justify-between hover:text-blue-600">Yapay Zeka <span className="text-xs text-zinc-500">(12)</span></a></li>
          <li><a href="#" className="flex justify-between hover:text-blue-600">Web Geliştirme <span className="text-xs text-zinc-500">(8)</span></a></li>
          <li><a href="#" className="flex justify-between hover:text-blue-600">Siber Güvenlik <span className="text-xs text-zinc-500">(5)</span></a></li>
          <li><a href="#" className="flex justify-between hover:text-blue-600">Mobil Teknoloji <span className="text-xs text-zinc-500">(15)</span></a></li>
        </ul>
      </div>
      {/* Newsletter Widget */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-2">Bültene Katıl</h3>
        <p className="mb-2">En yeni teknoloji haberleri her hafta mail kutunda.</p>
        <input type="email" placeholder="E-posta adresin" className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 mb-2 focus:outline-none" />
        <button className="bg-blue-600 text-white w-full py-2 rounded font-semibold hover:bg-blue-700 transition">Abone Ol</button>
      </div>
    </aside>
  );
}
