"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Flame } from "lucide-react"
import type { Stock } from "@/lib/utils/fetchStocks"
import { getSymbolColor } from "@/lib/utils/getSymbolColor"
import StockModal from "./StockModal"

interface StockCardProps {
  stock: Stock
  viewMode: "change" | "spike" | "highLow"
}

export default function StockCard({ stock, viewMode }: StockCardProps) {
   const [isModalOpen, setIsModalOpen] = useState(false)
  const { symbol, companyname, price, change, changepct, volumespike, todayHLCross, monthHLCross, yearHLCross } = stock

  const changeValue = Number.parseFloat(change)
  const changePctValue = Number.parseFloat(changepct)
  const volumeSpikeValue = Number.parseFloat(volumespike)
  const isPositive = changeValue >= 0
  const hasPositiveSpike = !isNaN(volumeSpikeValue) && volumeSpikeValue > 0
  const isHighSpike = hasPositiveSpike && volumeSpikeValue >= 1.0

  const getHighLowInfo = () => {
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
    <>
    <Card className="p-4 hover:shadow-md transition-all duration-200 transform hover:scale-105 bg-card cursor-pointer"
     onClick={() => setIsModalOpen(true)}
    >
      <div className="mb-2">
        <span
          className="inline-block w-26 text-center text-xs font-bold text-white px-3 py-1 rounded-md"
          style={{ backgroundColor: getSymbolColor(symbol) }}
        >
          {symbol}
        </span>
      </div>

      <h3 className="font-medium text-sm mb-3 line-clamp-2 h-10">{companyname}</h3>

      <div className="text-2xl font-bold mb-2">₹{Number.parseFloat(price).toFixed(2)}</div>

      {viewMode === "change" ? (
        <div className={`text-sm flex items-center ${isPositive ? "text-green-400" : "text-red-400"}`}>
          <span
            className={`flex items-center px-3 py-1 rounded-md font-semibold ${
              isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
            }`}
          >
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {changePctValue.toFixed(2)}%
          </span>
        </div>
      ) : viewMode === "spike" && hasPositiveSpike ? (
        <div className="text-sm flex items-center">
          <span
            className={`flex items-center px-3 py-1 rounded-md font-semibold ${
              isHighSpike ? "bg-orange-900/30 text-orange-400" : "bg-yellow-900/30 text-yellow-400"
            }`}
          >
            <Flame className="h-3 w-3 mr-1" />
            {volumeSpikeValue.toFixed(2)}
          </span>
        </div>
      ) : viewMode === "spike" ? (
        <div className="text-sm flex items-center">
          <span className="flex items-center px-3 py-1 rounded-md font-semibold bg-gray-800 text-gray-400">
            No spike
          </span>
        </div>
      ) : viewMode === "highLow" ? (
        (() => {
          const { text, isHigh } = getHighLowInfo()
          return (
            <div className="text-sm flex items-center">
              <span
                className={`flex items-center px-3 py-1 rounded-md font-semibold ${
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
      ) : null}
    </Card>
    <StockModal stock={stock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
