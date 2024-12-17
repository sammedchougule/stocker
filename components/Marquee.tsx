'use client'

import { useEffect, useState, useMemo } from "react"
import { useStockContext } from '@/context/StockContext'
import FastMarquee from 'react-fast-marquee'

const nifty50Symbols = [
  "AXISBANK", "TATAMOTORS", "LT", "ITC", "BAJAJ-AUTO", "MARUTI", "TITAN",
  "TATASTEEL", "DRREDDY", "SBILIFE", "TRENT", "BPCL", "EICHERMOT", "TATACONSUM",
  "JSWSTEEL", "KOTAKBANK", "POWERGRID", "NTPC", "M&M", "NESTLEIND", "SHRIRAMFIN",
  "BAJFINANCE", "BRITANNIA", "HINDALCO", "HCLTECH", "GRASIM", "HEROMOTOCO", "TECHM",
  "BEL", "COALINDIA", "ADANIENT", "APOLLOHOSP", "ONGC", "BAJAJFINSV", "INDUSINDBK",
  "WIPRO", "SBIN", "HDFCLIFE", "SUNPHARMA", "HINDUNILVR", "ULTRACEMCO", "ASIANPAINT",
  "CIPLA", "ADANIPORTS", "TCS", "INFY", "BHARTIARTL", "ICICIBANK", "RELIANCE",
  "HDFCBANK"
]

export default function Marquee() {
  const { stocks } = useStockContext()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning 🌞")
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon 🍵")
    } else {
      setGreeting("Good Evening 🛋️")
    }
  }, [])

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return price.toFixed(2)
    }
    return price
  }

  const filteredStocks = useMemo(() => {
    if (!stocks) return []
    return stocks.filter(stock => nifty50Symbols.includes(stock.symbol))
  }, [stocks])

  if (!stocks || filteredStocks.length === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-8 backdrop-blur-md bg-white/50 border-b ">
        <p className="flex items-center justify-center h-full">{greeting}</p>
      </div>
    )
  }

  return (
    <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 h-8 overflow-hidden backdrop-blur-sm bg-white/50 border-b border-gray-200 ">
      <FastMarquee
        speed={80}
        gradient={false}
        pauseOnHover={true}
      >
        {filteredStocks.map((stock, index) => (
          <span key={stock.symbol} className="inline-block mx-1">
            <span className="mr-2 text-md font-medium text-gray-900 ">{stock.symbol}</span>
            <span className="mr-2 text-md text-gray-900 ">₹{formatPrice(stock.price)}</span>
            <span
              className={`font-semibold text-md ${
                stock.changepct >= 0 ? "text-green-500 " : "text-red-500 "
              }`}
            >
              {stock.changepct >= 0 ? "▲" : "▼"} {formatPrice(stock.changepct)}%
            </span>
          </span>
        ))}
      </FastMarquee>
    </div>
  )
}

