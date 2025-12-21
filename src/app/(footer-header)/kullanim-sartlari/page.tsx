import React from "react";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Kullanım Şartları</h1>
      <p className="text-zinc-300 mb-4">
        Siteyi kullanmadan önce lütfen bu kullanım şartlarını okuyun. Site içeriği bilgilendirme amaçlıdır ve
        kullanıcıların içerikleri paylaşımı ile ilgili kurallar bu sayfada belirtilmiştir.
      </p>
      <h2 className="text-lg font-semibold mt-4 mb-2">Sorumluluk</h2>
      <p className="text-zinc-300 mb-2">Yazarların görüşleri kendilerine aittir; site, içeriklerin doğruluğu konusunda garanti vermez.</p>
    </div>
  );
}
