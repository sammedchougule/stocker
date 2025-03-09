interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

interface OpenGraphType {
  title: string;
  description: string;
  url: string;
  siteName: string;
  images: OpenGraphImage[];
  locale: string;
  type: string;
}

export type MetadataConfigType = {
  [key: string]: {
    title: string;
    description: string;
    keywords: string[];
    openGraph?: OpenGraphType;
    icons?: {
      icon: { url: string; href: string }[];
      shortcut: { url: string; href: string }[];
      apple: { url: string; href: string }[];
    };
    robots?: string;
  };
};


export const metadataConfig = {
  default: {
    title: 'Stocker - Real-Time Stock Data and Portfolio Tracker',
    description: 'Track real-time stock data, build portfolios, and analyze financial reports with Stocker.',
    keywords: [
      'stocks',
      'real-time stock data',
      'stock portfolio',
      'financial analysis',
      'stock market',
    ],
    openGraph: {
      title: 'Stocker - Real-Time Stock Data and Portfolio Tracker',
      description: 'Track real-time stock data, build portfolios, and analyze financial reports with Stocker.',
      url: 'https://stocker.co.in',
      siteName: 'Stocker',
      images: [
        {
          url: '/stocker.png',
          width: 800,
          height: 600,
          alt: 'Stocker - Stock Data',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    icons: {
      icon: [{ url: "/stocker.png", href: "/stocker.png" }],
      shortcut: [{ url: "/stocker.png", href: "/stocker.png" }],
      apple: [{ url: "/stocker.png", href: "/stocker.png" }],
    },
    robots: "index,follow", 
  },
  stockDetail: {
    title: "{companyName} Share Price Today, Live NSE Stock Price: Get the latest {companyName} news, company updates, quotes, offers, annual financial reports, graph, volumes, 52 week high low, buy sell tips, balance sheet, historical charts, market performance, capitalisation, dividends, volume, profit and loss account, research, results and more details at Stocker.",
    description: "{companyName} Share Price Today, Live NSE Stock Price: Get the latest {companyName} news, company updates, quotes, financial reports, 52 week high low, tips, historical charts, market performance etc at Stocker.",
    keywords: [
      "{companyName} share price",
      "{companyName} stock price",
      "latest {companyName} updates",
      "{companyName} news",
      "{companyName} company details",
      "{companyName} quotes",
      "{companyName} offers",
      "{companyName} annual reports",
      "{companyName} financial reports",
      "{companyName} buy tips",
      "{companyName} sell tips",
      "{companyName} graph",
      "{companyName} volumes",
      "{companyName} forecast news",
      "{companyName} 52 week high",
      "{companyName} 52 week low",
      "{companyName} balance sheet",
      "{companyName} historical charts",
      "{companyName} market performance",
      "{companyName} capitalisation",
      "{companyName} dividends",
      "{companyName} volume",
      "{companyName} profit and loss account",
      "{companyName} research",
      "{companyName} results",
      "NSE India",
      "stocker.co.in",
    ],
    openGraph: {
      title: "{companyName} Share Price Today, Live NSE Stock Price, News – Stocker",
      description: "{companyName} Share Price Today, Live NSE Stock Price: Get the latest {companyName} news, company updates, quotes, financial reports, 52 week high low, tips, historical charts, market performance etc at Stocker.",
      url: "https://stocker.co.in/{companyName}",
      siteName: "Stocker",
      images: [
        {
          url: "https://www.nseindia.com/assets/images/nse-thumbnail.jpg?09082024",
          width: 1200,
          height: 630,
          alt: "{companyName} logo",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    icons: {
      icon: [{ url: "/stocker.png", href: "/stocker.png" }],
      shortcut: [{ url: "/stocker.png", href: "/stocker.png" }],
      apple: [{ url: "/stocker.png", href: "/stocker.png" }],
    },
    robots: "index,follow", 
  },
  intrabuzz: {
    title: 'Intrabuzz - Real-time Stock Movements & Volume Spikes',
    description: 'Track stock movements, volume spikes, price changes, and market trends in real-time. Stay informed with our powerful real-time stock analysis tool.',
    keywords: [
      'intrabuzz stocks',
      'real-time stock data',
      'price changes',
      'volume spikes',
      'stock market trends',
      'high & low stocks',
      'stock analysis',
      'market volatility',
      'stock trading insights',
    ],
    openGraph: {
      title: 'Intrabuzz - Real-time Stock Movements & Volume Spikes',
      description: 'Track stock movements, volume spikes, and market trends in real-time with Intrabuzz.',
      url: 'https://stocker.co.in/intrabuzz',
      siteName: 'Stocker',
      images: [
        {
          url: 'https://www.nseindia.com/assets/images/nse-thumbnail.jpg?09082024',
          width: 1084,
          height: 492,
          alt: 'Intrabuzz - Real-time Stock Movements',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: 'Intrabuzz - Real-time Stock Movements & Volume Spikes',
      description: 'Real-time stock analysis with price changes, volume spikes, and market insights.',
      image: '/images/intrabuzz-og-image.jpg',
    },
    icons: {
      icon: [{ url: "/stocker.png", href: "/stocker.png" }],
      shortcut: [{ url: "/stocker.png", href: "/stocker.png" }],
      apple: [{ url: "/stocker.png", href: "/stocker.png" }],
    },
    robots: "index,follow", 
  },
  sectors: {
    title: 'Sectors - Performance Overview',
    description: 'Analyze sector-wise stock performance with change percentage values and bar chart insights. Explore the latest trends in stock sectors for better investment decisions.',
    keywords: [
      'sector stocks',
      'sector performance',
      'stock sectors',
      'change percentage',
      'bar chart analysis',
      'market trends',
      'investment opportunities',
      'financial analysis',
      'stock market sectors',
    ],
    openGraph: {
      title: 'Sectors - Performance Overview',
      description: 'Explore sector-wise stock performance with detailed insights and change percentage values.',
      url: 'https://stocker.co.in/sectors',
      siteName: 'Stocker',
      images: [
        {
          url: 'https://www.nseindia.com/assets/images/nse-thumbnail.jpg?09082024',
          width: 1084,
          height: 492,
          alt: 'Sectors - Performance Overview',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: 'Sectors - Performance Overview',
      description: 'Explore sector performance and trends with detailed insights and market analysis.',
      image: '/images/sectors-og-image.jpg',
    },
    icons: {
      icon: [{ url: "/stocker.png", href: "/stocker.png" }],
      shortcut: [{ url: "/stocker.png", href: "/stocker.png" }],
      apple: [{ url: "/stocker.png", href: "/stocker.png" }],
    },
    robots: "index,follow", 
  },
  heatmap: {
    title: 'Heatmap - Visualize Market Trends',
    description: 'Analyze stock market trends with a heatmap. Filter stocks by change percentage, PE ratio, volume, and market cap to make better investment choices.',
    keywords: [
      'stock market heatmap',
      'Treemap chart',
      'change percentage',
      'PE ratio',
      '1-day volume',
      '1-month volume',
      'market cap',
      'sector stocks',
      'stock trends',
      'stock visualization',
      'market performance',
    ],
    openGraph: {
      title: 'Heatmap - Visualize Market Trends',
      description: 'Visualize market trends using our heatmap and explore stocks by key metrics.',
      url: 'https://stocker.co.in/heatmap',
      siteName: 'Stocker',
      images: [
        {
          url: 'https://www.nseindia.com/assets/images/nse-thumbnail.jpg?09082024',
          width: 1084,
          height: 492,
          alt: 'Heatmap - Visualize Market Trends',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: 'Heatmap - Visualize Market Trends',
      description: 'A powerful heatmap to analyze stock trends and make informed investment decisions.',
      image: '/images/heatmap-og-image.jpg',
    },
    icons: {
      icon: [{ url: "/stocker.png", href: "/stocker.png" }],
      shortcut: [{ url: "/stocker.png", href: "/stocker.png" }],
      apple: [{ url: "/stocker.png", href: "/stocker.png" }],
    },
    robots: "index,follow", 
  },
  screener: {
    title: 'Screener - Filter & Analyze Stocks',
    description: 'Use the Stock Screener to filter and analyze stocks based on key financial metrics, price movements, and market trends. Find the best stocks based on your criteria.',
    keywords: [
      'stock screener',
      'stock analysis',
      'financial metrics',
      'market trends',
      'filter stocks',
      'investment research',
      'technical analysis',
      'stock performance',
      'stock selection tool',
    ],
    openGraph: {
      title: 'Screener - Filter & Analyze Stocks',
      description: 'Filter and analyze stocks using the stock screener with powerful tools for research.',
      url: 'https://stocker.co.in/screener',
      siteName: 'Stocker',
      images: [
        {
          url: 'https://www.nseindia.com/assets/images/nse-thumbnail.jpg?09082024',
          width: 1084,
          height: 492,
          alt: 'Screener - Filter & Analyze Stocks',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: 'Screener - Filter & Analyze Stocks',
      description: 'Find the best stocks with powerful filtering and analysis tools for investors.',
      image: '/images/screener-og-image.jpg',
    },
    icons: {
      icon: [{ url: "/stocker.png", href: "/stocker.png" }],
      shortcut: [{ url: "/stocker.png", href: "/stocker.png" }],
      apple: [{ url: "/stocker.png", href: "/stocker.png" }],
    },
    robots: "index,follow", 
  },
  
};