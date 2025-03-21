// app/news/page.tsx
"use client";

import News from "@/components/News";
import CategorySelector from "@/components/CategorySelector";
import { useSearchParams } from "next/navigation";

export default function NewsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "general";

  return (
    <div className="container mx-auto ">
      <CategorySelector selectedCategory={category} />
      <News />
    </div>
  );
}