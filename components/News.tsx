// components/News.tsx
"use client";

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSearchParams, useRouter } from "next/navigation";
import { getTopHeadlines } from "@/lib/newsapi";
import CustomizedProgressBars from "./CustomizedProgressBars";
import NewsPagination from "./NewsPagination";

const GOOGLE_GEN_AI_API_KEY = "AIzaSyA3kwmH_xRh2ojFv5iyFFZDC8EMcOd_Lqs";

interface Article {
  urlToImage: string;
  title: string;
  description: string;
  publishedAt: string;
  source: { name: string };
  content: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState<boolean[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "general";
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getTopHeadlines(category, page);
        setNews(data.articles);
        setTotalResults(data.totalResults);
        setGenLoading(Array(data.articles.length).fill(false)); // Initialize genLoading
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, page]);

  const handleViewArticle = async (title: string, index: number) => {
    setGenLoading((prev) => {
      const newLoading = [...prev];
      newLoading[index] = true;
      return newLoading;
    });

    try {
      if (!generatedContent[index]) {
        // Generate article content if it's not already generated
        const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Write a detailed news article based on the following title: "${title}". The article should be between 400-500 words. Provide the output in professional news article format.`;
        const result = await model.generateContent(prompt);
        const article = result.response.text();

        setGeneratedContent((prev) => {
          const newContent = [...prev];
          newContent[index] = article;
          return newContent;
        });
      }

      // Navigate to the detail page
      const slug = encodeURIComponent(title);
      router.push(`/news/${slug}`);
    } catch (error) {
      console.error("Error generating article:", error);
      setGenLoading((prev) => {
        const newLoading = [...prev];
        newLoading[index] = false;
        return newLoading;
      });
    }
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month.substring(0, 3)}-${year}`;
  }

  if (loading) {
    return (
      <div>
        <CustomizedProgressBars />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {news.map((article, index) => (
          <div key={index} className="border p-4 rounded-md">
            {article.urlToImage ? (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            ) : (
              <img
                src="/no_image.jpeg" // Fallback image
                alt="No Image Available"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2 line-clamp-2 overflow-hidden">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-2">
              Published At: {formatDate(article.publishedAt)}
            </p>
            {genLoading[index] ? (
              <p>Generating article...</p>
            ) : (
              <button
                onClick={() => handleViewArticle(article.title, index)}
                className="bg-gray-500 hover:bg-gray-700 rounded-full text-white font-semibold py-2 px-4 border border-gray-800"
              >
                View Full Article
              </button>
            )}
          </div>
        ))}
      </div>
      <NewsPagination
        currentPage={page}
        totalPages={Math.ceil(totalResults / 8)}
      />
    </div>
  );
};

export default News;