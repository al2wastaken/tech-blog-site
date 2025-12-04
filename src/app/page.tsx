

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BlogFeed from "../components/BlogFeed";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto flex flex-col md:flex-row gap-8 py-12">
        <BlogFeed />
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
