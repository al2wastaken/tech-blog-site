import Link from "next/link";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import CategoryBadge from "./CategoryBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser as faUserRegular, faCalendar as faCalendarRegular } from "@fortawesome/free-regular-svg-icons";

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

  let category: any = null;
  if (latest) {
    if (latest.category) {
      const cat = (latest as any).category;
      if (typeof cat === 'object' && (cat.name || cat._id)) {
        category = cat;
      } else {
        try {
          category = await Category.findById(cat).lean();
        } catch {
          category = null;
        }
      }
    } else if ((latest as any).categoryId) {
      try {
        category = await Category.findById((latest as any).categoryId).lean();
      } catch {
        category = null;
      }
    }
  }

  const image = (latest as any).image || undefined;
  const title = latest.title;
  const excerpt = String(latest.content).replace(/<[^>]*>/g, '').slice(0, 245) + "...";
  const url = latest.url || (latest._id ? String(latest._id) : '#');
  const author = (latest as any).author || 'Yazar';
  const dateStr = formatDate((latest as any).date);

  // use CategoryBadge component to render category with proper color handling

  return (
    <section className="container mx-auto bg-zinc-900 overflow-hidden">
      <div className="border border-white/20 rounded-2xl my-4 py-24 px-4 sm:px-6 xl:px-16 2xl:px-32 mx-4 sm:mx-6 xl:mx-16 2xl:mx-32" style={image ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${String(image).replace(/'/g, "\\'")}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <CategoryBadge name={(category && category.name) || 'Genel'} color={category?.color} className="px-3 py-1 rounded-full text-xs sm:text-sm mb-4" />
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 text-zinc-50 leading-tight">{title}</h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-300 mb-4">
          <span><FontAwesomeIcon icon={faCalendarRegular} className="text-xs max-w-[1em] w-auto" /> {dateStr}</span>
          <span><FontAwesomeIcon icon={faUserRegular} className="text-xs max-w-[1em] w-auto" /> {author}</span>
        </div>
        <p className="text-base sm:text-lg text-zinc-50 mb-6 max-w-xl sm:max-w-2xl mr-auto">{excerpt}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start w-full sm:w-auto">
          <Link href={"/blogs/" + encodeURIComponent(String(url))} className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition w-full sm:w-auto">Devamını Oku</Link>
        </div>
      </div>
    </section>
  );
}
