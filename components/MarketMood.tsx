// components/MarketMood.tsx

"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Gauge from "@/components/Gauge"
import type { Stock } from "@/types/Stock"

interface MarketMoodProps {
  stocks: Stock[]
}

export default function MarketMood({ stocks }: MarketMoodProps) {


  return (
    <Card className="h-full bg-white dark:bg-[#151719] dark:dark-noise overflow-hidden">
      <CardContent className="pt-6 px-2 sm:px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold dark:text-white">Market Mood Index</h3>
          <p className="text-md text-gray-500 dark:text-gray-400">Know what&apos;s the sentiment on the street today</p>

          {/* Use the Gauge component */}
          <div className="flex justify-between text-sm font-medium my-6 px-4">
            <span className="text-green-600 dark:text-green-400">Extreme Fear</span>
            <span className="text-yellow-500 dark:text-yellow-400">Fear</span>
            <span className="text-orange-500 dark:text-orange-400">Greed</span>
            <span className="text-red-600 dark:text-red-400">Extreme Greed</span>
          </div>
          <Gauge stocks={stocks} />

          <div className="text-blue-600 dark:text-blue-400 mt-4">
            <Link href="/market-mood-index">See More</Link>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
