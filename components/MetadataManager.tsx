


'use client';

import { usePathname } from 'next/navigation'; // Use Next.js navigation hook to get the path
import { metadataConfig, MetadataConfigType } from '@/lib/metadataConfig';  // Import the metadataConfig
//import { url } from 'inspector';

const MetadataManager = () => {
  const pathname = usePathname(); // Get the current page path

  // Check if the current page is a stock detail page
  if (pathname.includes('/stockdetail/')) {
    const symbol = pathname.split('/')[2]; // Assuming the symbol is part of the URL
    const companyName = symbol ? symbol.toUpperCase() : 'Default Company';
    const stockDetailMetadata = metadataConfig.stockDetail; // Get stock detail metadata

    // Replace placeholders like {companyName} in metadata fields
    const dynamicTitle = stockDetailMetadata.title.replace(/{companyName}/g, companyName);
    const dynamicDescription = stockDetailMetadata.description.replace(/{companyName}/g, companyName);

    // For keywords, ensure we only replace {companyName} and leave the rest intact
    const dynamicKeywords = stockDetailMetadata.keywords.map(keyword =>
      keyword.replace(/{companyName}/g, companyName)
    ).join(', ');

    const dynamicOpenGraphTitle = stockDetailMetadata.openGraph.title.replace(/{companyName}/g, companyName);
    const dynamicOpenGraphDescription = stockDetailMetadata.openGraph.description.replace(/{companyName}/g, companyName); 
    const dynamicOpenGraphImage = stockDetailMetadata.openGraph.images[0].url; 

    return (
      <>
        <head>
          <title>{dynamicTitle}</title>
          <meta name="description" content={dynamicDescription} />
          <meta name="keywords" content={dynamicKeywords} />
          <meta property="og:title" content={dynamicOpenGraphTitle} />
          <meta property="og:description" content={dynamicOpenGraphDescription} />
          <meta property="og:image" content={dynamicOpenGraphImage || '/stocker.png'} />
          <meta property="og:url" content={`https://stocker.co.in/stockdetail/${companyName}`} />
          <meta property="og:site_name" content={stockDetailMetadata.openGraph?.siteName || 'Stocker'} />
          <meta property="og:locale" content={stockDetailMetadata.openGraph?.locale || 'en_US'} />
          <meta property="og:type" content={stockDetailMetadata.openGraph?.type || 'website'} />
          <meta property="og:image:width" content={(stockDetailMetadata.openGraph?.images?.[0]?.width || '1084').toString()} />
          <meta property="og:image:height" content={(stockDetailMetadata.openGraph?.images?.[0]?.height || '492').toString()} />
          <meta name="robots" content={stockDetailMetadata.robots || 'index,follow'} />
        </head>
      </>
    );
  }

  // For other pages, check the pathname to dynamically set the metadata for each page
  const pageKey = pathname.split('/')[1] as keyof typeof metadataConfig || 'default'; // Get page key (e.g., 'intrabuzz', 'sector', etc.)
  
  // Get the specific metadata for the page or fallback to the default metadata
  const metadata = (metadataConfig[pageKey] || metadataConfig.default) as MetadataConfigType[keyof MetadataConfigType];

  return (
    <>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta property="og:title" content={metadata.openGraph?.title || 'Default Title'} />
        <meta property="og:description" content={metadata.openGraph?.description || 'Default Description'} />
        <meta property="og:image" content={Array.isArray(metadata.openGraph?.images) ? metadata.openGraph.images[0].url : metadata.openGraph?.images || '/stocker.png'} />
        <meta property="og:url" content={metadata.openGraph?.url || window.location.href} />
        <meta property="og:site_name" content={metadata.openGraph?.siteName || 'Stocker'} />
        <meta property="og:locale" content={metadata.openGraph?.locale || 'en_US'} />
        <meta property="og:type" content={metadata.openGraph?.type || 'website'} />
        <meta property="og:image:width" content={(metadata.openGraph?.images?.[0]?.width || '1084').toString()} />
        <meta property="og:image:height" content={(metadata.openGraph?.images?.[0]?.height || '492').toString()} />
        <meta name="robots" content={metadata.robots || 'index,follow'} />
      </head>
    </>
  );
};

export default MetadataManager;

