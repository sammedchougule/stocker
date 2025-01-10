'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/buttons"
import { ArrowUpIcon, ArrowDownIcon, SquareArrowOutUpRight, Scan } from 'lucide-react'
import Link from 'next/link'
import { Stock } from '@/types/Stock'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface StockModalProps {
  stock: Stock | null
  isOpen: boolean
  onClose: () => void
}

export function StockModal({ stock, isOpen, onClose }: StockModalProps) {
  if (!stock) return null

  // Get the 5D data
  const getFilteredData = () => {
    const currentDate = new Date()
    const chartData = Object.entries(stock.closings)
      .map(([date, price]) => ({
        date,
        closingPrice: price,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Get the last 5 days data
    return chartData.slice(-5)
  }

  const filteredData = getFilteredData()

  // Only show the chart if there's data
  if (filteredData.length === 0) return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/80 backdrop-blur-md border border-gray-200 max-w-md rounded-lg shadow-lg w-[calc(100%-32px)] sm:w-full mx-auto">
        <DialogHeader className="flex flex-col">
          <div className="flex justify-between items-start w-full">
            <DialogTitle className="text-lg font-semibold">{stock.companyname}</DialogTitle>
          </div>
          <div className="flex items-center justify-between mt-2 border-b">
            {/* Top Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{stock.symbol}</span>
              <span className="text-sm font-medium text-gray-700">
                {stock.symbol.startsWith("NIFTY") ? "is a Index" : `is in ${stock.sector}`}
              </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <Link
                href={`https://in.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="icon" className="h-10 w-10 bg-white/50 hover:bg-white/70 group">
                  <Scan className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
                </Button>
              </Link>

              <Link href={`/StockDetail/${stock.symbol}`}>
                <Button size="icon" className="h-10 w-10 bg-white/50 hover:bg-white/70 group">
                  <SquareArrowOutUpRight className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body with No Chart */}
        <div className="space-y-4 py-4">
          {/* Price and Changes */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">₹{stock.price}</span>
            <div className={`flex items-center ${stock.changepct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stock.changepct >= 0 ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="text-lg">{stock.changepct}%</span>
            </div>
          </div>

          {/* Key Stats */}
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

          {/* Company Info */}
          <div>
            <p className="text-sm mb-1">About</p>
            <p className="text-sm">
              {stock.companyname} is a {stock.industry || 'N/A'} company listed on {stock.exchange}, operating in the {stock.sector || 'N/A'} sector.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Calculate Y-axis domain for chart
  const yAxisDomain = [Math.min(...filteredData.map(item => item.closingPrice)) * 0.9, Math.max(...filteredData.map(item => item.closingPrice)) * 1.1]

  const chartColor = filteredData[filteredData.length - 1].closingPrice >= filteredData[0].closingPrice ? "#22c55e" : "#ef4444" // green-500 : red-500

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/80 backdrop-blur-md border border-gray-200 max-w-md rounded-lg shadow-lg w-[calc(100%-32px)] sm:w-full mx-auto">
        <DialogHeader className="flex flex-col">
          <div className="flex justify-between items-start w-full">
            <DialogTitle className="text-lg font-semibold">{stock.companyname}</DialogTitle>
          </div>
          <div className="flex items-center justify-between border-b">
            {/* Top Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{stock.symbol}</span>
              <span className="text-sm font-medium text-gray-700">
                {stock.symbol.startsWith("NIFTY") ? "is a Index" : `is in ${stock.sector}`}
              </span>
            </div>


            {/* Right Section */}
            <div className="flex items-center gap-2">
              <Link
                href={`https://in.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="icon" className="h-10 w-10 bg-white/50 hover:bg-white/70 group">
                  <Scan className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
                </Button>
              </Link>

              <Link href={`/StockDetail/${stock.symbol}`}>
                <Button size="icon" className="h-10 w-10 bg-white/50 hover:bg-white/70 group">
                  <SquareArrowOutUpRight className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body with Chart */}
        <div className="">
          {/* Price and Changes */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">₹{stock.price}</span>
            <div className={`flex items-center ${stock.changepct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stock.changepct >= 0 ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="text-lg">{stock.changepct}%</span>
            </div>
          </div>

          {/* StockChart Component */}
          <div className="w-full h-[180px] sm:h-[200px] -mt-10 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                {/* X-axis removed */}
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                  hide={true} // Hides the X-axis labels
                />
                {/* Y-axis removed */}
                <YAxis
                  domain={yAxisDomain}
                  hide={true} // Hides the Y-axis labels
                />
                <Tooltip
                  labelFormatter={(date) => {
                    const dateObj = new Date(date)
                    const year = dateObj.getFullYear()
                    const currentYear = new Date().getFullYear()
                    return year !== currentYear
                      ? format(dateObj, "MMM d, yy")
                      : format(dateObj, "MMM d")
                  }}
                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Price"]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={25} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="closingPrice"
                  stroke={chartColor}
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                  isAnimationActive={true} // Enable animation
                  animationDuration={1000} // Animation duration in milliseconds
                  animationEasing="ease-out" // Smooth easing
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key Stats */}
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

          {/* Company Info */}
          <div>
            <p className="text-sm mb-1">About</p>
            <p className="text-sm">
              {stock.companyname} is a {stock.industry || 'N/A'} company listed on {stock.exchange}, operating in the {stock.sector || 'N/A'} sector.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
