'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/buttons"
import { ArrowUpIcon, ArrowDownIcon, SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'
import { Stock } from '@/types/Stock'

interface StockModalProps {
  stock: Stock | null
  isOpen: boolean
  onClose: () => void
}

export function StockModal({ stock, isOpen, onClose }: StockModalProps) {
  if (!stock) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white max-w-md rounded-lg shadow-lg w-[calc(100%-32px)] sm:w-full mx-auto">
        <DialogHeader className="flex flex-col">
          <div className="flex justify-between items-start w-full">
            <DialogTitle className="text-lg font-semibold">{stock.companyname}</DialogTitle>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">{stock.symbol}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full">{stock.exchange}</span>
            </div>
            <Link href={`/stockdetail/${stock.symbol}`}>
              <Button size="icon" variant="outline" className="h-8 w-8 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/70">
                <SquareArrowOutUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </DialogHeader>

        <div>
          <div className="space-y-4">
            {/* Price and Change */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">₹{stock.price.toFixed(2)}</span>
              <div className={`flex items-center ${stock.changepct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changepct >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stock.changepct).toFixed(2)}%</span>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Day Range</p>
                <p className="text-sm">₹{stock.low} - ₹{stock.high}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">52W Range</p>
                <p className="text-sm">₹{stock.low52} - ₹{stock.high52}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Market Cap</p>
                <p className="text-sm">₹{stock.marketcap ? `${(stock.marketcap / 10000000).toFixed(2)} Cr` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">P/E Ratio</p>
                <p className="text-sm">{stock.pe !== null ? stock.pe.toFixed(2) : 'N/A'}</p>
              </div>
            </div>

            {/* Company Info */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">About</p>
              <p className="text-sm">
                {stock.companyname} is a {stock.industry || 'N/A'} company listed on {stock.exchange}, operating in the {stock.sector || 'N/A'} sector.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

