import { supabase } from "@/lib/supabase";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  sub_category: string;
  date: string;
  image_path: string;
}

async function getNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }
  return data || [];
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <Link href={`/news/${article.id}`} key={article.id} className="block h-full">
            <NewsCard
              title={article.title}
              category={article.category}
              subCategory={article.sub_category}
              imagePath={article.image_path}
              excerpt={article.excerpt}
              date={article.date}
            />
          </Link>
        ))}
      </div>
      {/* Pagination placeholder */}
      <div className="mt-8 flex justify-between items-center">
        <span>Page 1 of 1</span>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" disabled>
          Older Posts →
        </button>
      </div>
    </div>
  );
}
