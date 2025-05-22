import Link from "next/link"
import { LineChart, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Indices from "@/components/Indices"
import TodayStocks from "@/components/TodayStocks"
import MarketMood from "@/components/MarketMood"
import { fetchStocks } from "@/lib/utils/fetchStocks"

export default async function Home() {
  // Fetch stock data for indices
  let stockData: Awaited<ReturnType<typeof fetchStocks>> = []
  try {
    stockData = await fetchStocks()
  } catch (error) {
    console.error("Error fetching stocks for indices:", error)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Indices stocks={stockData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <TodayStocks stocks={stockData} />
        </div>
        <div>
          <MarketMood stocks={stockData} />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
        {/* Real-time Updates Card with Gradient */}
        <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
          <div className="bg-gradient-to-tr from-blue-900/30 via-blue-800/20 to-indigo-900/10 p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <LineChart className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Updates</h3>
            </div>
            <p className="text-sm text-gray-300/90 mb-6">
              Get the latest stock market data with automatic refreshes every 5 minutes, ensuring you always have access
              to current market information.
            </p>
            <Link href="/intrabuzz">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                Explore Intrabuzz
              </Button>
            </Link>
          </div>
        </div>

        {/* Market Insights Card with Gradient */}
        <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
          <div className="bg-gradient-to-tr from-green-900/30 via-emerald-800/20 to-teal-900/10 p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Market Insights</h3>
            </div>
            <p className="text-sm text-gray-300/90 mb-6">
              View detailed information about each stock, including price changes, volume, and key performance
              indicators to make informed decisions.
            </p>
            <Link href="/intrabuzz">
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0">
                View Stocks
              </Button>
            </Link>
          </div>
        </div>

        {/* Flexible Views Card with Gradient */}
        <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
          <div className="bg-gradient-to-tr from-purple-900/30 via-violet-800/20 to-fuchsia-900/10 p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Flexible Views</h3>
            </div>
            <p className="text-sm text-gray-300/90 mb-6">
              Switch between card and table views to analyze stock information in the format that works best for your
              trading strategy and preferences.
            </p>
            <Link href="/intrabuzz">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0">
                Try Different Views
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to dive into the market?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Access the Intrabuzz dashboard to view real-time stock data from the Indian market, with detailed information
          on over 220 stocks.
        </p>
        <Link href="/intrabuzz">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
          >
            Launch Intrabuzz Dashboard
          </Button>
        </Link>
      </section>
    </main>
  )
}
