"use client"
import { useState, useRef } from "react"
import type React from "react"

import { ArrowUp, ArrowDown, TrendingUp, LineChart, Activity, ListFilter } from "lucide-react"
import type { Stock } from "@/lib/utils/fetchStocks"
import { Button } from "@/components/ui/button"
import { getSymbolColor } from "@/lib/utils/getSymbolColor"
import StockModal from "./StockModal"

interface TodayStocksProps {
  stocks: Stock[]
}

// List of indices to cycle through (excluding Nifty 50 and Nifty FnO)
const INDICES = [
  "All Stocks",
  "Nifty Auto",
  "Nifty Bank",
  "Nifty Energy",
  "Nifty Financial Services",
  "Nifty FMCG",
  "Nifty Healthcare",
  "Nifty IT",
  "Nifty Media",
  "Nifty Metal",
  "Nifty Pharma",
  "Nifty PSU Bank",
  "Nifty PVT Bank",
  "Nifty Realty",
]

// Stock categories
type StockCategory = "gainers" | "losers" | "mostActive" | "52wHigh" | "52wLow"

const CATEGORIES: {
  value: StockCategory
  label: string
  icon: React.ReactNode
  activeClass: string
}[] = [
  {
    value: "gainers",
    label: "Gainers",
    icon: <ArrowUp className="h-4 w-4" />,
    activeClass: "bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/40",
  },
  {
    value: "losers",
    label: "Losers",
    icon: <ArrowDown className="h-4 w-4" />,
    activeClass: "bg-red-900/30 text-red-400 border-red-800 hover:bg-red-900/40",
  },
  {
    value: "mostActive",
    label: "Most Active",
    icon: <Activity className="h-4 w-4" />,
    activeClass: "bg-orange-900/30 text-orange-400 border-orange-800 hover:bg-orange-900/40",
  },
  {
    value: "52wHigh",
    label: "52W High",
    icon: <TrendingUp className="h-4 w-4" />,
    activeClass: "bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/40",
  },
  {
    value: "52wLow",
    label: "52W Low",
    icon: <LineChart className="h-4 w-4" />,
    activeClass: "bg-red-900/30 text-red-400 border-red-800 hover:bg-red-900/40",
  },
]

export default function TodayStocks({ stocks }: TodayStocksProps) {
  const [selectedIndexIdx, setSelectedIndexIdx] = useState(0)
  const [activeCategory, setActiveCategory] = useState<StockCategory>("gainers")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const selectedIndex = INDICES[selectedIndexIdx]

  // Filter out only "EQ" type stocks
  const equityStocks = stocks.filter((stock) => stock.type === "EQ")

  // Filter stocks by selected index
  const filteredStocks =
    selectedIndex === "All Stocks"
      ? equityStocks
      : equityStocks.filter((stock) => stock.indices && stock.indices[selectedIndex] === true)

  // Get stocks based on active category
  const getStocksByCategory = () => {
    switch (activeCategory) {
      case "gainers":
        return [...filteredStocks].sort((a, b) => Number(b.changepct) - Number(a.changepct)).slice(0, 5)
      case "losers":
        return [...filteredStocks].sort((a, b) => Number(a.changepct) - Number(b.changepct)).slice(0, 5)
      case "mostActive":
        return [...filteredStocks]
          .filter((stock) => Number(stock.volumespike) > 0)
          .sort((a, b) => Number(b.volumespike) - Number(a.volumespike))
          .slice(0, 5)
      case "52wHigh":
        return filteredStocks.filter((stock) => stock.yearHLCross === "52W High").slice(0, 5)
      case "52wLow":
        return filteredStocks.filter((stock) => stock.yearHLCross === "52W Low").slice(0, 5)
      default:
        return []
    }
  }

  const displayedStocks = getStocksByCategory()

  // Cycle to the next index when the filter link is clicked
  const handleFilterClick = () => {
    setSelectedIndexIdx((prevIdx) => (prevIdx + 1) % INDICES.length)
  }

  // Get display name for the selected index
  const getDisplayName = () => {
    if (selectedIndex === "All Stocks") return "All"
    return selectedIndex.replace("Nifty ", "")
  }

  return (
    <div className="bg-card rounded-lg p-6 border shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Today Stocks</h2>
        <Button
          variant="link"
          className="p-0 h-auto text-blue-500 text-sm flex items-center"
          onClick={handleFilterClick}
        >
          {getDisplayName()}
          <ListFilter className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Horizontally scrollable buttons */}
      <div className="relative mb-6">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex space-x-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant="outline"
                size="sm"
                className={`flex items-center whitespace-nowrap ${
                  activeCategory === category.value ? category.activeClass : ""
                }`}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.icon}
                <span className="ml-1">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="grid grid-cols-3 gap-4 mb-2 px-4 text-sm text-muted-foreground">
          <div>STOCKS</div>
          <div className="text-right">PRICE</div>
          <div className="text-right">CHANGE</div>
        </div>

        <div className="space-y-4">
          {displayedStocks.length > 0 ? (
            displayedStocks.map((stock) => (
              <div key={stock.symbol} 
              onClick={() => { setSelectedStock(stock); setModalOpen(true); }} 
              className="cursor-pointer hover:bg-muted/100 p-1 rounded-md transition-colors">
                <StockRow stock={stock} />
              </div>
            ))
          ) : (
            <NoStocksMessage />
          )}
        </div>
      </div>
      <StockModal stock={selectedStock} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function NoStocksMessage() {
  return <div className="flex justify-center items-center py-10 text-muted-foreground">No Stocks Available</div>
}

interface StockRowProps {
  stock: Stock
}

function StockRow({ stock }: StockRowProps) {
  const changeValue = Number.parseFloat(stock.change)
  const changePctValue = Number.parseFloat(stock.changepct)
  const isPositive = changeValue >= 0

  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <div className="flex items-center gap-3">
        {/* Only show the circle on non-mobile screens */}
        <div
          className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center flex-shrink-0`}
        >
          <img
            src={`/images/${stock.symbol}.svg`}
            alt={stock.symbol}
            className="w-8 h-8 object-contain rounded-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/no_image.jpeg';
            }}
          />
        </div>
        <div className="min-w-0">
          <div
            className={`text-xs px-2 py-0.5 rounded font-medium inline-block mb-1 text-white`}
            style={{ backgroundColor: getSymbolColor(stock.symbol) }}
          >
            {stock.symbol}
          </div>
          <div className="text-sm font-medium truncate max-w-full">{stock.companyname}</div>
        </div>
      </div>
      <div className="text-right font-bold">₹{Number.parseFloat(stock.price).toLocaleString()}</div>
      <div className="text-right">
        <div
          className={`inline-flex items-center justify-center rounded px-2 py-1 font-semibold ${
            isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
          }`}
        >
          {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {Math.abs(changePctValue).toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
