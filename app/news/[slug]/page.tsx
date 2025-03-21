// app/news/[slug]/page.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import CustomizedProgressBars from "@/components/CustomizedProgressBars";
import { generateArticle } from "@/lib/ai";

export default function ArticlePage() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname.split("/").pop();
  const [articleContent, setArticleContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const generatedContent = await generateArticle(decodeURIComponent(slug || ""));
        setArticleContent(generatedContent);
      } catch (error) {
        console.error("Error generating article:", error);
        setArticleContent(null);
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

  if (loading) {
    return <div><CustomizedProgressBars /></div>;
  }

  if (!articleContent) {
    return <div>Article not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="prose lg:prose-xl max-w-none">
        <div dangerouslySetInnerHTML={{ __html: articleContent }} />
      </div>
    </main>
  );
}