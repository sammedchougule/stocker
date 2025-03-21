// app/news/page.tsx
"use client";

import News from "@/components/News";
import { useSearchParams } from "next/navigation";

export default function NewsPage() {

  return (
    <div className="container mx-auto ">
      
      <News />
    </div>
  );
}