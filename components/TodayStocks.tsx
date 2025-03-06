
// "use client"

// import { useState, useMemo } from "react"
// import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown, Activity, ListFilter, Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { useStockContext } from "@/contexts/StockContext"
// import type { Stock } from "@/types/Stock"
// import "react-loading-skeleton/dist/skeleton.css"
// import Image from "next/image"
// import MarketMood from "./MarketMood"
// import { StockModal } from "@/components/StockModal"
// import { getStockBgColor } from "@/lib/getstockBgColor"

// type FilterType = "gainers" | "losers" | "most-active" | "52w-high" | "52w-low"

// type LargeCapFilter =
//   | "All"
//   | "Nifty Auto"
//   | "Nifty Bank"
//   | "Nifty FMCG"
//   | "Nifty Healthcare"
//   | "Nifty IT"
//   | "Nifty Media"
//   | "Nifty Metal"
//   | "Nifty Pharma"
//   | "Nifty PVT Bank"
//   | "Nifty PSU Bank"
//   | "Nifty Realty"

// const largeCapFilters: LargeCapFilter[] = [
//   "All",
//   "Nifty Auto",
//   "Nifty Bank",
//   "Nifty FMCG",
//   "Nifty Healthcare",
//   "Nifty IT",
//   "Nifty Media",
//   "Nifty Metal",
//   "Nifty Pharma",
//   "Nifty PVT Bank",
//   "Nifty PSU Bank",
//   "Nifty Realty",
// ]

// const TodaysStocks = () => {
//   const [activeFilter, setActiveFilter] = useState<FilterType>("gainers")
//   const [largeCapFilterIndex, setLargeCapFilterIndex] = useState(0)
//   const { stocks, loading, error } = useStockContext()
//   const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const largeCapFilter = largeCapFilters[largeCapFilterIndex]

//   const filteredStocks = useMemo(() => {
//     if (!stocks) return []

//     let filtered = stocks.filter((stock) => stock.type === "EQ")

//     if (largeCapFilter !== "All") {
//       filtered = stocks.filter((stock) => stock.indices && stock.indices[largeCapFilter])
//     }

//     const sorted = [...filtered] // let
//     switch (activeFilter) {
//       case "gainers":
//         return sorted.sort((a, b) => b.changepct - a.changepct).slice(0, 5)
//       case "losers":
//         return sorted.sort((a, b) => a.changepct - b.changepct).slice(0, 5)
//       case "most-active":
//         return sorted.sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5)
//       case "52w-high":
//         return sorted.filter((stock) => stock.price >= stock.high52).slice(0, 5)
//       case "52w-low":
//         return sorted.filter((stock) => stock.price <= stock.low52).slice(0, 5)
//       default:
//         return sorted.slice(0, 5)
//     }
//   }, [stocks, activeFilter, largeCapFilter])

//   const cycleLargeCapFilter = () => {
//     setLargeCapFilterIndex((prevIndex) => (prevIndex + 1) % largeCapFilters.length)
//   }

//   const renderSkeleton = () => (
//     <div className="space-y-4">
//       {Array(5)
//         .fill(null)
//         .map((_, idx) => (
//           <div key={idx} className="grid grid-cols-12 gap-4 items-center px-2 py-3">
//             <div className="hidden sm:flex col-span-1 sm:col-span-1">
//               <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
//             </div>
//             <div className="col-span-5 sm:col-span-4 flex flex-col">
//               <div className="w-28 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//               <div className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
//             </div>
//             <div className="col-span-3 sm:col-span-3 text-right">
//               <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//             </div>
//             <div className="col-span-3 sm:col-span-4 flex justify-end items-center gap-2">
//               <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
//               <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         ))}
//     </div>
//   )

//   // Modal Function
//   const handleStockClick = (stock: Stock) => {
//     setSelectedStock(stock)
//     setIsModalOpen(true)
//   }

//   if (error) {
//     return <div className="text-red-500 dark:text-red-400">Error: {error}</div>
//   }

//   return (
//     <div className="container mx-auto flex flex-col lg:flex-row gap-4">
//       {/* Today's Stocks Section - 60% width on large screens */}
//       <div className="w-full lg:w-4/6 flex flex-col">
//         <Card className="bg-white dark:bg-[#151719]  overflow-hidden">
//           <CardHeader className="pb-4 px-2 sm:px-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold dark:text-white">Today&apos;s Stocks</h2>
//               <button
//                 onClick={cycleLargeCapFilter}
//                 className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 bg-transparent border-none cursor-pointer"
//               >
//                 {largeCapFilter}
//                 <ListFilter className="h-4 w-4" />
//               </button>
//             </div>
//             <div className="flex overflow-x-auto gap-2 mt-4">
//               <Button variant={activeFilter === "gainers" ? "default" : "outline"} onClick={() => setActiveFilter("gainers")}>
//                 <ArrowUpIcon className="h-4 w-4" />
//                 Gainers
//               </Button>
              
//               <Button variant={activeFilter === "losers" ? "default" : "outline"} onClick={() => setActiveFilter("losers")}>
//                 <ArrowDownIcon className="h-4 w-4" />
//                 Losers
//               </Button>
              
//               <Button variant={activeFilter === "most-active" ? "default" : "outline"} onClick={() => setActiveFilter("most-active")}>
//                 <Activity className="h-4 w-4" />
//                 Most Active
//               </Button>
              
//               <Button variant={activeFilter === "52w-high" ? "default" : "outline"} onClick={() => setActiveFilter("52w-high")}>
//                 <TrendingUp className="h-4 w-4" />
//                 52W High
//               </Button>
              
//               <Button variant={activeFilter === "52w-low" ? "default" : "outline"} onClick={() => setActiveFilter("52w-low")}>
//                 <TrendingDown className="h-4 w-4" />
//                 52W Low
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent className="px-2 sm:px-6">
//             <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-0">
//               {/* Adjusted heading alignment and col span */}
//               <div className="col-span-4 sm:col-span-4  text-left ">STOCKS</div>
//               <div className="col-span-4 sm:col-span-4 text-right">PRICE</div>
//               <div className="col-span-4 sm:col-span-4 text-right pr-2">CHANGE</div>
//             </div>
//             {loading ? (
//               renderSkeleton()
//             ) : (
//               <div className="divide-y dark:divide-gray-700">
//                 {filteredStocks.map((stock) => (
//                   <div
//                     key={stock.symbol}
//                     className="grid grid-cols-12 gap-4 items-center py-3 px-2 sm:px-4 hover:bg-gray-100 dark:hover:bg-gray-800 border rounded-md cursor-pointer"
//                     onClick={() => handleStockClick(stock)}
//                   >
//                     {/* Adjusted Stock Info  col span */}
//                     <div className="hidden sm:flex col-span-1 sm:col-span-1 items-center justify-center">
//                       <Image
//                         className="rounded-full"
//                         width={30}
//                         height={30}
//                         src={`/images/${stock.symbol}.svg`}
//                         alt={stock.companyname}
//                       />
//                     </div>
//                     <div className="col-span-3 sm:col-span-3 ">
//                       <div
//                         className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
//                         style={{ backgroundColor: getStockBgColor(stock.symbol), width: "6rem" }}
//                       >
//                         <span
//                           className="whitespace-nowrap text-[12px] leading-none text-center block overflow-hidden text-ellipsis"
//                           style={{
//                             paddingLeft: "2px",
//                             paddingRight: "2px",
//                             maxWidth: "100%",
//                             fontSize: stock.symbol.length > 10 ? "10px" : "12px",
//                           }}
//                         >
//                           {stock.symbol}
//                         </span>
//                       </div>
//                       <div className="text-sm mt-1 text-gray-700 dark:text-gray-300 truncate">
//                         {stock.companyname}
//                       </div>
//                     </div>
                    
//                     <div className="col-span-4 sm:col-span-4 text-right">
//                       <span className="font-medium text-md dark:text-white">₹{Number(stock.price).toFixed(2)}</span>
//                     </div>
//                     <div className="col-span-4 sm:col-span-4 flex items-center justify-end gap-2">
//                       <span
//                         className={`inline-flex items-center rounded p-1 ${
//                           stock.changepct >= 0
//                             ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900 rounded-lg"
//                             : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900 rounded-lg"
//                         }`}
//                       >
//                         {stock.changepct >= 0 ? (
//                           <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5" />
//                         ) : (
//                           <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5" />
//                         )}
//                         <span className="font-medium text-sm">{Number(stock.changepct).toFixed(2)}%</span>
//                       </span>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
                  
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Market Mood Index Section - 40% width on large screens */}
//       <div className="w-full lg:w-2/6">
//         <MarketMood stocks={stocks} loading={loading} />
//       </div>

//       <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   )
// }

// export default TodaysStocks



"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown, Activity, ListFilter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Stock } from "@/types/Stock"
import Image from "next/image"
import MarketMood from "./MarketMood"
import { StockModal } from "@/components/StockModal"
import { getStockBgColor } from "@/lib/getstockBgColor"

type FilterType = "gainers" | "losers" | "most-active" | "52w-high" | "52w-low"

type LargeCapFilter =
  | "All"
  | "Nifty Auto"
  | "Nifty Bank"
  | "Nifty FMCG"
  | "Nifty Healthcare"
  | "Nifty IT"
  | "Nifty Media"
  | "Nifty Metal"
  | "Nifty Pharma"
  | "Nifty PVT Bank"
  | "Nifty PSU Bank"
  | "Nifty Realty"

const largeCapFilters: LargeCapFilter[] = [
  "All",
  "Nifty Auto",
  "Nifty Bank",
  "Nifty FMCG",
  "Nifty Healthcare",
  "Nifty IT",
  "Nifty Media",
  "Nifty Metal",
  "Nifty Pharma",
  "Nifty PVT Bank",
  "Nifty PSU Bank",
  "Nifty Realty",
]

interface TodaysStocksProps {
  stocks: Stock[]
}

const TodaysStocks: React.FC<TodaysStocksProps> = ({ stocks }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("gainers")
  const [largeCapFilterIndex, setLargeCapFilterIndex] = useState(0)
  const [stocksState, setStocksState] = useState<Stock[]>(stocks)
  const [loading, setLoading] = useState(false)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const largeCapFilter = largeCapFilters[largeCapFilterIndex]

  const filteredStocks = useMemo(() => {
    let filtered = stocksState.filter((stock) => stock.type === "EQ")

    if (largeCapFilter !== "All") {
      filtered = stocksState.filter((stock) => stock.indices && stock.indices[largeCapFilter])
    }

    const sorted = [...filtered]
    switch (activeFilter) {
      case "gainers":
        return sorted.sort((a, b) => b.changepct - a.changepct).slice(0, 5)
      case "losers":
        return sorted.sort((a, b) => a.changepct - b.changepct).slice(0, 5)
      case "most-active":
        return sorted.sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5)
      case "52w-high":
        return sorted.filter((stock) => stock.price >= stock.high52).slice(0, 5)
      case "52w-low":
        return sorted.filter((stock) => stock.price <= stock.low52).slice(0, 5)
      default:
        return sorted.slice(0, 5)
    }
  }, [stocksState, activeFilter, largeCapFilter])

  const cycleLargeCapFilter = () => {
    setLargeCapFilterIndex((prevIndex) => (prevIndex + 1) % largeCapFilters.length)
  }

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array(5)
        .fill(null)
        .map((_, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-4 items-center px-2 py-3">
            <div className="col-span-1 sm:col-span-1">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="col-span-5 sm:col-span-4 flex flex-col">
              <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse"></div>
            </div>
            <div className="col-span-3 sm:col-span-3 text-right">
              <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded ml-auto animate-pulse"></div>
            </div>
            <div className="col-span-3 sm:col-span-4 flex justify-end items-center gap-2">
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
    </div>
  )

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-4/6 flex flex-col">
        <Card className="bg-white dark:bg-[#151719] overflow-hidden">
          <CardHeader className="pb-4 px-2 sm:px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold dark:text-white">Today&apos;s Stocks</h2>
              <button
                onClick={cycleLargeCapFilter}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 bg-transparent border-none cursor-pointer"
              >
                {largeCapFilter}
                <ListFilter className="h-4 w-4" />
              </button>
            </div>
            <div className="flex overflow-x-auto gap-2 mt-4">
              <Button
                variant={activeFilter === "gainers" ? "default" : "outline"}
                onClick={() => setActiveFilter("gainers")}
              >
                <ArrowUpIcon className="h-4 w-4" />
                Gainers
              </Button>
              <Button
                variant={activeFilter === "losers" ? "default" : "outline"}
                onClick={() => setActiveFilter("losers")}
              >
                <ArrowDownIcon className="h-4 w-4" />
                Losers
              </Button>
              <Button
                variant={activeFilter === "most-active" ? "default" : "outline"}
                onClick={() => setActiveFilter("most-active")}
              >
                <Activity className="h-4 w-4" />
                Most Active
              </Button>
              <Button
                variant={activeFilter === "52w-high" ? "default" : "outline"}
                onClick={() => setActiveFilter("52w-high")}
              >
                <TrendingUp className="h-4 w-4" />
                52W High
              </Button>
              <Button
                variant={activeFilter === "52w-low" ? "default" : "outline"}
                onClick={() => setActiveFilter("52w-low")}
              >
                <TrendingDown className="h-4 w-4" />
                52W Low
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-2 sm:px-6">
            <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-0">
              <div className="col-span-4 sm:col-span-4 text-left">STOCKS</div>
              <div className="col-span-4 sm:col-span-4 text-right">PRICE</div>
              <div className="col-span-4 sm:col-span-4 text-right pr-2">CHANGE</div>
            </div>
            {loading ? (
              renderSkeleton()
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="grid grid-cols-12 gap-4 items-center py-3 px-2 sm:px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                    onClick={() => handleStockClick(stock)}
                  >
                    <div className="hidden sm:flex col-span-1 sm:col-span-1 items-center justify-center">
                      <Image
                        className="rounded-full"
                        width={30}
                        height={30}
                        src={`/images/${stock.symbol}.svg`}
                        alt={stock.companyname}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                      <div
                        className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
                        style={{ backgroundColor: getStockBgColor(stock.symbol), width: "6rem" }}
                      >
                        <span
                          className="whitespace-nowrap text-[12px] leading-none text-center block overflow-hidden text-ellipsis"
                          style={{
                            paddingLeft: "2px",
                            paddingRight: "2px",
                            maxWidth: "100%",
                            fontSize: stock.symbol.length > 10 ? "10px" : "12px",
                          }}
                        >
                          {stock.symbol}
                        </span>
                      </div>
                      <div className="text-sm mt-1 text-gray-700 dark:text-gray-300 truncate">{stock.companyname}</div>
                    </div>
                    <div className="col-span-4 sm:col-span-4 text-right">
                      <span className="font-medium text-md dark:text-white">₹{Number(stock.price).toFixed(2)}</span>
                    </div>
                    <div className="col-span-4 sm:col-span-4 flex items-center justify-end gap-2">
                      <span
                        className={`inline-flex items-center rounded p-1 ${
                          stock.changepct >= 0
                            ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900 rounded-lg"
                            : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900 rounded-lg"
                        }`}
                      >
                        {stock.changepct >= 0 ? (
                          <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5" />
                        ) : (
                          <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5" />
                        )}
                        <span className="font-medium text-sm">{Number(stock.changepct).toFixed(2)}%</span>
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-2/6">
        <MarketMood stocks={stocksState} loading={loading} />
      </div>

      <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default TodaysStocks

