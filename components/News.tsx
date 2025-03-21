// components/News.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import CustomizedProgressBars from "./CustomizedProgressBars";

interface Article {
  id: string;
  title: string;
  link: string;
}

interface NewsResponse {
  items: Article[]; // Corrected to 'items'
}

const NewsContent = () => {
  const [news, setNews] = useState<Article[]>([]); // Initialize as an array
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const apiUrl =
          "https://news-headlines.tradingview.com/v2/headlines?category=stock&client=overview&lang=en&market_country=IN&streaming=true&user_country=IN";

        console.log("Fetching top headlines from:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API response not OK: ${response.status} ${response.statusText}`);
        }
        const data: NewsResponse = await response.json();

        console.log("API response:", data);

        setNews(data.items); // Corrected to data.items
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <CustomizedProgressBars />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {news.map((article) => (
          <div key={article.id} className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2 line-clamp-2 overflow-hidden">
              {article.title}
            </h2>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-500 hover:bg-gray-700 rounded-full text-white font-semibold py-2 px-4 border border-gray-800"
            >
              View Full Article
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const News = () => {
  return (
    <Suspense fallback={<CustomizedProgressBars />}>
      <NewsContent />
    </Suspense>
  );
};

export default News;


