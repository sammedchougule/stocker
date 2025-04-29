
"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, SquareArrowOutUpRight, ChartSpline } from "lucide-react"
import Link from "next/link"
import type { Stock } from "@/types/Stock"

interface StockModalProps {
  stock: Stock | null
  isOpen: boolean
  onClose: () => void
}

export function StockModal({ stock, isOpen, onClose }: StockModalProps) {
  if (!stock) return null

  const sectorEmojiMap: Record<string, string> = {
    Materials: "🪨",
    Industrials: "🏭",
    Healthcare: "🩺",
    Financials: "💰",
    "Consumer Discretionary": "🛍️",
    Utilities: "💡",
    Energy: "🔥",
    "Consumer Staples": "🍽️",
    Technology: "💻",
    "Communication Services": "📡",
    "Real Estate": "🏠",
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#151719] text-black dark:text-white max-w-md rounded-xl shadow-xl w-[calc(100%-32px)] sm:w-full mx-auto p-4">
        
        {/* Header */}
        <DialogHeader className="flex flex-col space-y-2 pb-2 border-b dark:border-gray-700">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-lg font-semibold">
              {stock.companyname}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {stock.symbol.startsWith("NIFTY") ? (
              <span>Index</span>
            ) : (
              <>
                <span>{stock.sector ? sectorEmojiMap[stock.sector] || "🏢" : "🏢"}</span>
                <span>{stock.sector}</span>
              </>
            )}
            <span>→</span>
            <span>{stock.industry}</span>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="py-3 space-y-4">
          {/* Price + Change */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">₹{stock.price}</span>
            <div className={`flex items-center text-sm ${stock.changepct >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stock.changepct >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
              <span className="ml-1">{stock.changepct}%</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-2 border-b pb-2 dark:border-gray-700">
            <div>
              <p className="text-gray-500">Day Range</p>
              <p>₹{stock.low} - ₹{stock.high}</p>
            </div>
            <div>
              <p className="text-gray-500">52W Range</p>
              <p>₹{stock.lowYear} - ₹{stock.highYear}</p>
            </div>
            <div>
              <p className="text-gray-500">Market Cap</p>
              <p>₹{stock.marketcap ? `${stock.marketcap} Cr` : "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">P/E Ratio</p>
              <p>{stock.pe ?? "N/A"}</p>
            </div>
          </div>

          {/* About Company */}
          <div>
            <p className="text-sm text-gray-500 mb-1">About</p>
            <p className="text-sm">
              {stock.companyname} is a {stock.industry || "N/A"} company listed on {stock.exchange}, operating in the{" "}
              {stock.sector || "N/A"} sector.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="pt-4 border-t dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Link
              href={`https://in.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-shadow">
                <ChartSpline className="mr-2 h-4 w-4" />
                View Chart
              </Button>
            </Link>

            <Link href={`/stockdetail/${stock.symbol}`}>
              <Button className="w-full bg-gray-800 text-white hover:bg-[#151719] hover:shadow-md transition-shadow">
                <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                View Detail
              </Button>
            </Link>
          </div>
        </DialogFooter>



      </DialogContent>
    </Dialog>


  )
}
