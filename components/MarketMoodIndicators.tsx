"use client"

import { TrendingUp, BarChart3, Activity, PieChart } from "lucide-react"

export default function MarketMoodIndicators() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">How is the MMI built?</h2>
      <p className="text-gray-300 mb-8 text-center max-w-3xl mx-auto">
        The Market Mood Index is calculated using several key market indicators that help gauge investor sentiment. Each
        indicator provides unique insights into market behavior and collectively they form a comprehensive view of
        market sentiment.
      </p>

      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FII Activity Card */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
            <div className="bg-gradient-to-tr from-blue-900/30 via-blue-800/10 to-indigo-900/10 p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">FII Activity</h3>
              </div>
              <p className="text-sm text-gray-300/90">
                Foreign Institutional Investors' buying and selling patterns significantly impact market sentiment. Net
                inflows often indicate bullish sentiment.
              </p>
            </div>
          </div>

          {/* Volatility Index Card */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
            <div className="bg-gradient-to-tr from-green-900/30 via-emerald-800/10 to-teal-900/10 p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
              <Activity className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">Volatility Index</h3>
              </div>
              <p className="text-sm text-gray-300/90">
                The VIX or fear gauge measures market volatility. Higher values indicate fear, while lower values suggest
                complacency or confidence.
              </p>
            </div>
          </div>

          {/* Put/Call Ratio Card */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
            <div className="bg-gradient-to-tr from-purple-900/30 via-violet-800/10 to-fuchsia-900/10 p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <BarChart3 className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">Put/Call Ratio</h3>
              </div>
              <p className="text-sm text-gray-300/90">
                This ratio compares put options to call options. A high ratio indicates bearish sentiment, while a low
                ratio suggests bullish sentiment.
              </p>
            </div>
          </div>

          {/* Market Breadth Card */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
              <div className="bg-gradient-to-tr from-orange-900/30 via-amber-800/10 to-yellow-900/10 p-6">
                <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                <PieChart className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold">Market Breadth</h3>
                </div>
                <p className="text-sm text-gray-300/90">
                  Market Breadth evaluates the overall movement of major indices, helping to gauge the underlying strength or weakness in the index performance.
                </p>
              </div>
            </div>

            {/* Advance/Decline Ratio Card */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
              <div className="bg-gradient-to-tr from-cyan-900/30 via-sky-800/10 to-blue-900/10 p-6">
                <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold">Advance/Decline Ratio</h3>
                </div>
                <p className="text-sm text-gray-300/90">
                Compares the number of advancing Vs declining stocks. A higher ratio signals positive momentum, while a lower ratio indicates negative weakness.
                </p>
              </div>
            </div>

          {/* Sector Rotation Card */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-border/50">
            <div className="bg-gradient-to-tr from-pink-900/30 via-rose-800/10 to-red-900/10 p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
              <PieChart className="h-5 w-5 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold">Sector Rotation</h3>
              </div>
              <p className="text-sm text-gray-300/90">
                Tracks capital flow between different sectors. Rotation into defensive sectors may indicate caution, while cyclical sector strength suggests optimism.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
