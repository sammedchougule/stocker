// // app/news/[slug]/page.tsx
// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import CustomizedProgressBars from "@/components/CustomizedProgressBars";

// const GOOGLE_GEN_AI_API_KEY = "AIzaSyA3kwmH_xRh2ojFv5iyFFZDC8EMcOd_Lqs";

// export default function ArticlePage() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const slug = pathname.split("/").pop();
//   const [articleContent, setArticleContent] = useState<React.ReactNode | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [article, setArticle] = useState<{
//     title: string;
//     author: string;
//     publishedAt: string;
//     urlToImage: string; // Add urlToImage to the Article type
//     description: string;
//     url: string;
//   } | null>(null);

//   useEffect(() => {
//     const generateArticle = async () => {
//       try {
//         setLoading(true);
//         const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const prompt = `Write a detailed news article based on the following title: "${decodeURIComponent(slug || "")}". The article should be between 400-500 words. Provide the output in professional news article format.`;
//         const result = await model.generateContent(prompt);
//         const articleText = result.response.text();

//         const formattedArticle = articleText.split('\n').map((paragraph, index) => {
//           if (paragraph.trim() === '') return null;
//           return <p key={index} className="mb-4">{paragraph}</p>;
//         });

//         setArticleContent(formattedArticle);

//         // Fetch image URL from News API (You will need to implement this part)
//         const imageUrl = await fetchImageUrlFromNewsApi(decodeURIComponent(slug || ""));

//         setArticle({
//           title: decodeURIComponent(slug || ""),
//           author: "Generated Content",
//           publishedAt: new Date().toISOString(),
//           urlToImage: imageUrl || "/placeholder.svg", // Use fetched image URL or fallback
//           description: "Generated article description.",
//           url: `/news/${slug}`,
//         });
//       } catch (error) {
//         console.error("Error generating article:", error);
//         setArticleContent(<p>Error generating article content.</p>);
//         setArticle(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       generateArticle();
//     } else {
//       router.push("/news");
//     }
//   }, [slug, router]);

//   async function fetchImageUrlFromNewsApi(title: string): Promise<string | null> {
//     // Implement logic to fetch image URL from News API using the article title
//     // Example (replace with your actual API call):
//     try {
//       const response = await fetch(`/api/fetch-image?title=${encodeURIComponent(title)}`); // You'll need to create this API route
//       const data = await response.json();
//       return data.imageUrl; // Assuming the API returns { imageUrl: "..." }
//     } catch (error) {
//       console.error("Error fetching image URL:", error);
//       return null;
//     }
//   }

//   function formatDate(dateString: string): string {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const monthNames = [
//       "January", "February", "March", "April", "May", "June",
//       "July", "August", "September", "October", "November", "December"
//     ];
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();

//     return `${day}-${month.substring(0, 3)}-${year}`;
//   }

//   if (loading) {
//     return <div><CustomizedProgressBars /></div>;
//   }

//   if (!article) {
//     return <div>Article not found.</div>;
//   }

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
//       <div className="mb-4 text-sm text-gray-600">
//         <p>
//           By {article.author || "Unknown"} | {formatDate(article.publishedAt)}
//         </p>
//       </div>
//       <div className="mb-6">
//         {article.urlToImage && (
//           <Image
//             src={article.urlToImage}
//             alt={article.title}
//             width={800}
//             height={400}
//             className="w-full h-auto object-cover rounded-lg"
//           />
//         )}
//       </div>
//       <p className="text-xl mb-4 font-semibold">{article.description}</p>
//       <div className="prose lg:prose-xl max-w-none">
//         {articleContent}
//       </div>
//       <div className="mt-8">
//         <Link href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//           Read full article
//         </Link>
//       </div>
//     </main>
//   );
// }





// app/news/[slug]/page.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CustomizedProgressBars from "@/components/CustomizedProgressBars";
import { getArticleByUrl } from "@/lib/newsapi";

export default function ArticlePage() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname.split("/").pop();
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleData = await getArticleByUrl(decodeURIComponent(slug || ""));
        console.log("Article Data:", articleData); // Add this line
        setArticle(articleData);
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    } else {
      router.push("/news");
    }
  }, [slug, router]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month.substring(0, 3)}-${year}`;
  }

  if (loading) {
    return <CustomizedProgressBars />;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article?.title}</h1>
      <div className="mb-4 text-sm text-gray-600">
        <p>
          By {article?.author || "Unknown"} | {formatDate(article?.publishedAt || new Date().toISOString())}
        </p>
      </div>
      <div className="mb-6">
        {article?.urlToImage && (
          <Image
            src={article.urlToImage}
            alt={article.title || "Article Image"}
            width={800} // Ensure these are valid
            height={400} // Ensure these are valid
            className="w-full h-auto object-cover rounded-lg"
          />
        )}
      </div>
      <p className="text-xl mb-4 font-semibold">{article?.description}</p>
      <div className="prose lg:prose-xl max-w-none">
        <p>{article?.content}</p>
      </div>
      <div className="mt-8">
        <Link href={article?.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Read full article
        </Link>
      </div>
    </main>
  );
}