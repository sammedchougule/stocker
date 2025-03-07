// components/MetadataManager.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { metadataConfig, MetadataConfigType } from "@/lib/metadataConfig";

const MetadataManager = () => {
  const pathname = usePathname(); // Get the current page path
  const pageKey = pathname.split("/")[1] as keyof typeof metadataConfig || "default"; // Extract page key (e.g., 'intrabuzz', 'screener', etc.)

  // Get metadata based on the current page, fallback to default metadata
  const metadata: MetadataConfigType[keyof typeof metadataConfig] = metadataConfig[pageKey] || metadataConfig.default;

  useEffect(() => {
    // Update metadata dynamically (title, description, etc.)
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[name="keywords"]')?.setAttribute("content", metadata.keywords.join(", "));
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", "/stocker.png");
  }, [metadata]);

  return null; // No need to render anything here, just update the head
};

export default MetadataManager;
