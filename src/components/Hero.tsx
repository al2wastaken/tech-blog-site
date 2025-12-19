import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay as faCirclePlayRegular } from "@fortawesome/free-regular-svg-icons";
import Container from "./Container";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";

function formatDate(date?: Date | string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return String(date);
  }
}

export default async function Hero() {
  await connectDB();
  const latest = await Blog.findOne().sort({ date: -1 }).lean();

  const defaultTitle = "Yapay Zeka Sanatı Nasıl Dönüştürüyor?";
  const defaultExcerpt = "Dall-E 3 ve Midjourney gibi araçların yaratıcı endüstriler üzerindeki devrimsel etkisini inceliyoruz.";

  if (!latest) {
    return (
      <section className="relative bg-gradient-to-br from-zinc-900 to-black py-14 sm:py-20">
        <div className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4">Günün Öne Çıkanı</span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-zinc-50 leading-tight">{defaultTitle}</h1>
            <p className="text-base sm:text-lg text-zinc-50 mb-6 max-w-xl sm:max-w-2xl mx-auto">{defaultExcerpt}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
              <Link href="#" className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition w-full sm:w-auto">Makaleyi Oku</Link>
              <Link href="#" className="bg-white border border-blue-600 text-blue-600 px-5 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition flex items-center gap-2 w-full sm:w-auto justify-center">
                Video İzle <FontAwesomeIcon icon={faCirclePlayRegular} className="text-sm max-w-[1em] w-auto" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // resolve category
  let category: any = null;
  if (latest.category && typeof latest.category === 'object') category = latest.category;
  else if ((latest as any).categoryId) category = await Category.findById((latest as any).categoryId).lean();

  const image = (latest as any).image || undefined;
  const title = latest.title || defaultTitle;
  const excerpt = latest.content ? String(latest.content).replace(/<[^>]*>/g, '').slice(0, 250) : defaultExcerpt;
  const url = latest.url || (latest._id ? String(latest._id) : '#');

  const tagStyle: any = {};
  if (category && category.color && /^#([0-9A-Fa-f]{6})$/.test(category.color)) {
    tagStyle.backgroundColor = category.color;
    const r = parseInt(category.color.slice(1, 3), 16);
    const g = parseInt(category.color.slice(3, 5), 16);
    const b = parseInt(category.color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    tagStyle.color = brightness > 125 ? '#000' : '#fff';
  }

  return (
    <section className="relative py-14 sm:py-20" style={image ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${String(image).replace(/'/g, "\\'")}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      <div className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4" style={tagStyle}>{(category && category.name) || 'Günün Öne Çıkanı'}</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-zinc-50 leading-tight">{title}</h1>
          <p className="text-base sm:text-lg text-zinc-50 mb-6 max-w-xl sm:max-w-2xl mx-auto">{excerpt}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
            <Link href={"/blogs/" + encodeURIComponent(String(url))} className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition w-full sm:w-auto">Makaleyi Oku</Link>
            <Link href="#" className="bg-white border border-blue-600 text-blue-600 px-5 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition flex items-center gap-2 w-full sm:w-auto justify-center">
              Video İzle <FontAwesomeIcon icon={faCirclePlayRegular} className="text-sm max-w-[1em] w-auto" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
