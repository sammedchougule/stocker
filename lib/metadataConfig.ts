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
  sector: {
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
