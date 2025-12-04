import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 py-10 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">Tech<span className="text-blue-600">Log</span></h3>
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">Teknoloji dünyasındaki son gelişmeleri, yazılım eğitimlerini ve donanım incelemelerini bulabileceğiniz güncel kaynak.</p>
          <div className="flex gap-4">
            <a href="#" className="text-zinc-500 hover:text-blue-600"><FontAwesomeIcon icon={faTwitter} className="text-sm max-w-[1em] w-auto" /></a>
            <a href="#" className="text-zinc-500 hover:text-blue-600"><FontAwesomeIcon icon={faInstagram} className="text-sm max-w-[1em] w-auto" /></a>
            <a href="#" className="text-zinc-500 hover:text-blue-600"><FontAwesomeIcon icon={faLinkedinIn} className="text-sm max-w-[1em] w-auto" /></a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-50">Hızlı Linkler</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600">Hakkımızda</a></li>
            <li><a href="#" className="hover:text-blue-600">Gizlilik Politikası</a></li>
            <li><a href="#" className="hover:text-blue-600">Kullanım Şartları</a></li>
            <li><a href="#" className="hover:text-blue-600">İletişim</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-50">Son Eklenenler</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600">Python ile Veri Analizi</a></li>
            <li><a href="#" className="hover:text-blue-600">Bulut Bilişim Nedir?</a></li>
            <li><a href="#" className="hover:text-blue-600">5G Teknolojisi</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-300 dark:border-zinc-700 pt-4 text-center text-zinc-500 text-sm">
        &copy; 2024 TechVerse. Tüm hakları saklıdır. Kodlama Desteği ile oluşturuldu.
      </div>
    </footer>
  );
}
