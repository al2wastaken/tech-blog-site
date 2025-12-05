import BlogCard from "./BlogCard";

const posts = [
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Yazılım",
    categoryColor: "bg-blue-600",
    date: "15 Aralık 2025",
    author: "Ahmet Yılmaz",
    title: "React.js ile Modern Web Uygulamaları",
    description: "Component tabanlı mimari ile web geliştirme süreçlerinizi nasıl hızlandırabileceğinizi öğrenin...",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Siber Güvenlik",
    categoryColor: "bg-green-600",
    date: "1 Aralık 2025",
    author: "Mert Akın",
    title: "Şifreleriniz Gerçekten Güvende mi?",
    description: "İki faktörlü doğrulama (2FA) ve modern şifreleme yöntemlerinin önemi üzerine derinlemesine bir analiz.",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Donanım",
    categoryColor: "bg-yellow-600",
    date: "08 Ekim 2024",
    author: "Caner Erkin",
    title: "Geleceğin İş İstasyonları",
    description: "Ofis masalarımız değişiyor. Ergonomi ve performansın buluştuğu yeni nesil donanımlar.",
  },
];

export default function BlogFeed() {
  return (
    <main className="flex-1 w-full">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">Güncel Yazılar</h2>
        <div className="h-1 w-12 sm:w-16 bg-blue-600 rounded" />
      </div>
      <div className="flex flex-col gap-4 sm:gap-6">
        {posts.map((post, i) => (
          <BlogCard key={i} {...post} />
        ))}
      </div>
    </main>
  );
}
