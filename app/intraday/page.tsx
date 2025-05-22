import type { Metadata } from "next"
import IntrabuzzTabs from "@/components/IntrabuzzTabs"
import { fetchStocks } from "@/lib/utils/fetchStocks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  metadataBase: new URL("https://stocker.co.in"),
  title: "Intraday Stock Market Dashboard | Live NSE/BSE Updates | Stocker",
  description:
    "Stay ahead in trading with Stocker's Intraday dashboard. Get real-time NSE/BSE stock prices, volume analysis, sector performance, and live market insights.",
  keywords:
    "intraday trading, live stock updates, NSE stock market, BSE stock market, stock market dashboard, real-time stock prices, Indian stock market, sector performance, stock volume tracker, stock chart, market heatmap, live intraday data, technical analysis, stock screener",
  authors: [{ name: "Stocker", url: "https://stocker.co.in" }],
  category: "Finance",
  applicationName: "Stocker",
  themeColor: "#0ea5e9",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Intraday Stock Market Dashboard | Live NSE/BSE Updates | Stocker",
    description:
      "Stay ahead in trading with Stocker's Intraday dashboard. Get real-time NSE/BSE stock prices, volume analysis, sector performance, and live market insights.",
    url: "https://stocker.co.in/intraday",
    siteName: "Stocker",
    images: [
      {
        url: "/og-intraday.png",
        width: 1200,
        height: 630,
        alt: "Live Intraday Stock Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Intraday Stock Market Dashboard | Live NSE/BSE Updates | Stocker",
    description:
      "Access real-time stock updates, intraday charts, and sector analysis with Stocker's advanced trading dashboard.",
    images: ["/og-intraday.png"],
    creator: "@stocker",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://stocker.co.in/intraday",
  },
};


export default async function IntradayPage() {
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

  return (
    <div className="container mx-auto px-4">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <IntrabuzzTabs initialStocks={stockData} />
    </div>
  )
}
