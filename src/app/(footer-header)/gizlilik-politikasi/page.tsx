import React from "react";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Gizlilik Politikası</h1>
      <p className="text-zinc-300 mb-4">
        Bu sayfa, site kullanıcılarının gizliliğini nasıl koruduğumuzu ve hangi verileri topladığımızı açıklar.
      </p>
      <h2 className="text-lg font-semibold mt-4 mb-2">Toplanan Bilgiler</h2>
      <p className="text-zinc-300 mb-2">Ziyaretçi davranışlarına ilişkin anonimleştirilmiş veriler ve form ile sağlanan iletişim bilgileri toplanabilir.</p>
      <h2 className="text-lg font-semibold mt-4 mb-2">Kullanım</h2>
      <p className="text-zinc-300 mb-2">Toplanan veriler hizmetin iyileştirilmesi ve kullanıcı deneyiminin geliştirilmesi amacıyla kullanılmaktadır.</p>
    </div>
  );
}
