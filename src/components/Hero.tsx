import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay as faCirclePlayRegular } from "@fortawesome/free-regular-svg-icons";
import Container from "./Container";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-100 to-zinc-50 dark:from-zinc-900 dark:to-black py-14 sm:py-20">
      <div className="absolute inset-0 bg-black opacity-10 dark:opacity-40 pointer-events-none" />
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4">Günün Öne Çıkanı</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50 leading-tight">Yapay Zeka Sanatı Nasıl Dönüştürüyor?</h1>
          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 mb-6 max-w-xl sm:max-w-2xl mx-auto">Dall-E 3 ve Midjourney gibi araçların yaratıcı endüstriler üzerindeki devrimsel etkisini inceliyoruz.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
            <a href="#" className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition w-full sm:w-auto">Makaleyi Oku</a>
            <a href="#" className="bg-white border border-blue-600 text-blue-600 px-5 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition flex items-center gap-2 w-full sm:w-auto justify-center">
              Video İzle <FontAwesomeIcon icon={faCirclePlayRegular} className="text-sm max-w-[1em] w-auto" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
