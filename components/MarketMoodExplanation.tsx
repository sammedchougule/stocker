"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface MarketMoodExplanationProps {
  moodValue: number
  nifty50: {
    price: string
    change: string
    changepct: string
  }
}

export default function MarketMoodExplanation({ moodValue, nifty50 }: MarketMoodExplanationProps) {
  const [showZonesModal, setShowZonesModal] = useState(false)

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

  // Get explanation based on sentiment
  const getExplanation = (sentiment: string) => {
    switch (sentiment) {
      case "Extreme Fear":
        return "Extreme fear (<30) suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards"
      case "Fear":
        return "Investors are fearful in the market; it means fear is increasing in the market & investors should wait till it reaches Extreme Fear, as that is when the market is expected to turn upwards"
      case "Greed":
        return "Investors are acting greedy; it means greed is increasing in the market and investors should be cautious in opening new positions"
      case "Extreme Greed":
        return "Extreme greed (>70) suggests avoiding fresh positions as markets are overbought and likely to turn downwards"
      default:
        return ""
    }
  }

  const sentiment = getSentiment(moodValue)
  const color = getColor(moodValue)
  const explanation = getExplanation(sentiment)

  // Parse Nifty 50 data
  const niftyChange = Number.parseFloat(nifty50.change)
  const niftyChangePct = Number.parseFloat(nifty50.changepct)
  const isNiftyPositive = niftyChange >= 0

  // All zones data for the modal
  const allZones = [
    {
      name: "Extreme Fear (<30)",
      color: "#22c55e",
      explanation:
        "Extreme fear suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards. This is often considered a buying opportunity as most investors are pessimistic, which historically has been a good time to buy.",
    },
    {
      name: "Fear (30—50)",
      color: "#eab308",
      explanation:
        "Investors are fearful in the market; it means fear is increasing in the market & investors should wait till it reaches Extreme Fear, as that is when the market is expected to turn upwards.",
    },
    {
      name: "Greed (50—70)",
      color: "#f97316",
      explanation:
        "Investors are acting greedy; it means greed is increasing in the market and investors should be cautious in opening new positions. The market may be approaching overvalued territory.",
    },
    {
      name: "Extreme Greed (>70)",
      color: "#ef4444",
      explanation:
        "Extreme greed suggests avoiding fresh positions as markets are overbought and likely to turn downwards. This is often a signal that the market may be due for a correction.",
    },
  ]

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Understanding the Market Sentiment</h2>

      <Card className="mb-12 max-w-3xl mx-auto" style={{ borderTopColor: color }}>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-2" style={{ color }}>
            {sentiment}
          </h3>
          <p className="text-gray-300">
            {explanation}.{" "}
            <button onClick={() => setShowZonesModal(true)} className="text-blue-500 hover:underline font-medium">
              See All Zones
            </button>
          </p>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold mb-6 text-center">Change in MMI vs NIFTY</h3>

      <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center">
        <Card className="bg-card/50 w-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Nifty 50</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-4">₹{Number.parseFloat(nifty50.price).toLocaleString()}</span>
              <div
                className={`flex items-center px-3 py-1 rounded-md font-semibold ${
                  isNiftyPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                }`}
              >
                {isNiftyPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(niftyChangePct).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 w-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Market Mood Index</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-4">{moodValue.toFixed(2)}</span>
              <div className="px-3 py-1 rounded-md font-semibold" style={{ backgroundColor: `${color}20`, color }}>
                {sentiment}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Zones Modal */}
      <Dialog open={showZonesModal} onOpenChange={setShowZonesModal}>
        <DialogContent className="max-w-3xl mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Market Mood Index Zones</DialogTitle>
            <DialogDescription>
              Understanding different sentiment zones and their implications for market behavior
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {allZones.map((zone) => (
              <Card key={zone.name} className="border-l-4" style={{ borderLeftColor: zone.color }}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold" style={{ color: zone.color }}>
                      {zone.name}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{zone.explanation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
