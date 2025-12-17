

import Hero from "../../components/Hero";
import BlogFeed from "../../components/BlogFeed";
import Sidebar from "../../components/Sidebar";

export default function Home() {
  return (
    <div className="bg-zinc-900 min-h-screen">
      <Hero />
      <div className="container mx-auto flex flex-col md:flex-row gap-8 py-12 px-4 sm:px-6 xl:px-16 2xl:px-32">
        <BlogFeed />
        <Sidebar />
      </div>
    </div>
  );
}
