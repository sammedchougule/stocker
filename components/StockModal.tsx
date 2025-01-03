// 'use client'

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/buttons"
// import { ArrowUpIcon, ArrowDownIcon, SquareArrowOutUpRight, Scan } from 'lucide-react'
// import Link from 'next/link'
// import { Stock } from '@/types/Stock'

// interface StockModalProps {
//   stock: Stock | null
//   isOpen: boolean
//   onClose: () => void
// }

// export function StockModal({ stock, isOpen, onClose }: StockModalProps) {
//   if (!stock) return null

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="bg-white/80 backdrop-blur-md border border-gray-200 max-w-md rounded-lg shadow-lg w-[calc(100%-32px)] sm:w-full mx-auto">
//       <DialogHeader className="flex flex-col">
//         <div className="flex justify-between items-start w-full">
//           <DialogTitle className="text-lg font-semibold">{stock.companyname}</DialogTitle>
//         </div>
//         <div className="flex items-center justify-between mt-2 border-b">
//           {/* Left Section */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-700">{stock.symbol}</span>
//             <span className="text-xs px-2 py-0.5 bg-gray-200/50 rounded-md">{stock.type}</span>
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-2">
//             <Link
//               href={`https://in.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <Button size="icon" className="h-10 w-10 hover:border-gray-300 group">
//                 <Scan className="h-6 w-6 text-gray-700 hover:text-blue-600" />
//               </Button>
//             </Link>
//             <Link href={`/StockDetail/${stock.symbol}`}>
//               <Button size="icon" className="h-10 w-10 bg-white/50 hover:bg-white/70 group">
//                 <SquareArrowOutUpRight className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </DialogHeader>

//         <div>
//           <div className="space-y-2">
//             {/* Price and Change */}
//             <div className="flex items-baseline gap-3">
//               <span className="text-2xl font-bold">₹{stock.price}</span>
//               <div className={`flex items-center ${stock.changepct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                 {stock.changepct >= 0 ? (
//                   <ArrowUpIcon className="h-4 w-4 mr-1" />
//                 ) : (
//                   <ArrowDownIcon className="h-4 w-4 mr-1" />
//                 )}
//                 <span>{stock.changepct}%</span>
//               </div>
//             </div>

//             {/* Key Stats */}
//             <div className="grid grid-cols-2 gap-4 py-2  border-b">
//               <div>
//                 <p className="text-sm">Day Range</p>
//                 <p className="text-sm">₹{stock.low} - ₹{stock.high}</p>
//               </div>
//               <div>
//                 <p className="text-sm">52W Range</p>
//                 <p className="text-sm">₹{stock.low52} - ₹{stock.high52}</p>
//               </div>
//               <div>
//                 <p className="text-sm">Market Cap</p>
//                 <p className="text-sm">₹{stock.marketcap ? `${stock.marketcap} Cr` : 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm">P/E Ratio</p>
//                 <p className="text-sm">{stock.pe !== null ? stock.pe : 'N/A'}</p>
//               </div>
//             </div>

//             {/* Company Info */}
//             <div>
//               <p className="text-sm mb-1">About</p>
//               <p className="text-sm">
//                 {stock.companyname} is a {stock.industry || 'N/A'} company listed on {stock.exchange}, operating in the {stock.sector || 'N/A'} sector.
//               </p>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }



'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/buttons"
import { ArrowUpIcon, ArrowDownIcon, SquareArrowOutUpRight, Scan } from 'lucide-react'
import { Stock } from '@/types/Stock'

interface StockModalProps {
  stock: Stock | null
  isOpen: boolean
  onClose: () => void
}

export function StockModal({ stock, isOpen, onClose }: StockModalProps) {
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)

  const handleChartModalOpen = () => {
    setIsChartModalOpen(true)
  }

  const handleChartModalClose = () => {
    setIsChartModalOpen(false)
  }

  if (!stock) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/80 backdrop-blur-md border border-gray-200 max-w-md rounded-lg shadow-lg w-[calc(100%-32px)] sm:w-full mx-auto">
        <DialogHeader className="flex flex-col">
          <div className="flex justify-between items-start w-full">
            <DialogTitle className="text-lg font-semibold">{stock.companyname}</DialogTitle>
          </div>
          <div className="flex items-center justify-between mt-2 border-b">
            {/* Left Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{stock.symbol}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-200/50 rounded-md">{stock.type}</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Open Chart in Modal Button */}
              <Button
                size="icon"
                className="h-10 w-10 hover:border-gray-300 group"
                onClick={handleChartModalOpen}
              >
                <Scan className="h-6 w-6 text-gray-700 hover:text-blue-600" />
              </Button>
              <Button size="icon" className="h-10 w-10 bg-white/50 hover:bg-white/70 group">
                <SquareArrowOutUpRight className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Stock Information */}
        <div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">₹{stock.price}</span>
              <div className={`flex items-center ${stock.changepct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changepct >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{stock.changepct}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b">
              <div>
                <p className="text-sm">Day Range</p>
                <p className="text-sm">₹{stock.low} - ₹{stock.high}</p>
              </div>
              <div>
                <p className="text-sm">52W Range</p>
                <p className="text-sm">₹{stock.low52} - ₹{stock.high52}</p>
              </div>
              <div>
                <p className="text-sm">Market Cap</p>
                <p className="text-sm">₹{stock.marketcap ? `${stock.marketcap} Cr` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm">P/E Ratio</p>
                <p className="text-sm">{stock.pe !== null ? stock.pe : 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm mb-1">About</p>
              <p className="text-sm">
                {stock.companyname} is a {stock.industry || 'N/A'} company listed on {stock.exchange}, operating in the {stock.sector || 'N/A'} sector.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* TradingView Chart Modal */}
      {isChartModalOpen && (
        <Dialog open={isChartModalOpen} onOpenChange={handleChartModalClose}>
          <DialogContent className="bg-white/80 backdrop-blur-md border border-gray-200 max-w-4xl w-[calc(100%-32px)] sm:w-full mx-auto">
            <iframe
              src={`https://www.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
              title="TradingView Chart"
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: 0 }}
            />
            <Button
              onClick={handleChartModalClose}
              className="mt-4 text-sm text-blue-500 hover:text-blue-700"
            >
              Close Chart
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
