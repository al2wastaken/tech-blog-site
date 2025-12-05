import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular, faCalendar as faCalendarRegular } from "@fortawesome/free-regular-svg-icons";
import React from "react";

type BlogCardProps = {
  image: string;
  category: string;
  categoryColor: string;
  date: string;
  author: string;
  title: string;
  description: string;
};

export default function BlogCard({ image, category, categoryColor, date, author, title, description }: BlogCardProps) {
  return (
    <article className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-0 sm:gap-6">
      <div className="h-40 sm:h-48 w-full sm:w-64 rounded-lg bg-cover bg-center mb-4 sm:mb-0 relative flex-shrink-0" style={{ backgroundImage: `url('${image}')` }}>
        <span className={`absolute top-2 left-2 ${categoryColor} text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold`}>{category}</span>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-500 mb-2">
          <span><FontAwesomeIcon icon={faCalendarRegular} className="text-xs max-w-[1em] w-auto" /> {date}</span>
          <span><FontAwesomeIcon icon={faUserRegular} className="text-xs max-w-[1em] w-auto" /> {author}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
        <p className="mb-2 text-sm sm:text-base">{description}</p>
        <a href="#" className="text-blue-600 font-medium flex items-center gap-1 text-sm sm:text-base">Devamını Oku <FontAwesomeIcon icon={faArrowRight} className="text-xs max-w-[1em] w-auto" /></a>
      </div>
    </article>
  );
}
