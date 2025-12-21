import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-zinc-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 xl:px-16 2xl:px-32 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logo.png" alt="2Bytes Logo" width={32} height={32} className="w-8 h-8 object-contain" />
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-50">2<span className="text-blue-600">Bytes</span></h3>
            </div>
            <p className="text-zinc-50 mb-4 text-sm sm:text-base">Teknoloji dünyasındaki son gelişmeleri, yazılım eğitimlerini ve donanım incelemelerini bulabileceğiniz güncel kaynak.</p>
          </div>
        </div>
      <div className="container mx-auto px-4 sm:px-6 xl:px-16 2xl:px-32 pt-4 text-center text-zinc-50 text-xs sm:text-sm">
        &copy; 2025 2Bytes. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
  