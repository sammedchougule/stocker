
// "use client"

// import type React from "react"

// import { useEffect, useState, useCallback } from "react"
// import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
// import { useSwipeable } from "react-swipeable"
// import "react-loading-skeleton/dist/skeleton.css"
// import Image from "next/image"
// import { Card, CardHeader, CardContent } from "@/components/ui/card"
// import { useStockContext } from "@/contexts/StockContext"
// import type { Stock } from "@/types/Stock"
// import { StockModal } from "@/components/StockModal"
// import { getStocks } from "@/lib/getStocks"

// const INDICES = [
//   "NIFTY_50",
//   "NIFTY_AUTO",
//   "NIFTY_BANK",
//   "NIFTY_ENERGY",
//   "NIFTY_FIN_SERVICE",
//   "NIFTY_FMCG",
//   "NIFTY_IT",
//   "NIFTY_MEDIA",
//   "NIFTY_METAL",
//   "NIFTY_PHARMA",
//   "NIFTY_PSU_BANK",
//   "NIFTY_REALTY",
// ]

// const Indices: React.FC = () => {
//   const { stocks, loading } = useStockContext()
//   const [filteredSectors, setFilteredSectors] = useState<Stock[]>([])
//   const [activeCard, setActiveCard] = useState(0)
//   const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   useEffect(() => {
//     if (loading) {
//       setFilteredSectors([]);
//     } else if (stocks.length > 0) {
//       const sectorsData = stocks
//         .filter((stock) => INDICES.includes(stock.symbol))
//         .slice(0, 9);
//       setFilteredSectors(sectorsData);
//     }
//   }, [stocks, loading]);

//   const handlers = useSwipeable({
//     onSwipedLeft: () => setActiveCard((prev) => Math.min(prev + 1, 2)),
//     onSwipedRight: () => setActiveCard((prev) => Math.max(prev - 1, 0)),
//     trackMouse: true,
//   })

//   const handleStockClick = useCallback((stock: Stock) => {
//     setSelectedStock(stock)
//     setIsModalOpen(true)
//   }, [])

//   const renderSkeleton = () => (
//     <div className="grid grid-cols-1 gap-1">
//       {Array(3)
//         .fill(null)
//         .map((_, idx) => (
//           <div key={idx} className="flex justify-between items-start py-4 px-1">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
//               <div className="w-24 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//             </div>
//             <div className="text-right">
//               <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
//               <div className="flex items-center justify-end mt-0.5">
//                 <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ml-2"></div>
//               </div>
//             </div>
//           </div>

//         ))}
//     </div>
//   )

//   const renderCard = (startIndex: number, endIndex: number) => {
//     if (loading || filteredSectors.length === 0) {
//       return renderSkeleton();
//     }
  
//     return (
//       <div className="grid grid-cols-1 gap-8">
//         {filteredSectors.slice(startIndex, endIndex).map((sector) => (
//           <div
//             key={sector.symbol}
//             className="flex justify-between items-start px-1 cursor-pointer"
//             onClick={() => handleStockClick(sector)}
//           >
//             <div className="flex items-center space-x-2">
//               <Image
//                 src={`/images/${sector.symbol}.svg`}
//                 alt={sector.companyname}
//                 width={30}
//                 height={30}
//                 className="rounded-full border border-gray-200"
//               />
//               <span className="text-md font-medium text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
//                 {sector.companyname}
//               </span>
//             </div>
  
//             <div className="text-right">
//               <span className="text-md font-medium text-gray-900 dark:text-gray-100">
//                 {Number(sector.price).toFixed(2)}
//               </span>
//               <div className="flex items-center justify-end mt-0.5">
//                 <span
//                   className={`inline-flex items-center rounded px-1.5 py-1 ${
//                     sector.changepct >= 0
//                       ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50 rounded-lg"
//                       : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50 rounded-lg"
//                   }`}
//                 >
//                   {sector.changepct >= 0 ? (
//                     <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5" />
//                   ) : (
//                     <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5" />
//                   )}
//                   <span className="text-sm font-medium">{Number(sector.changepct).toFixed(2)}%</span>
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto">
//       <Card className="bg-white dark:bg-[#151719] overflow-hidden">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Sectoral Indices</h2>
//             <a href="/sectors" className="text-sm text-blue-500 dark:text-blue-400">
//               See All
//             </a>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Desktop and Tablet View */}
//           <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <div className="pr-4">{loading ? renderSkeleton() : renderCard(0, 3)}</div>
//             <div className="px-4">{loading ? renderSkeleton() : renderCard(3, 6)}</div>
//             <div className="pl-4 sm:col-span-2 md:col-span-1">{loading ? renderSkeleton() : renderCard(6, 9)}</div>
//           </div>

//           {/* Mobile View */}
//           <div className="sm:hidden overflow-hidden" {...handlers}>
//             <div
//               className="flex transition-transform duration-300 ease-in-out"
//               style={{
//                 transform: `translateX(-${activeCard * 100}%)`,
//               }}
//             >
//               <div className="w-full flex-shrink-0 ">{loading ? renderSkeleton() : renderCard(0, 3)}</div>
//               <div className="w-full flex-shrink-0 ">{loading ? renderSkeleton() : renderCard(3, 6)}</div>
//               <div className="w-full flex-shrink-0 ">{loading ? renderSkeleton() : renderCard(6, 9)}</div>
//             </div>
//             <div className="flex justify-center mt-6">
//               <div className="flex space-x-2">
//                 {[0, 1, 2].map((index) => (
//                   <button
//                     key={index}
//                     onClick={() => setActiveCard(index)}
//                     className={`w-2 h-2 rounded-full transition-colors ${
//                       activeCard === index ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   )
// }

// export default Indices




"use client"

import { useMemo, useState, useCallback } from "react"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { useSwipeable } from "react-swipeable"
import Image from "next/image"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import type { Stock } from "@/types/Stock"
import { StockModal } from "@/components/StockModal"

const INDICES = [
  "NIFTY_50",
  "NIFTY_AUTO",
  "NIFTY_BANK",
  "NIFTY_ENERGY",
  "NIFTY_FIN_SERVICE",
  "NIFTY_FMCG",
  "NIFTY_IT",
  "NIFTY_MEDIA",
  "NIFTY_METAL",
  "NIFTY_PHARMA",
  "NIFTY_PSU_BANK",
  "NIFTY_REALTY",
]

interface IndicesProps {
  stocks: Stock[]
}

const Indices: React.FC<IndicesProps> = ({ stocks }) => {
  const [activeCard, setActiveCard] = useState(0)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Memoized filtering logic
  const filteredSectors = useMemo(() => {
    return stocks.filter((stock) => INDICES.includes(stock.symbol)).slice(0, 9)
  }, [stocks])

  // Loading state derived from stocks availability
  const isLoading = stocks.length === 0

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveCard((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setActiveCard((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  })

  const handleStockClick = useCallback((stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }, [])

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 gap-1">
      {Array(3)
        .fill(null)
        .map((_, idx) => (
          <div key={idx} className="flex justify-between items-start py-4 px-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="w-24 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="text-right">
              <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex items-center justify-end mt-0.5">
                <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ml-2"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )

  const renderCard = (startIndex: number, endIndex: number) => {
    if (isLoading) {
      return renderSkeleton()
    }

    return (
      <div className="grid grid-cols-1 gap-8">
        {filteredSectors.slice(startIndex, endIndex).map((sector) => (
          <div
            key={sector.symbol}
            className="flex justify-between items-start px-1 cursor-pointer"
            onClick={() => handleStockClick(sector)}
          >
            <div className="flex items-center space-x-2">
              <Image
                src={`/images/${sector.symbol}.svg`}
                alt={sector.companyname}
                width={30}
                height={30}
                className="rounded-full border border-gray-200"
              />
              <span className="text-md font-medium text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
                {sector.companyname}
              </span>
            </div>

            <div className="text-right">
              <span className="text-md font-medium text-gray-900 dark:text-gray-100">
                {Number(sector.price).toFixed(2)}
              </span>
              <div className="flex items-center justify-end mt-0.5">
                <span
                  className={`inline-flex items-center rounded px-1.5 py-1 ${
                    sector.changepct >= 0
                      ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50 rounded-lg"
                      : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50 rounded-lg"
                  }`}
                >
                  {sector.changepct >= 0 ? (
                    <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  <span className="text-sm font-medium">{Number(sector.changepct).toFixed(2)}%</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <Card className="bg-white dark:bg-[#151719] overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Sectoral Indices</h2>
            <a href="/sectors" className="text-sm text-blue-500 dark:text-blue-400">
              See All
            </a>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop and Tablet View */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="pr-4">{renderCard(0, 3)}</div>
            <div className="px-4">{renderCard(3, 6)}</div>
            <div className="pl-4 sm:col-span-2 md:col-span-1">{renderCard(6, 9)}</div>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden overflow-hidden" {...handlers}>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${activeCard * 100}%)`,
              }}
            >
              <div className="w-full flex-shrink-0">{isLoading ? renderSkeleton() : renderCard(0, 3)}</div>
              <div className="w-full flex-shrink-0">{isLoading ? renderSkeleton() : renderCard(3, 6)}</div>
              <div className="w-full flex-shrink-0">{isLoading ? renderSkeleton() : renderCard(6, 9)}</div>
            </div>
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCard(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      activeCard === index ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Indices
