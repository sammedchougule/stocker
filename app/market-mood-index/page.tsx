import type { Metadata } from "next"
import { fetchStocks } from "@/lib/utils/fetchStocks"
import MarketMoodHero from "@/components/MarketMoodHero"
import MarketMoodExplanation from "@/components/MarketMoodExplanation"
import MarketMoodIndicators from "@/components/MarketMoodIndicators"
import MarketMoodFAQ from "@/components/MarketMoodFAQ"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  metadataBase: new URL("https://stocker.co.in"),
  title: "Market Mood Index | Track Market Sentiment Live | Stocker",
  description:
    "Analyze investor sentiment with Stocker's Market Mood Index. Live fear and greed data, market psychology, and sentiment indicators to help you invest smarter.",
  keywords:
    "market mood index, stock market sentiment, fear and greed index, investor psychology, live market sentiment, trading psychology, sentiment indicators, stocker market tools, market fear gauge, investor behavior analysis",
  authors: [{ name: "Stocker", url: "https://stocker.co.in" }],
  category: "Finance",
  applicationName: "Stocker",
  themeColor: "#0ea5e9",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Market Mood Index | Track Market Sentiment Live | Stocker",
    description:
      "Monitor live investor emotions with Stocker's Market Mood Index. Get a clear view of fear and greed levels to make better trading and investment decisions.",
    url: "https://stocker.co.in/market-mood-index",
    siteName: "Stocker",
    images: [
      {
        url: "/og-market-mood.png",
        width: 1200,
        height: 630,
        alt: "Live Market Mood Index - Stocker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Market Mood Index | Fear & Greed Sentiment | Stocker",
    description:
      "Explore real-time investor sentiment with Stocker's Market Mood Index. Decode fear & greed to navigate the market confidently.",
    images: ["/og-market-mood.png"],
    creator: "@stocker",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://stocker.co.in/market-mood-index",
  },
};


export default async function MarketMoodIndexPage() {
  // Fetch stock data server-side for initial load
  let stockData: any[] = []
  let error = null

  try {
    stockData = await fetchStocks()
  } catch (e) {
    console.error("Error in page component:", e)
    error = e instanceof Error ? e.message : "Failed to fetch stock data"
    // Provide empty array to allow client-side to attempt refresh
    stockData = []
  }

  // Calculate market mood based on percentage of stocks with positive change
  const calculateMoodValue = () => {
    // Filter only EQ type stocks
    const equityStocks = stockData.filter((stock) => stock.type === "EQ")

    if (equityStocks.length === 0) return 50 // Default to neutral if no stocks

    // Count stocks with positive change percentage
    const positiveStocks = equityStocks.filter((stock) => {
      const changePct = Number(stock.changepct)
      return !isNaN(changePct) && changePct > 0
    })

    // Calculate percentage of positive stocks
    const moodValue = (positiveStocks.length / equityStocks.length) * 100

    return moodValue
  }

  const moodValue = calculateMoodValue()

  // Find Nifty 50 index data
  const nifty50 = stockData.find((stock) => stock.symbol === "NIFTY_50") || {
    price: "22600.00",
    change: "100.00",
    changepct: "0.44",
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <MarketMoodHero moodValue={moodValue} stockCount={stockData.filter((stock) => stock.type === "EQ").length} />

      <MarketMoodExplanation moodValue={moodValue} nifty50={nifty50} />

      <MarketMoodIndicators />

      <MarketMoodFAQ />

      <div className="mt-16 max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-2 text-red-100 p-2 rounded-t-lg bg-gradient-to-r from-red-700/50 to-red-900/25 inline-block px-4">
          Disclaimer:
        </h3>
        <p className="text-sm p-6 border border-red-800/50 rounded-b-lg rounded-tr-lg">
          <span className="block mb-2">
            The Market Mood Index (MMI) is provided solely for informational and educational purposes. It is designed to
          reflect general market sentiment based on predefined parameters, but it should not be interpreted as financial
          advice or a recommendation to invest.
          </span>

          <span>
            The accuracy or completeness of the data is not guaranteed, and any
          trading or investment decisions made using the MMI are done at your own risk.
          </span>
        </p>

      </div>
    </div>
  )
}
