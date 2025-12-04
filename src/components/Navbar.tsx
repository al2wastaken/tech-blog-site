import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <header className="bg-white dark:bg-zinc-900 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
          <span className="inline-block"><FontAwesomeIcon icon={faMicrochip} className="text-xs max-w-[1em] w-auto" /></span> Tech<span className="text-blue-600">Log</span>
        </a>
        <nav>
          <ul className="flex gap-6 text-base">
            <li><a href="#" className="text-blue-600 font-bold transition-colors transition-all">Anasayfa</a></li>
            <li><a href="#Güncel-yazilar" className="font-bold hover:text-blue-600 transition-colors transition-all">İncelemeler</a></li>
            <li><a href="#" className="font-bold hover:text-blue-600 transition-colors transition-all">Yazılım</a></li>
            <li><a href="#" className="font-bold hover:text-blue-600 transition-colors transition-all">Hakkımızda</a></li>
          </ul>
        </nav>
        <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Abone Ol</a>
      </div>
    </header>
  );
}
