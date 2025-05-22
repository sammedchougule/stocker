"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { fetchStocks, type Stock } from "@/lib/utils/fetchStocks"

export default function NiftyMarquee() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Good Morning"
    if (hour >= 12 && hour < 17) return "Good Afternoon"
    if (hour >= 17 && hour < 22) return "Good Evening"
    return "Good Night"
  }

  useEffect(() => {
    const getStocks = async () => {
      try {
        setLoading(true)
        const data = await fetchStocks()

        // Filter for equity stocks (not indices)
        const equityStocks = data.filter(
          (stock) => stock.type === "EQ" && stock.symbol && stock.price && stock.changepct,
        )

        setStocks(equityStocks)
      } catch (err) {
        setError("Failed to fetch stock data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getStocks()
  }, [])

  useEffect(() => {
    if (!scrollRef.current || loading || stocks.length === 0 || isPaused) return

    const scrollContainer = scrollRef.current
    let animationId: number
    let startTime: number
    const duration = 1000000 // 1000 seconds (16 minutes) for slow scrolling
    const totalWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = (elapsed % duration) / duration

      if (scrollContainer) {
        scrollContainer.scrollLeft = progress * totalWidth
      }

      animationId = requestAnimationFrame(step)
    }

    animationId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [loading, stocks, isPaused])

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border py-1 px-4 overflow-hidden">
        <div className="flex items-center h-6">
          <span className="animate-pulse">{getGreeting()}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border py-1 px-4 overflow-hidden">
        <div className="flex items-center h-6">
          <span className="text-red-500">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border py-1 px-4 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex items-center space-x-6 whitespace-nowrap overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {stocks.map((stock, index) => {
          const changePercent = Number.parseFloat(stock.changepct)
          const isPositive = changePercent >= 0

          return (
            <div key={`${stock.symbol}-${index}`} className="flex items-center">
              <span className="font-medium">{stock.symbol}</span>
              <span className="ml-1">₹{stock.price}</span>
              <span className={`ml-1 flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                {Math.abs(changePercent).toFixed(2)}%
              </span>
            </div>
          )
        })}

        {/* Duplicate the stocks for continuous scrolling effect */}
        {stocks.map((stock, index) => {
          const changePercent = Number.parseFloat(stock.changepct)
          const isPositive = changePercent >= 0

          return (
            <div key={`${stock.symbol}-duplicate-${index}`} className="flex items-center">
              <span className="font-medium">{stock.symbol}</span>
              <span className="ml-1">₹{stock.price}</span>
              <span className={`ml-1 flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                {Math.abs(changePercent).toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
