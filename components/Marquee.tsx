// 'use client'

// import { useEffect, useState, useMemo } from "react"
// import { useStockContext } from '@/contexts/StockContext'
// import FastMarquee from 'react-fast-marquee'

// const nifty50Symbols = [
//   "AXISBANK", "TATAMOTORS", "LT", "ITC", "BAJAJ-AUTO", "MARUTI", "TITAN",
//   "TATASTEEL", "DRREDDY", "SBILIFE", "TRENT", "BPCL", "EICHERMOT", "TATACONSUM",
//   "JSWSTEEL", "KOTAKBANK", "POWERGRID", "NTPC", "M&M", "NESTLEIND", "SHRIRAMFIN",
//   "BAJFINANCE", "BRITANNIA", "HINDALCO", "HCLTECH", "GRASIM", "HEROMOTOCO", "TECHM",
//   "BEL", "COALINDIA", "ADANIENT", "APOLLOHOSP", "ONGC", "BAJAJFINSV", "INDUSINDBK",
//   "WIPRO", "SBIN", "HDFCLIFE", "SUNPHARMA", "HINDUNILVR", "ULTRACEMCO", "ASIANPAINT",
//   "CIPLA", "ADANIPORTS", "TCS", "INFY", "BHARTIARTL", "ICICIBANK", "RELIANCE",
//   "HDFCBANK"
// ]

// export default function Marquee() {
//   const { stocks } = useStockContext()
//   const [greeting, setGreeting] = useState("")
//   const [showGreeting, setShowGreeting] = useState(true)

//   useEffect(() => {
//     const hour = new Date().getHours()
//     if (hour >= 5 && hour < 12) {
//       setGreeting("Good Morning 🌞")
//     } else if (hour >= 12 && hour < 17) {
//       setGreeting("Good Afternoon 🍵")
//     } else {
//       setGreeting("Good Evening 🛋️")
//     }

//     const timer = setTimeout(() => {
//       setShowGreeting(false)
//     }, 5000) // Show greeting for 10 seconds

//     return () => clearTimeout(timer)
//   }, [])

//   const filteredStocks = useMemo(() => {
//     if (!stocks) return []
//     return stocks.filter(stock => nifty50Symbols.includes(stock.symbol))
//   }, [stocks])

//   if (showGreeting) {
//     return (
//       <div className="fixed top-0 left-0 right-0 z-50 h-8 backdrop-blur-md bg-white/50 border-b ">
//         <p className="flex items-center justify-center h-full">{greeting}</p>
//       </div>
//     )
//   }

//   if (filteredStocks.length === 0) {
//     return (
//       <div className="fixed top-0 left-0 right-0 z-50 h-8 backdrop-blur-md bg-white/50 border-b ">
//         <p className="flex items-center justify-center h-full">No stocks available</p>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 h-8 overflow-hidden backdrop-blur-sm bg-white/50 border-b border-gray-200 ">
//       <FastMarquee
//         speed={80}
//         gradient={false}
//         pauseOnHover={true}
//       >
//         {filteredStocks.map((stock) => (
//           <span key={stock.symbol} className="inline-block mx-1">
//             <span className="mr-2 text-md font-medium text-gray-900 ">{stock.symbol}</span>
//             <span className="mr-2 text-md text-gray-900 ">₹{Number(stock.price).toFixed(2)}</span>
//             <span
//               className={`font-semibold text-md ${
//                 stock.changepct >= 0 ? "text-green-500 " : "text-red-500 "
//               }`}
//             >
//               {stock.changepct >= 0 ? "▲" : "▼"} {Number(stock.changepct).toFixed(2)}%
//             </span>
//           </span>
//         ))}
//       </FastMarquee>
//     </div>
//   )
// }



"use client"

import { useEffect, useState, useMemo } from "react"
import { useStockContext } from "@/contexts/StockContext"
import Marquee from "react-fast-marquee"

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
  const { stocks } = useStockContext()
  const [greeting, setGreeting] = useState("")
  const [showGreeting, setShowGreeting] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning 🌞")
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon 🍵")
    } else {
      setGreeting("Good Evening 🛋️")
    }

    const timer = setTimeout(() => {
      setShowGreeting(false)
    }, 5000) // Show greeting for 5 seconds

    return () => clearTimeout(timer)
  }, [])

  const filteredStocks = useMemo(() => {
    if (!stocks) return []
    return stocks.filter((stock) => nifty50Symbols.includes(stock.symbol))
  }, [stocks])

  if (showGreeting) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-8 backdrop-blur-md bg-white dark:bg-[#151719] border-b dark:border-gray-700">
        <p className="flex items-center justify-center h-full text-gray-900 dark:text-gray-100">{greeting}</p>
      </div>
    )
  }

  if (filteredStocks.length === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-8 backdrop-blur-md bg-white dark:bg-[#151719] border-b dark:border-gray-700">
        <p className="flex items-center justify-center h-full text-gray-900 dark:text-gray-100">No stocks available</p>
      </div>
    )
  }

  return (
    <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 h-8 overflow-hidden backdrop-blur-sm bg-white dark:bg-[#151719] border-b border-gray-200 dark:border-gray-700">
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

