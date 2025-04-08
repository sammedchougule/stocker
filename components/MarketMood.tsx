

// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { useEffect, useState, useMemo } from "react"
// import type { Stock } from "@/types/Stock"
// import {
//   CircleArrowOutDownLeft,
//   CircleArrowOutUpLeft,
//   CircleArrowOutUpRight,
//   CircleArrowOutDownRight,
// } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import "react-loading-skeleton/dist/skeleton.css"

// // Nifty 50 stocks array
// const NIFTY50_STOCKS = [
//   "ADANIENT",
//   "ADANIPORTS",
//   "APOLLOHOSP",
//   "ASIANPAINT",
//   "AXISBANK",
//   "BAJAJ-AUTO",
//   "BAJFINANCE",
//   "BAJAJFINSV",
//   "BPCL",
//   "BHARTIARTL",
//   "BRITANNIA",
//   "CIPLA",
//   "COALINDIA",
//   "DIVISLAB",
//   "DRREDDY",
//   "EICHERMOT",
//   "GRASIM",
//   "HCLTECH",
//   "HDFCBANK",
//   "HDFCLIFE",
//   "HEROMOTOCO",
//   "HINDALCO",
//   "HINDUNILVR",
//   "ICICIBANK",
//   "INDUSINDBK",
//   "INFY",
//   "ITC",
//   "JSWSTEEL",
//   "KOTAKBANK",
//   "LT",
//   "M&M",
//   "MARUTI",
//   "NESTLEIND",
//   "NTPC",
//   "ONGC",
//   "POWERGRID",
//   "RELIANCE",
//   "SBILIFE",
//   "SBIN",
//   "SUNPHARMA",
//   "TCS",
//   "TATACONSUM",
//   "TATAMOTORS",
//   "TATASTEEL",
//   "TECHM",
//   "TITAN",
//   "ULTRACEMCO",
//   "UPL",
//   "WIPRO",
// ]

// interface MarketMoodProps {
//   stocks: Stock[]
//   loading: boolean
// }

// export default function MarketMood({ stocks, loading }: MarketMoodProps) {
//   const [marketMood, setMarketMood] = useState(50)
//   const [showModal, setShowModal] = useState(false)

//   const nifty50Data = useMemo(() => {
//     if (!stocks) return { green: 0, red: 0, total: 0 }
//     const niftyStocks = stocks.filter((stock) => NIFTY50_STOCKS.includes(stock.symbol))
//     const green = niftyStocks.filter((stock) => stock.changepct > 0).length
//     const red = niftyStocks.filter((stock) => stock.changepct < 0).length
//     return {
//       green,
//       red,
//       total: niftyStocks.length,
//     }
//   }, [stocks])

//   useEffect(() => {
//     const moodPercentage = (nifty50Data.green / nifty50Data.total) * 100
//     setMarketMood(moodPercentage)
//   }, [nifty50Data])

//   const calculateRotation = (value: number) => {
//     return -135 + (value * 270) / 100
//   }

//   const getMoodInfo = (value: number) => {
//     if (value <= 30)
//       return {
//         text: "Extreme Fear",
//         color: "#16a34a",
//         explanation:
//           "Extreme fear (<30) suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards.",
//       }
//     if (value <= 50)
//       return {
//         text: "Fear",
//         color: "#ca8a04",
//         explanation: "Investors are fearful in the market; action depends on the MMI trajectory.",
//       }
//     if (value <= 70)
//       return {
//         text: "Greed",
//         color: "#ca8a04",
//         explanation: "Investors are acting greedy; action depends on the MMI trajectory.",
//       }
//     return {
//       text: "Extreme Greed",
//       color: "#dc2626",
//       explanation: "Extreme greed (>70) suggests avoiding fresh positions as markets are overbought.",
//     }
//   }

//   const moodInfo = getMoodInfo(marketMood)

//   const renderSkeleton = () => (
//     <div className="space-y-4">
//       {/* Market Mood Index Title (No Loading Effect) */}
//       <div className="text-center">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Market Mood Index</h2>
//         <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto animate-pulse mt-6"></div>
//       </div>

//       <div className="relative w-full max-w-[400px] mx-auto">
//         {/* Sentiment labels */}
//         <div className="flex justify-between text-sm font-medium  mt-10 px-2">
//           <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//           <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//           <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//           <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//         </div>

//         {/* Gauge SVG Placeholder */}
//         <svg viewBox="0 20 300 200" className="w-full">
//           {/* Background Arc */}
//           <path
//             d="M30 170 A120 120 0 0 1 270 170"
//             fill="none"
//             stroke="#e5e7eb"
//             strokeWidth="18"
//             className="animate-pulse dark:stroke-gray-700"
//           />

//           {/* Outer gray circles */}
//           <circle cx="150" cy="170" r="130" fill="none" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-gray-700 animate-pulse" />
//           <circle cx="150" cy="170" r="110" fill="none" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-gray-700 animate-pulse" />

//           {/* Gauge Needle */}
//           <line x1="150" y1="170" x2="150" y2="75" stroke="#e5e7eb" strokeWidth="4" className="animate-pulse dark:stroke-gray-600" />
//           <circle cx="150" cy="170" r="8" fill="#e5e7eb" className="animate-pulse dark:fill-gray-600" />

//           {/* Placeholder for Market Mood Score */}
//           <rect x="130" y="155" width="40" height="30" rx="5" fill="#e5e7eb" className="animate-pulse dark:fill-gray-600" />
//         </svg>
//       </div>

//       {/* Mood Explanation with Proper Spacing */}
//       <div className="text-center mt-10">
//         <p className="text-sm text-gray-500 dark:text-gray-400 mx-10">
//           <span className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-full inline-block animate-pulse"></span>
//           <span className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-full block mx-auto mt-1 animate-pulse"></span>
//         </p>
//         <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-2 animate-pulse"></div>
//       </div>
//     </div>


//   )

//   return (
//     <Card className="h-full bg-white dark:bg-[#151719] dark:dark-noise overflow-hidden">
//       <CardContent className="pt-6 px-2 sm:px-4">
//         {loading ? (
//           renderSkeleton()
//         ) : (
//           <div className="text-center">
//             <h3 className="text-2xl font-bold dark:text-white">Market Mood Index</h3>
//             <p className="text-md text-gray-500 dark:text-gray-400">
//               Know what&apos;s the sentiment on the street today
//             </p>

//             <div className="relative w-full max-w-[400px] mx-auto">
//               <div className="flex justify-between text-md font-medium mt-4">
//                 <span className="text-green-600 dark:text-green-400">Extreme Fear</span>
//                 <span className="text-yellow-500 dark:text-yellow-400">Fear</span>
//                 <span className="text-orange-500 dark:text-orange-400">Greed</span>
//                 <span className="text-red-600 dark:text-red-400">Extreme Greed</span>
//               </div>
              
//               <svg viewBox="0 20 300 200" className="w-full">
//                 {/* Background arc */}
//                 <path d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke="url(#gaugeGradient)" strokeWidth="18" />

//                 {/* Colored segments */}
//                 <defs>
//                   <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="green" /> {/* Extreme Fear - Green */}
//                     <stop offset="10%" stopColor="#22c55e" />
//                     <stop offset="20%" stopColor="#eab308" /> {/* Fear - Yellow */}
//                     <stop offset="30%" stopColor="#eab308" />
//                     <stop offset="40%" stopColor="#eab308" />
//                     <stop offset="50%" stopColor="#f97316" /> {/* Greed - Orange */}
//                     <stop offset="60%" stopColor="#f97316" />
//                     <stop offset="75%" stopColor="#f97316" />
//                     <stop offset="85%" stopColor="#dc2626" /> {/* Extreme Greed - Red */}
//                     <stop offset="90%" stopColor="#dc2626" />
//                     <stop offset="100%" stopColor="#dc2626" />
//                   </linearGradient>
//                 </defs>

//                 {/* Outer Gray circles */}
//                 <circle
//                   cx="150"
//                   cy="170"
//                   r="130"
//                   fill="none"
//                   stroke="#e5e7eb"
//                   strokeWidth="4"
//                   strokeDasharray={`${Math.PI * 130}`}
//                   strokeDashoffset={`${(Math.PI * 260) / 2}`}
//                   className="dark:stroke-gray-600"
//                 />

//                 {/* Inner Gray circles */}
//                 <circle
//                   cx="150"
//                   cy="170"
//                   r="110"
//                   fill="none"
//                   stroke="#e5e7eb"
//                   strokeWidth="4"
//                   strokeDasharray={`${Math.PI * 110}`}
//                   strokeDashoffset={`${(Math.PI * 220) / 2}`}
//                   className="dark:stroke-gray-600"
//                 />

//                 <g
//                   transform={`translate(150, 170) rotate(${calculateRotation(marketMood)})`}
//                   className="transition-transform duration-1000"
//                 >
//                   <line
//                     x1="0"
//                     y1="5"
//                     x2="0"
//                     y2="-95"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     className="origin-bottom dark:stroke-white"
//                   />
//                   <circle r="8" fill="currentColor" className="dark:fill-white" />
//                 </g>

//                 <text x="150" y="170" textAnchor="middle" className="text-5xl font-bold fill-current dark:fill-white">
//                   {marketMood.toFixed(2)}
//                 </text>
//               </svg>
//             </div>

//             {/* Modd explanation */}
//             <p className="text-sm text-gray-500 dark:text-gray-400 mx-2">
//               MMI is in the{" "}
//               <span style={{ color: moodInfo.color, fontWeight: "bold", fontSize: "1.1rem" }}>
//                 {moodInfo.text} Zone.
//               </span>{" "}
//               {moodInfo.explanation}
//             </p>

//             <button className="text-blue-600 dark:text-blue-400 mt-2" onClick={() => setShowModal(true)}>
//               See All Zones
//             </button>
//           </div>
//         )}
//       </CardContent>

//       {/* Modal */}
//       <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
//         <DialogContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg w-[calc(100%-32px)] sm:w-full shadow-lg mx-auto">
//           <DialogHeader className="flex flex-col">
//             <div className="flex justify-between items-start w-full border-b dark:border-gray-700">
//               <DialogTitle className="text-xl font-semibold dark:text-white">See How to Read All Zones</DialogTitle>
//             </div>
//           </DialogHeader>
//           <div>
//             <ul className="space-y-4">
//               <li className="mb-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CircleArrowOutDownLeft className="text-green-600 dark:text-green-400" size={20} />
//                   <span className="font-bold text-green-600 dark:text-green-400">Extreme Fear (&lt;30):</span>
//                 </div>
//                 <span className="font-normal dark:text-gray-300">
//                   Extreme fear suggests a good time to open fresh positions, as markets are likely to be oversold and
//                   might turn upwards.
//                 </span>
//               </li>
//               <li className="mb-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CircleArrowOutUpLeft className="text-yellow-500 dark:text-yellow-400" size={20} />
//                   <span className="font-bold text-yellow-500 dark:text-yellow-400">Fear (30-50):</span>
//                 </div>
//                 <span className="font-normal dark:text-gray-300">
//                   If dropping from Greed to Fear, wait till Extreme Fear. If rising from Extreme Fear, consider opening
//                   positions.
//                 </span>
//               </li>
//               <li className="mb-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CircleArrowOutUpRight className="text-orange-500 dark:text-orange-400" size={20} />
//                   <span className="font-bold text-orange-500 dark:text-orange-400">Greed (50-70):</span>
//                 </div>
//                 <span className="font-normal dark:text-gray-300">
//                   If rising towards Greed, be cautious with new positions. If dropping from Extreme Greed, wait for
//                   better opportunities.
//                 </span>
//               </li>
//               <li className="mb-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CircleArrowOutDownRight className="text-red-500 dark:text-red-400" size={20} />
//                   <span className="font-bold text-red-500 dark:text-red-400">Extreme Greed ({">"}70):</span>
//                 </div>
//                 <span className="font-normal dark:text-gray-300">
//                   Avoid opening fresh positions as markets are overbought and likely to turn downwards.
//                 </span>
//               </li>
//             </ul>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   )
// }





// marketmood ui


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
import "react-loading-skeleton/dist/skeleton.css"

// Nifty 50 stocks array
const NIFTY50_STOCKS = [
  "ADANIENT",
  "ADANIPORTS",
  "APOLLOHOSP",
  "ASIANPAINT",
  "AXISBANK",
  "BAJAJ-AUTO",
  "BAJFINANCE",
  "BAJAJFINSV",
  "BPCL",
  "BHARTIARTL",
  "BRITANNIA",
  "CIPLA",
  "COALINDIA",
  "DIVISLAB",
  "DRREDDY",
  "EICHERMOT",
  "GRASIM",
  "HCLTECH",
  "HDFCBANK",
  "HDFCLIFE",
  "HEROMOTOCO",
  "HINDALCO",
  "HINDUNILVR",
  "ICICIBANK",
  "INDUSINDBK",
  "INFY",
  "ITC",
  "JSWSTEEL",
  "KOTAKBANK",
  "LT",
  "M&M",
  "MARUTI",
  "NESTLEIND",
  "NTPC",
  "ONGC",
  "POWERGRID",
  "RELIANCE",
  "SBILIFE",
  "SBIN",
  "SUNPHARMA",
  "TCS",
  "TATACONSUM",
  "TATAMOTORS",
  "TATASTEEL",
  "TECHM",
  "TITAN",
  "ULTRACEMCO",
  "UPL",
  "WIPRO",
]

interface MarketMoodProps {
  stocks: Stock[]
  loading: boolean
}

export default function MarketMood({ stocks, loading }: MarketMoodProps) {
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
        explanation:
          "Extreme fear (<30) suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards.",
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
        color: "#ca8a04",
        explanation: "Investors are acting greedy; action depends on the MMI trajectory.",
      }
    return {
      text: "Extreme Greed",
      color: "#dc2626",
      explanation: "Extreme greed (>70) suggests avoiding fresh positions as markets are overbought.",
    }
  }

    //market mood ranges
  const moodRanges = [
    { id: "extreme-fear", label: "Extreme Fear", color: "#16a34a", range: [0, 30] },
    { id: "fear", label: "Fear", color: "#ca8a04", range: [30, 50] },
    { id: "greed", label: "Greed", color: "#f97316", range: [50, 70] },
    { id: "extreme-greed", label: "Extreme Greed", color: "#dc2626", range: [70, 100] }
  ]
  // Get the active range based on mood
  const activeRange = moodRanges.find(r => marketMood >= r.range[0] && marketMood < r.range[1]) || moodRanges[3]
  

  const moodInfo = getMoodInfo(marketMood)

  return (
    <Card className="h-full bg-white dark:bg-[#151719] dark:dark-noise overflow-hidden">
      <CardContent className="pt-6 px-2 sm:px-4">
        
          <div className="text-center">
            <h3 className="text-2xl font-bold dark:text-white">Market Mood Index</h3>
            <p className="text-md text-gray-500 dark:text-gray-400">
              Know what&apos;s the sentiment on the street today
            </p>

            <div className="relative w-full max-w-[500px] mx-auto mb-10">
              <div className="flex justify-between text-sm font-medium my-6 px-4">
                <span className="text-green-600 dark:text-green-400">Extreme Fear</span>
                <span className="text-yellow-500 dark:text-yellow-400">Fear</span>
                <span className="text-orange-500 dark:text-orange-400">Greed</span>
                <span className="text-red-600 dark:text-red-400">Extreme Greed</span>
              </div>
              
              <div className="market-fng-gauge__meter">
                <div className="market-fng-gauge__dial">
                  <svg viewBox="0 0 338 173" className="w-full">
                    {/* Gauge segments with dynamic opacity based on marketMood */}
                    {moodRanges.map((segment) => (
                      <path
                        key={segment.id}
                        id={segment.id}
                        fill={segment.color}
                        opacity={segment.id === activeRange.id ? 1 : 0.25} // highlight only active range
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

                    {/* Score display */}
                    <text
                      x="169"
                      y="130"
                      textAnchor="middle"
                      className="text-4xl font-bold"
                      fill="currentColor"
                      style={{ fill: activeRange.color }}
                    >
                      {marketMood.toFixed(2)}
                    </text>
                  </svg>
                </div>

                

                <div 
                  className="market-fng-gauge__hand" 
                  style={{ 
                    transform: `translateX(-50%) rotate(${calculateRotation(marketMood)}deg)`,
                    transition: 'transform 1s ease-in-out'
                  }}
                >
                  <svg className="market-fng-gauge__hand-svg" viewBox="0 0 10 124" preserveAspectRatio="xMidYMid meet">
                    <path
                      d="M5,0.2c-0.6,0-1.1,0.5-1.1,1.1L0.8,106.7c0,2.3-0.1,13.6,2.6,16.3c0.6,0.6,1.3,0.7,1.8,0.7l0,0c0.5,0,1.1-0.2,1.7-0.9c0.1-0.2,0.3-0.3,0.4-0.5c2.2-3.6,1.7-13.9,1.6-16L6.1,1.3C6.1,0.7,5.6,0.2,5,0.2"
                      fill="currentColor"
                      className="dark:fill-white"
                    />
                  </svg>
                </div>

                <div className="market-fng-gauge__hand-base"></div>
              </div>
            </div>

            {/* Mood explanation */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mx-2">
              MMI is in the{" "}
              <span style={{ color: moodInfo.color, fontWeight: "bold", fontSize: "1.1rem" }}>
                {moodInfo.text} Zone.
              </span>{" "}
              {moodInfo.explanation}
            </p>

            <button className="text-blue-600 dark:text-blue-400 mt-2" onClick={() => setShowModal(true)}>
              See All Zones
            </button>
          </div>
       
      </CardContent>

      {/* Modal */}
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

// Add the CSS styles
const styles = `
.market-fng-gauge__meter {
  position: relative;
  width: 90%;
  max-width: 500px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.market-fng-gauge__dial {
  width: 100%;
  height: auto;
}

.market-fng-gauge__hand {
  position: absolute;
  bottom: 5%;
  left: 50%;
  width: 4%;
  height: 70%;
  transform-origin: 50% 95%;
  z-index: 10;
}

.market-fng-gauge__hand-svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: #333;
}

.market-fng-gauge__hand-base {
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 8%;
  height: 8%;
  background-color: #333;
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 2px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 15;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .market-fng-gauge__hand-svg {
    fill: white;
  }
  .market-fng-gauge__hand-base {
    background-color: #555;
    border-color: #777;
  }
}
`

// Inject the styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}