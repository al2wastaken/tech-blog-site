import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular, faCalendar as faCalendarRegular } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import CategoryBadge from "./CategoryBadge";

type BlogCardProps = {
  image: string;
  category: string;
  categoryColor: string;
  date: string;
  author: string;
  title: string;
  description: string;
  url: string;
};

export default function BlogCard({ image, category, categoryColor, date, author, title, description, url }: BlogCardProps) {

  const excerpt = String(description).replace(/<[^>]*>/g, '').slice(0, 245) + "...";

  return (
    <article className="bg-zinc-900 hover:bg-zinc-800 border border-white/20 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-0 sm:gap-6 transition">
      <div className="h-40 sm:h-48 w-full sm:w-64 rounded-xl bg-cover bg-center mb-4 sm:mb-0 relative flex-shrink-0 overflow-hidden">
        {/* Use Image as background for better responsiveness when possible */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} aria-hidden="true" />
        <div className="absolute top-2 left-2">
          <CategoryBadge name={category} color={categoryColor}/>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-500 mb-2">
          <span><FontAwesomeIcon icon={faCalendarRegular} className="text-xs max-w-[1em] w-auto" /> {date}</span>
          <span><FontAwesomeIcon icon={faUserRegular} className="text-xs max-w-[1em] w-auto" /> {author}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
        <p className="mb-2 text-sm sm:text-base">{excerpt}</p>
        <Link href={`/blogs/${encodeURIComponent(String(url))}`} className="text-blue-600 font-medium flex items-center gap-1 text-sm sm:text-base">Devamını Oku <FontAwesomeIcon icon={faArrowRight} className="text-xs max-w-[1em] w-auto" /></Link>
      </div>
    </article>
  );
}
