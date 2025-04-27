"use client"

import { useEffect, useState, useMemo } from "react"
import Marquee from "react-fast-marquee"
import { getStocks } from "@/lib/getStocks"
import type { Stock } from "@/types/Stock"

const nifty50Symbols = [
  "AXISBANK",
  "TATAMOTORS",
  "LT",
  "ITC",
  "BAJAJ-AUTO",
  "MARUTI",
  "TITAN",
  "TATASTEEL",
  "DRREDDY",
  "SBILIFE",
  "TRENT",
  "BPCL",
  "EICHERMOT",
  "TATACONSUM",
  "JSWSTEEL",
  "KOTAKBANK",
  "POWERGRID",
  "NTPC",
  "M&M",
  "NESTLEIND",
  "SHRIRAMFIN",
  "BAJFINANCE",
  "BRITANNIA",
  "HINDALCO",
  "HCLTECH",
  "GRASIM",
  "HEROMOTOCO",
  "TECHM",
  "BEL",
  "COALINDIA",
  "ADANIENT",
  "APOLLOHOSP",
  "ONGC",
  "BAJAJFINSV",
  "INDUSINDBK",
  "WIPRO",
  "SBIN",
  "HDFCLIFE",
  "SUNPHARMA",
  "HINDUNILVR",
  "ULTRACEMCO",
  "ASIANPAINT",
  "CIPLA",
  "ADANIPORTS",
  "TCS",
  "INFY",
  "BHARTIARTL",
  "ICICIBANK",
  "RELIANCE",
  "HDFCBANK",
]

export default function StockMarquee() {
  const [stocks, setStocks] = useState<Stock[]>([]) 
  const [loading, setLoading] = useState<boolean>(true)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true)
      const fetchedStocks = await getStocks()
      setStocks(fetchedStocks)
      setLoading(false)
    }

    fetchStocks()

    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning 🌞")
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon 🍵")
    } else {
      setGreeting("Good Evening 🛋️")
    }
  }, [])

  // Filter stocks based on Nifty 50 symbols
  const filteredStocks = useMemo(() => {
    if (!stocks) return []
    return stocks.filter((stock) => nifty50Symbols.includes(stock.symbol))
  }, [stocks])

  if (loading || filteredStocks.length === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-8 backdrop-blur-md bg-white/50 dark:bg-black border-b dark:border-gray-700">
        <p className="flex items-center justify-center h-full text-gray-900 dark:text-gray-100">{greeting}</p>
      </div>
    )
  }

  return (
    <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 h-8 overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-black border-b border-gray-200 dark:border-gray-700">
      <Marquee speed={80} gradient={false} pauseOnHover={true}>
        {filteredStocks.map((stock) => (
          <span key={stock.symbol} className="inline-block mx-1">
            <span className="mr-2 text-md font-medium text-gray-900 dark:text-gray-100">{stock.symbol}</span>
            <span className="mr-2 text-md text-gray-900 dark:text-gray-100">₹{Number(stock.price).toFixed(2)}</span>
            <span
              className={`font-semibold text-md ${stock.changepct >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
            >
              {stock.changepct >= 0 ? "▲" : "▼"} {Number(stock.changepct).toFixed(2)}%
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
