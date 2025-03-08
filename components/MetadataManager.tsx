// // components/MetadataManager.tsx
// "use client";
// import { useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { metadataConfig, MetadataConfigType } from "@/lib/metadataConfig";

// const MetadataManager = () => {
//   const pathname = usePathname(); // Get the current page path
//   const pageKey = pathname.split("/")[1] as keyof typeof metadataConfig || "default"; // Extract page key (e.g., 'intrabuzz', 'screener', etc.)

//   // Get metadata based on the current page, fallback to default metadata
//   const metadata: MetadataConfigType[keyof typeof metadataConfig] = metadataConfig[pageKey] || metadataConfig.default;

  

//   useEffect(() => {
//     // Update metadata dynamically (title, description, etc.)
//     document.title = metadata.title;
//     document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
//     document.querySelector('meta[name="keywords"]')?.setAttribute("content", metadata.keywords.join(", "));
//     document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
//     document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
//     document.querySelector('meta[property="og:image"]')?.setAttribute("content", "/stocker.png");
//   }, [metadata]);

//   return null; // No need to render anything here, just update the head
// };

// export default MetadataManager;







// MetadataManager.tsx
'use client';

import { usePathname } from 'next/navigation'; // Use Next.js navigation hook to get the path
import { metadataConfig } from '@/lib/metadataConfig';  // Import the metadataConfig

const MetadataManager = () => {
  const pathname = usePathname(); // Get the current path using usePathname
  const symbol = pathname?.split('/').pop(); // Extract the stock symbol from the URL

  // If the current page is a stock detail page
  if (pathname.includes('/stockdetail/')) {
    const companyName = symbol ? symbol.toUpperCase() : 'Default Company';
    const metadata = metadataConfig.stockDetail; // Get stock detail metadata

    // Replace placeholders like {companyName} in metadata fields
    const dynamicTitle = metadata.title.replace(/{companyName}/g, companyName);
    const dynamicDescription = metadata.description.replace(/{companyName}/g, companyName);

    // For keywords, ensure we only replace {companyName} and leave the rest intact
    const dynamicKeywords = metadata.keywords.map(keyword =>
      keyword.replace(/{companyName}/g, companyName)
    ).join(', ');

    const dynamicOpenGraphTitle = metadata.openGraph.title.replace(/{companyName}/g, companyName);
    const dynamicOpenGraphDescription = metadata.openGraph.description.replace(/{companyName}/g, companyName);

    return (
      <>
        <head>
          <title>{dynamicTitle}</title>
          <meta name="description" content={dynamicDescription} />
          <meta name="keywords" content={dynamicKeywords} />
          <meta property="og:title" content={dynamicOpenGraphTitle} />
          <meta property="og:description" content={dynamicOpenGraphDescription} />
          {/* <meta property="og:image" content={metadata.openGraph.image} /> */}
        </head>
      </>
    );
  }

  // For other pages (e.g., intrabuzz, sector, etc.), use the static metadata
  //const pageName = pathname.split('/').pop();  
  const metadata = metadataConfig.default; // Default metadata for other pages

  return (
    <>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
      </head>
    </>
  );
};

export default MetadataManager;
