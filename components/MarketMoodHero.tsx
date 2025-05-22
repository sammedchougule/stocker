"use client"

import { useState, useEffect } from "react"
import Gauge from "./Gauge"

interface MarketMoodHeroProps {
  moodValue: number
  stockCount: number
}

export default function MarketMoodHero({ moodValue, stockCount }: MarketMoodHeroProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get sentiment text based on the value
  const getSentiment = (value: number) => {
    if (value <= 30) return "Extreme Fear"
    if (value <= 50) return "Fear"
    if (value <= 70) return "Greed"
    return "Extreme Greed"
  }

  // Get color based on the value
  const getColor = (value: number) => {
    if (value <= 30) return "#22c55e" // Green
    if (value <= 50) return "#eab308" // Yellow
    if (value <= 70) return "#f97316" // Orange
    return "#ef4444" // Red
  }

  const sentiment = getSentiment(moodValue)
  const color = getColor(moodValue)

  return (
    <div
      className="rounded-lg mt-4 p-10 shadow-lg mb-16 min-h-[380px] border"
      style={{
        background: `linear-gradient(to right, ${color}10, ${color}05)`
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Market Mood Index</h1>
          <p className="text-lg text-gray-300 mb-6">
            The Market Mood Index (MMI) is a tool designed to gauge market sentiment. It helps investors understand
            whether the market is driven by fear or greed, providing insights for better investment decisions.
          </p>
          <div className="flex items-center">
            <div
              className="text-sm px-4 py-2 rounded-full border"
              style={{ backgroundColor: `${color}20`, color, borderColor: `${color}80` }}
            >
              Current Sentiment: {sentiment}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          {mounted && (
            <div className="w-full max-w-[350px] h-[350px] mt-10">
              <Gauge value={moodValue} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
