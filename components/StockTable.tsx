"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Flame } from "lucide-react"
import type { Stock } from "@/lib/utils/fetchStocks"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getSymbolColor } from "@/lib/utils/getSymbolColor"
import StockModal from "./StockModal"

interface StockTableProps {
  stocks: Stock[]
  viewMode?: "change" | "spike" | "highLow"
}

export default function StockTable({ stocks, viewMode = "change" }: StockTableProps) {

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }
  return (
    <>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-foreground font-bold sticky left-0 z-20 bg-muted">Symbol ↑</TableHead>
            <TableHead className="text-foreground font-bold">Company Name ↕</TableHead>
            <TableHead className="text-foreground font-bold text-right">Previous Close ↕</TableHead>
            <TableHead className="text-foreground font-bold text-right">Price ↕</TableHead>
            <TableHead className="text-foreground font-bold text-right">Change ↕</TableHead>
            <TableHead className="text-foreground font-bold text-right">Change % ↕</TableHead>
            <TableHead className="text-foreground font-bold text-right">Volume Spike ↕</TableHead>
            <TableHead className="text-foreground font-bold text-right">High-Low Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const changeValue = Number.parseFloat(stock.change)
            const changePctValue = Number.parseFloat(stock.changepct)
            const volumeSpikeValue = Number.parseFloat(stock.volumespike)
            const isPositive = changeValue >= 0
            const hasPositiveSpike = !isNaN(volumeSpikeValue) && volumeSpikeValue > 0

            const getHighLowInfo = () => {
              const { todayHLCross, monthHLCross, yearHLCross } = stock

              // Check for high values first (prioritize yearly > monthly > daily)
              if (yearHLCross === "52W High") {
                return { text: "52W High", isHigh: true }
              }
              if (monthHLCross === "Month High") {
                return { text: "Month High", isHigh: true }
              }
              if (todayHLCross === "Today High") {
                return { text: "Today High", isHigh: true }
              }

              // Then check for low values
              if (yearHLCross === "52W Low") {
                return { text: "52W Low", isHigh: false }
              }
              if (monthHLCross === "Month Low") {
                return { text: "Month Low", isHigh: false }
              }
              if (todayHLCross === "Today Low") {
                return { text: "Today Low", isHigh: false }
              }

              // Default case (shouldn't happen due to filtering)
              return { text: "No Data", isHigh: null }
            }

            return (
              <TableRow key={stock.symbol} 
                className="hover:bg-muted/50 border-b border-border cursor-pointer"
                onClick={() => handleRowClick(stock)}
              >
                <TableCell className="sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                  <span
                    className="inline-block w-24 text-center text-xs font-bold text-white px-3 py-1 rounded-md"
                    style={{ backgroundColor: getSymbolColor(stock.symbol) }}
                  >
                    {stock.symbol}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{stock.companyname}</TableCell>
                <TableCell className="text-right">₹{Number.parseFloat(stock.closeyest).toFixed(2)}</TableCell>
                <TableCell className="text-right">₹{Number.parseFloat(stock.price).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md font-semibold ${
                        isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {Math.abs(changeValue).toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md font-semibold ${
                        isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {Math.abs(changePctValue).toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {hasPositiveSpike ? (
                    <div className="flex justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="inline-flex items-center px-3 py-1 rounded-md font-semibold bg-orange-900/30 text-orange-400">
                              <Flame className="h-3 w-3 mr-1" />
                              {volumeSpikeValue.toFixed(2)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>High volume activity</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {viewMode === "highLow" ? (
                    (() => {
                      const { text, isHigh } = getHighLowInfo()
                      return (
                        <div className="flex justify-end">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-md font-semibold ${
                              isHigh === true
                                ? "bg-green-900/30 text-green-400"
                                : isHigh === false
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {isHigh === true ? (
                              <ArrowUp className="h-3 w-3 mr-1" />
                            ) : isHigh === false ? (
                              <ArrowDown className="h-3 w-3 mr-1" />
                            ) : null}
                            {text}
                          </span>
                        </div>
                      )
                    })()
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
    <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
