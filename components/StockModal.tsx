"use client"
import { X, BarChart2, ExternalLink } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Stock } from "@/lib/utils/fetchStocks"

interface StockModalProps {
  stock: Stock | null
  isOpen: boolean
  onClose: () => void
}

export default function StockModal({ stock, isOpen, onClose }: StockModalProps) {
  if (!stock) return null

  const changeValue = Number.parseFloat(stock.changepct)
  const isPositive = changeValue >= 0

  // Format market cap in Cr or appropriate unit
  const formatMarketCap = (value: string | number) => {
    const numValue = Number(value)
    if (numValue >= 10000000000) {
      return `₹${(numValue / 10000000000).toFixed(2)} Cr`
    } else if (numValue >= 10000000) {
      return `₹${(numValue / 10000000).toFixed(2)} Cr`
    } else if (numValue >= 100000) {
      return `₹${(numValue / 100000).toFixed(2)} L`
    } else {
      return `₹${numValue.toLocaleString()}`
    }
  }

  // Get day range
  const dayLow = Number(stock.low ?? stock.price) // Fallback if not available
  const dayHigh = Number(stock.high ?? stock.price) // Fallback if not available

  // Get 52 week range
  const yearLow = Number(stock.lowYear ?? (Number(stock.price) * 0.75)) // Fallback if not available
  const yearHigh = Number(stock.highYear ?? (Number(stock.price) * 1.5)) // Fallback if not available

  // Format PE ratio
  const peRatio = Number(stock.pe || 0).toFixed(2)

  // Generate about text
  const aboutText = `${stock.companyname} is a ${stock.sector || "company"} 
    listed on NSE, operating in the ${stock.industry || stock.sector || "financial"} sector.`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 bg-black border-gray-800 text-white overflow-hidden mx-2 sm:mx-0">
        {/* Accessible DialogTitle for screen readers, visually hidden */}
        <span className="sr-only" id="stock-modal-title">{stock.companyname} Details</span>
        {/* The aria-labelledby attribute will be set by DialogContent automatically if DialogTitle is present, but we use sr-only for visual hiding */}
        {/* Main content */} 
        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* Stock name */}
          <h2 className="text-xl font-bold mb-2">{stock.companyname}</h2>

          {/* Industry/Sector */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            {/* <span className="inline-block w-4 h-4 bg-blue-500 rounded-sm"></span> */}
            <span>📈 {stock.symbol || "Symbol"} operates in the {stock.sector || "Conglomerates"} sector.</span>
          </div>

          {/* Price and change */}
          <div className="mb-6">
            <div className="text-3xl font-bold">₹{Number(stock.price).toFixed(2)}</div>
            <div className={`text-lg ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? "+" : ""}
              {changeValue.toFixed(2)}%
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <div className="text-sm text-gray-400">Day Range</div>
              <div className="font-medium">
                ₹{dayLow.toFixed(2)} - ₹{dayHigh.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">52W Range</div>
              <div className="font-medium">
                ₹{yearLow.toFixed(2)} - ₹{yearHigh.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Market Cap</div>
              <div className="font-medium">{formatMarketCap(stock.marketcap || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">P/E Ratio</div>
              <div className="font-medium">{peRatio}</div>
            </div>
          </div>

          {/* About section */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-1">About</div>
            <p className="text-sm">{aboutText}</p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://in.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              <span>View Chart</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Detail</span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
