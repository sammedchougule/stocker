"use client"

import Link from "next/link"
import Gauge from "./Gauge"
import type { Stock } from "@/lib/utils/fetchStocks"

interface MarketMoodProps {
  stocks: Stock[]
}

export default function MarketMood({ stocks }: MarketMoodProps) {
  // Calculate market mood based on percentage of stocks with positive change
  const calculateMoodValue = () => {
    // Filter only EQ type stocks
    const equityStocks = stocks.filter((stock) => stock.type === "EQ")

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

  return (
    <div className="bg-card rounded-lg border p-6 shadow-md h-full">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">Market Mood Index</h2>
      </div>

      <p className="text-muted-foreground text-center">Know the sentiment on the street today</p>

      {/* Market Mood Gauge */}
      <div className="flex justify-center items-center">
        <Gauge value={moodValue} />
      </div>

      <div className="mt-4 text-center">
        <Link href="/market-mood-index" className="text-blue-500 hover:underline text-md">
            See More
        </Link>
      </div>
    </div>
  )
}
