"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState, useMemo } from "react"
import type { Stock } from "@/types/Stock"
import {
  CircleArrowOutDownLeft,
  CircleArrowOutUpLeft,
  CircleArrowOutUpRight,
  CircleArrowOutDownRight,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const NIFTY50_STOCKS = [
  "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK", "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV",
  "BPCL", "BHARTIARTL", "BRITANNIA", "CIPLA", "COALINDIA", "DIVISLAB", "DRREDDY", "EICHERMOT", "GRASIM", "HCLTECH",
  "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDUNILVR", "ICICIBANK", "INDUSINDBK", "INFY", "ITC",
  "JSWSTEEL", "KOTAKBANK", "LT", "M&M", "MARUTI", "NESTLEIND", "NTPC", "ONGC", "POWERGRID", "RELIANCE",
  "SBILIFE", "SBIN", "SUNPHARMA", "TCS", "TATACONSUM", "TATAMOTORS", "TATASTEEL", "TECHM", "TITAN",
  "ULTRACEMCO", "UPL", "WIPRO"
]

interface MarketMoodProps {
  stocks: Stock[]
}

export default function MarketMood({ stocks }: MarketMoodProps) {
  const [marketMood, setMarketMood] = useState(50)
  const [showModal, setShowModal] = useState(false)

  const nifty50Data = useMemo(() => {
    if (!stocks) return { green: 0, red: 0, total: 0 }
    const niftyStocks = stocks.filter((stock) => NIFTY50_STOCKS.includes(stock.symbol))
    const green = niftyStocks.filter((stock) => stock.changepct > 0).length
    const red = niftyStocks.filter((stock) => stock.changepct < 0).length
    return {
      green,
      red,
      total: niftyStocks.length,
    }
  }, [stocks])

  useEffect(() => {
    const moodPercentage = (nifty50Data.green / nifty50Data.total) * 100
    setMarketMood(moodPercentage)
  }, [nifty50Data])

  const calculateRotation = (value: number) => {
    return (value / 100) * 180 - 90
  }

  const getMoodInfo = (value: number) => {
    if (value <= 30)
      return {
        text: "Extreme Fear",
        color: "#16a34a",
        explanation: "Extreme fear (<30) suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards.",
      }
    if (value <= 50)
      return {
        text: "Fear",
        color: "#ca8a04",
        explanation: "Investors are fearful in the market; action depends on the MMI trajectory.",
      }
    if (value <= 70)
      return {
        text: "Greed",
        color: "#f97316",
        explanation: "Investors are acting greedy; action depends on the MMI trajectory.",
      }
    return {
      text: "Extreme Greed",
      color: "#dc2626",
      explanation: "Extreme greed (>70) suggests avoiding fresh positions as markets are overbought.",
    }
  }

  const moodRanges = [
    { id: "extreme-fear", label: "Extreme Fear", color: "#16a34a", range: [0, 30] },
    { id: "fear", label: "Fear", color: "#ca8a04", range: [30, 50] },
    { id: "greed", label: "Greed", color: "#f97316", range: [50, 70] },
    { id: "extreme-greed", label: "Extreme Greed", color: "#dc2626", range: [70, 100] },
  ]
  const activeRange = moodRanges.find(r => marketMood >= r.range[0] && marketMood < r.range[1]) || moodRanges[3]

  const moodInfo = getMoodInfo(marketMood)

  return (
    <Card className="h-full bg-white dark:bg-[#151719] dark:dark-noise overflow-hidden">
      <CardContent className="pt-6 px-2 sm:px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold dark:text-white">Market Mood Index</h3>
          <p className="text-md text-gray-500 dark:text-gray-400">Know what&apos;s the sentiment on the street today</p>

          <div className="relative w-full max-w-[500px] mx-auto mb-10">
            <div className="flex justify-between text-sm font-medium my-6 px-4">
              <span className="text-green-600 dark:text-green-400">Extreme Fear</span>
              <span className="text-yellow-500 dark:text-yellow-400">Fear</span>
              <span className="text-orange-500 dark:text-orange-400">Greed</span>
              <span className="text-red-600 dark:text-red-400">Extreme Greed</span>
            </div>

            <div className="relative w-[90%] max-w-[500px] mx-auto font-sans">
              <div className="w-full h-auto">
                <svg viewBox="0 0 338 173" className="w-full">
                  {moodRanges.map((segment) => (
                    <path
                      key={segment.id}
                      id={segment.id}
                      fill={segment.color}
                      opacity={segment.id === activeRange.id ? 1 : 0.25}
                      d={
                        segment.id === "extreme-fear"
                          ? "M47 53 l 45 45 c -17.8 18.9 -28.7 44.3 -28.7 72.2 H 0 C 0 124.7 17.7 83.7 41 59 z"
                          : segment.id === "fear"
                          ? "M133 5 c -27 6 -61.6 23.5 -84.8 47.1 l 45 45 c 14.6 -14.7 49.8 -33.5 78.5 -34.1 l 0 -62 z z"
                          : segment.id === "greed"
                          ? "M173 63 l 14 2 c 21.1 4.1 40 14.4 57 32 L 290 52 C 266.4 28.4 237.4 12 203 5 L 173 1 z"
                          : "M291 53 l -46 45 c 17.8 18.9 28.7 44.3 28.7 72.2 h 63.4 C 337.6 124.7 319.9 83.7 291 53 z"
                      }
                    />
                  ))}
                  <text
                    x="169"
                    y="130"
                    textAnchor="middle"
                    className="text-4xl font-bold"
                    fill={activeRange.color}
                  >
                    {marketMood.toFixed(2)}
                  </text>
                </svg>
              </div>

              <div
                className="absolute bottom-[5%] left-1/2 w-[4%] h-[70%] origin-bottom translate-x-[-50%] z-10 transition-transform duration-1000 ease-in-out border border-gray-300 dark:border-gray-600"
                style={{ transform: `translateX(-50%) rotate(${calculateRotation(marketMood)}deg)` }}
              >
                <svg className="w-full h-full fill-black dark:fill-white" viewBox="0 0 10 124">
                  <path
                    d="M5,0.2c-0.6,0-1.1,0.5-1.1,1.1L0.8,106.7c0,2.3-0.1,13.6,2.6,16.3c0.6,0.6,1.3,0.7,1.8,0.7l0,0c0.5,0,1.1-0.2,1.7-0.9c0.1-0.2,0.3-0.3,0.4-0.5c2.2-3.6,1.7-13.9,1.6-16L6.1,1.3C6.1,0.7,5.6,0.2,5,0.2"
                  />
                </svg>
              </div>

              <div className="absolute bottom-[3%] left-1/2 translate-x-[-50%] w-[8%] h-[8%] bg-gray-800 dark:bg-gray-600 rounded-t-full border border-gray-200 dark:border-gray-600 shadow-md z-20" />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mx-2 mt-4">
              MMI is in the{" "}
              <span style={{ color: moodInfo.color }} className="font-bold text-[1.1rem]">
                {moodInfo.text} Zone.
              </span>{" "}
              {moodInfo.explanation}
            </p>

            <button className="text-blue-600 dark:text-blue-400 mt-2" onClick={() => setShowModal(true)}>
              See All Zones
            </button>
          </div>
        </div>
      </CardContent>

      <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
        <DialogContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg w-[calc(100%-32px)] sm:w-full shadow-lg mx-auto">
          <DialogHeader className="flex flex-col">
            <div className="flex justify-between items-start w-full border-b dark:border-gray-700">
              <DialogTitle className="text-xl font-semibold dark:text-white">See How to Read All Zones</DialogTitle>
            </div>
          </DialogHeader>
          <div>
            <ul className="space-y-4">
              <li className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CircleArrowOutDownLeft className="text-green-600 dark:text-green-400" size={20} />
                  <span className="font-bold text-green-600 dark:text-green-400">Extreme Fear (&lt;30):</span>
                </div>
                <span className="font-normal dark:text-gray-300">
                  Extreme fear suggests a good time to open fresh positions, as markets are likely to be oversold and
                  might turn upwards.
                </span>
              </li>
              <li className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CircleArrowOutUpLeft className="text-yellow-500 dark:text-yellow-400" size={20} />
                  <span className="font-bold text-yellow-500 dark:text-yellow-400">Fear (30-50):</span>
                </div>
                <span className="font-normal dark:text-gray-300">
                  If dropping from Greed to Fear, wait till Extreme Fear. If rising from Extreme Fear, consider opening
                  positions.
                </span>
              </li>
              <li className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CircleArrowOutUpRight className="text-orange-500 dark:text-orange-400" size={20} />
                  <span className="font-bold text-orange-500 dark:text-orange-400">Greed (50-70):</span>
                </div>
                <span className="font-normal dark:text-gray-300">
                  If rising towards Greed, be cautious with new positions. If dropping from Extreme Greed, wait for
                  better opportunities.
                </span>
              </li>
              <li className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CircleArrowOutDownRight className="text-red-500 dark:text-red-400" size={20} />
                  <span className="font-bold text-red-500 dark:text-red-400">Extreme Greed ({">"}70):</span>
                </div>
                <span className="font-normal dark:text-gray-300">
                  Avoid opening fresh positions as markets are overbought and likely to turn downwards.
                </span>
              </li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
      
    </Card>
  )
}
