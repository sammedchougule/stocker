// app/news/page.tsx
"use client";

import News from "@/components/News";
import { useSearchParams } from "next/navigation";

export default function NewsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "general";

  return (
    <div className="container mx-auto ">
      
      <News />
    </div>
  );
}