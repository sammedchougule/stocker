

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
    return -135 + (value * 270) / 100
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

  const moodInfo = getMoodInfo(marketMood)

  const renderSkeleton = () => (
    <div className="space-y-4">
      {/* Market Mood Index Title (No Loading Effect) */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Market Mood Index</h2>
        <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto animate-pulse mt-6"></div>
      </div>

      <div className="relative w-full max-w-[400px] mx-auto">
        {/* Sentiment labels */}
        <div className="flex justify-between text-sm font-medium  mt-10 px-2">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Gauge SVG Placeholder */}
        <svg viewBox="0 20 300 200" className="w-full">
          {/* Background Arc */}
          <path
            d="M30 170 A120 120 0 0 1 270 170"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="18"
            className="animate-pulse dark:stroke-gray-700"
          />

          {/* Outer gray circles */}
          <circle cx="150" cy="170" r="130" fill="none" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-gray-700 animate-pulse" />
          <circle cx="150" cy="170" r="110" fill="none" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-gray-700 animate-pulse" />

          {/* Gauge Needle */}
          <line x1="150" y1="170" x2="150" y2="75" stroke="#e5e7eb" strokeWidth="4" className="animate-pulse dark:stroke-gray-600" />
          <circle cx="150" cy="170" r="8" fill="#e5e7eb" className="animate-pulse dark:fill-gray-600" />

          {/* Placeholder for Market Mood Score */}
          <rect x="130" y="155" width="40" height="30" rx="5" fill="#e5e7eb" className="animate-pulse dark:fill-gray-600" />
        </svg>
      </div>

      {/* Mood Explanation with Proper Spacing */}
      <div className="text-center mt-10">
        <p className="text-sm text-gray-500 dark:text-gray-400 mx-10">
          <span className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-full inline-block animate-pulse"></span>
          <span className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-full block mx-auto mt-1 animate-pulse"></span>
        </p>
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-2 animate-pulse"></div>
      </div>
    </div>


  )

  return (
    <Card className="h-full bg-white dark:bg-[#151719] dark:dark-noise overflow-hidden">
      <CardContent className="pt-6 px-2 sm:px-4">
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold dark:text-white">Market Mood Index</h3>
            <p className="text-md text-gray-500 dark:text-gray-400">
              Know what&apos;s the sentiment on the street today
            </p>

            <div className="relative w-full max-w-[400px] mx-auto">
              <div className="flex justify-between text-md font-medium mt-4">
                <span className="text-green-600 dark:text-green-400">Extreme Fear</span>
                <span className="text-yellow-500 dark:text-yellow-400">Fear</span>
                <span className="text-orange-500 dark:text-orange-400">Greed</span>
                <span className="text-red-600 dark:text-red-400">Extreme Greed</span>
              </div>
              
              <svg viewBox="0 20 300 200" className="w-full">
                {/* Background arc */}
                <path d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke="url(#gaugeGradient)" strokeWidth="18" />

                {/* Colored segments */}
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="green" /> {/* Extreme Fear - Green */}
                    <stop offset="10%" stopColor="#22c55e" />
                    <stop offset="20%" stopColor="#eab308" /> {/* Fear - Yellow */}
                    <stop offset="30%" stopColor="#eab308" />
                    <stop offset="40%" stopColor="#eab308" />
                    <stop offset="50%" stopColor="#f97316" /> {/* Greed - Orange */}
                    <stop offset="60%" stopColor="#f97316" />
                    <stop offset="75%" stopColor="#f97316" />
                    <stop offset="85%" stopColor="#dc2626" /> {/* Extreme Greed - Red */}
                    <stop offset="90%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>

                {/* Outer Gray circles */}
                <circle
                  cx="150"
                  cy="170"
                  r="130"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  strokeDasharray={`${Math.PI * 130}`}
                  strokeDashoffset={`${(Math.PI * 260) / 2}`}
                  className="dark:stroke-gray-600"
                />

                {/* Inner Gray circles */}
                <circle
                  cx="150"
                  cy="170"
                  r="110"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  strokeDasharray={`${Math.PI * 110}`}
                  strokeDashoffset={`${(Math.PI * 220) / 2}`}
                  className="dark:stroke-gray-600"
                />

                <g
                  transform={`translate(150, 170) rotate(${calculateRotation(marketMood)})`}
                  className="transition-transform duration-1000"
                >
                  <line
                    x1="0"
                    y1="5"
                    x2="0"
                    y2="-95"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="origin-bottom dark:stroke-white"
                  />
                  <circle r="8" fill="currentColor" className="dark:fill-white" />
                </g>

                <text x="150" y="170" textAnchor="middle" className="text-5xl font-bold fill-current dark:fill-white">
                  {marketMood.toFixed(2)}
                </text>
              </svg>
            </div>

            {/* Modd explanation */}
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
        )}
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





// marketmood ui



// "use client"

// import { useEffect, useState } from "react"
// import { useStockContext } from "@/contexts/StockContext"
// import type { Stock } from "@/types/Stock"
// import { Treemap, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
// import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
// import { StockModal } from "@/components/StockModal"
// import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
// import { CardContent } from "@mui/material"
// import { CustomTreemapContent } from "@/components/CustomTreemapContent"
// import CustomizedProgressBars from "@/components/CustomizedProgressBars"

// type FilterOption =
//   | "Nifty FnO"
//   | "Nifty 50"
//   | "Nifty Auto"
//   | "Nifty Bank"
//   | "Nifty Energy"
//   | "Nifty Financial Services"
//   | "Nifty FMCG"
//   | "Nifty IT"
//   | "Nifty Metal"
//   | "Nifty Pharma"

// const filterOptions: FilterOption[] = [
//   "Nifty FnO",
//   "Nifty 50",
//   "Nifty Auto",
//   "Nifty Bank",
//   "Nifty Energy",
//   "Nifty Financial Services",
//   "Nifty FMCG",
//   "Nifty IT",
//   "Nifty Metal",
//   "Nifty Pharma",
// ]

// type SortOption = "changepct" | "marketcap" | "volumespike" | "pe" | "volume"

// const sortOptions: SortOption[] = ["changepct", "marketcap", "volumespike", "pe", "volume"]

// const sortOptionLabels = {
//   pe: "PE",
//   changepct: "Change %",
//   marketcap: "Market Cap",
//   volumespike: "1M Volume",
//   volume: "1D Volume",
// }

// const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload
//     return (
//       <div className="custom-tooltip bg-white dark:bg-[#151719] p-2 border border-gray-200 rounded shadow">
//         <p className="font-semibold">{data.companyname}</p>
//         <p>Price: ₹{Number(data.price).toFixed(2)}</p>
//         <p>
//           {sortOptionLabels[data.selectedSort as SortOption]}: {Number(data[data.selectedSort]).toFixed(2)}
//           {data.selectedSort === "changepct" ? "%" : ""}
//         </p>
//       </div>
//     )
//   }
//   return null
// }

// export default function Heatmap() {
//   const { stocks } = useStockContext()
//   const [heatmapData, setHeatmapData] = useState<Stock[]>([])
//   const [selectedIndex, setSelectedIndex] = useState<FilterOption>("Nifty 50")
//   const [selectedSort, setSelectedSort] = useState<SortOption>("changepct")
//   const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   useEffect(() => {
//     let filtered = stocks.filter((stock) => stock.type === "EQ")

//     if (selectedIndex === "Nifty 50") {
//       filtered = filtered.filter((stock) => stock.indices && stock.indices["Nifty 50"])
//     } else {
//       filtered = filtered.filter((stock) => stock.indices && stock.indices[selectedIndex as keyof typeof stock.indices])
//     }

//     if (filtered.length > 0) {
//       const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct)
//       setHeatmapData(sortedStocks)
//     }
//   }, [stocks, selectedIndex])

//   const getColor = (value: number, maxChange = 3) => {
//     const clampedChange = Math.max(-maxChange, Math.min(value, maxChange))
//     const normalizedChange = clampedChange / maxChange

//     const green = [34, 197, 94] // Emerald Green
//     const yellow = [253, 224, 71] // Canary Yellow
//     const red = [239, 68, 68] // Crimson Red

//     let startColor, endColor, t

//     if (normalizedChange > 0) {
//       startColor = yellow
//       endColor = green
//       t = Math.sqrt(normalizedChange)
//     } else {
//       startColor = yellow
//       endColor = red
//       t = Math.sqrt(Math.abs(normalizedChange))
//     }

//     const interpolatedColor = startColor.map((start, i) => Math.round(start + (endColor[i] - start) * t))

//     return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`
//   }

//   const handleStockClick = (stock: Stock) => {
//     setSelectedStock(stock)
//     setIsModalOpen(true)
//   }

//   const formattedData = heatmapData.map((stock) => ({
//     name: stock.symbol,
//     value: Math.abs(stock[selectedSort] || 0),
//     changepct: stock.changepct,
//     price: stock.price,
//     [selectedSort]: stock[selectedSort],
//     color: getColor(stock.changepct),
//     image: `/images/${stock.symbol}.svg`,
//     companyname: stock.companyname,
//     selectedSort: selectedSort,
//   }))

//   if (stocks.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-[700px]">
//         <CustomizedProgressBars />
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto bg-white dark:bg-[#151719] mt-0 ">
      
//       <div className="flex gap-2 py-4">
//         <div className="relative">
//           <Select value={selectedIndex} onValueChange={(value) => setSelectedIndex(value as FilterOption)}>
//             <SelectTrigger className=" bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-700 dark:text-gray-300">{selectedIndex.replace("_", " ")}</span>
//               </div>
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-gray-800">
//               {filterOptions.map((option) => (
//                 <SelectItem key={option} value={option} className="text-gray-700 dark:text-gray-300">
//                   {option.replace("_", " ")}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="relative">
//           <Select value={selectedSort} onValueChange={(value) => setSelectedSort(value as SortOption)}>
//             <SelectTrigger className=" bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-700 dark:text-gray-300">{sortOptionLabels[selectedSort]}</span>
//               </div>
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-gray-800">
//               {sortOptions.map((option) => (
//                 <SelectItem key={option} value={option} className="text-gray-700 dark:text-gray-300">
//                   {sortOptionLabels[option]}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//         <CardContent>
//             <ResponsiveContainer width="100%" height={700}>
//                 <Treemap
//                     data={formattedData}
//                     dataKey="value"
//                     isAnimationActive={true}
//                     animationDuration={300}
//                     animationEasing="ease-out"
//                     content={
//                         <CustomTreemapContent
//                         x={0}
//                         y={0}
//                         width={0}
//                         height={0}
//                         name=""
//                         color=""
//                         image=""
//                         changepct={0}
//                         price={0}
//                         onClick={(name) => {
//                             const stock = heatmapData.find((s) => s.symbol === name)
//                             if (stock) handleStockClick(stock)
//                         }}
//                         />
//                     }
//                     >
//                     <Tooltip content={<CustomTooltip />} />
//                 </Treemap>
//             </ResponsiveContainer>
//         </CardContent>

//       <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   )
// }

