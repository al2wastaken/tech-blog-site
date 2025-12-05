import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 py-8 sm:py-10 mt-8 sm:mt-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="2Bytes Logo" className="w-8 h-8 object-contain" />
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">2<span className="text-blue-600">Bytes</span></h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 mb-4 text-sm sm:text-base">Teknoloji dünyasındaki son gelişmeleri, yazılım eğitimlerini ve donanım incelemelerini bulabileceğiniz güncel kaynak.</p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="text-zinc-500 hover:text-blue-600"><FontAwesomeIcon icon={faTwitter} className="text-sm max-w-[1em] w-auto" /></a>
              <a href="#" className="text-zinc-500 hover:text-blue-600"><FontAwesomeIcon icon={faInstagram} className="text-sm max-w-[1em] w-auto" /></a>
              <a href="#" className="text-zinc-500 hover:text-blue-600"><FontAwesomeIcon icon={faLinkedinIn} className="text-sm max-w-[1em] w-auto" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-50">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 text-sm sm:text-base">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-blue-600 text-sm sm:text-base">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-blue-600 text-sm sm:text-base">Kullanım Şartları</a></li>
              <li><a href="#" className="hover:text-blue-600 text-sm sm:text-base">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-50">Son Eklenenler</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 text-sm sm:text-base">Python ile Veri Analizi</a></li>
              <li><a href="#" className="hover:text-blue-600 text-sm sm:text-base">Bulut Bilişim Nedir?</a></li>
              <li><a href="#" className="hover:text-blue-600 text-sm sm:text-base">5G Teknolojisi</a></li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-zinc-300 dark:border-zinc-700 pt-4 text-center text-zinc-500 text-xs sm:text-sm">
        &copy; 2025 2Bytes. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
  