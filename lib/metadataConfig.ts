export type MetadataConfigType = {
  [key: string]: {
    title: string;
    description: string;
    keywords: string[];
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
  },
  stockDetail: {
    title: "{companyName} Share Price Today, Live NSE Stock Price: Get the latest {companyName} news, company updates, quotes, offers, annual financial reports, graph, volumes, 52 week high low, buy sell tips, balance sheet, historical charts, market performance, capitalisation, dividends, volume, profit and loss account, research, results and more details at NSE India.",
    description: "{companyName} Share Price Today, Live NSE Stock Price: Get the latest {companyName} news, company updates, quotes, financial reports, 52 week high low, tips, historical charts, market performance etc at NSE India.",
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
      "nseindia.com",
    ],
    openGraph: {
      title: "{companyName} Share Price Today, Live NSE Stock Price,News – NSE India",
      description: "{companyName} Share Price Today, Live NSE Stock Price: Get the latest {companyName} news, company updates, quotes, financial reports, 52 week high low, tips, historical charts, market performance etc at NSE India.",
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
    icons: [
      {
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
  },
  intrabuzz: {
    title: 'Intrabuzz - Real-time Stock Movements & Volume Spikes',
    description: 'Track stock movements, volume spikes, price changes, and market trends in real-time.',
    keywords: [
      'intrabuzz stocks',
      'real-time stock data',
      'price changes',
      'volume spikes',
      'market trends',
      'high & low stocks',
      'stock analysis',
    ],
  },
  sectors: {
    title: 'Sectors - Performance Overview',
    description: 'Analyze sector-wise stock performance with change percentage values and bar chart insights.',
    keywords: [
      'sector stocks',
      'sector performance',
      'stock sectors',
      'change percentage',
      'bar chart analysis',
      'market trends',
    ],
  },
  heatmap: {
    title: 'Heatmap - Visualize Market Trends',
    description: 'Analyze stock market trends with a heatmap. Filter stocks by change percentage, PE ratio, volume, and market cap.',
    keywords: [
      'stock market heatmap',
      'Treemap chart',
      'change percentage',
      'PE ratio',
      '1-day volume',
      '1-month volume',
      'market cap',
      'sector stocks',
    ],
  },
  news: {
    title: 'News - Latest Updates & Trends',
    description: 'Stay updated with the latest stock market news, trends, and financial insights.',
    keywords: [
      'stock market news',
      'financial updates',
      'investment trends',
      'market insights',
      'trading news',
    ],
  },
  screener: {
    title: 'Screener - Filter & Analyze Stocks',
    description: 'Use the Stock Screener to filter and analyze stocks based on key financial metrics, price movements, and market trends.',
    keywords: [
      'stock screener',
      'stock analysis',
      'financial metrics',
      'market trends',
      'filter stocks',
      'investment research',
      'technical analysis',
    ],
  },
};