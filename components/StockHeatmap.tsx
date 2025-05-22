"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListFilter, LayoutGrid } from "lucide-react"
import type { Stock } from "@/lib/utils/fetchStocks"
import { getSymbolColor } from "@/lib/utils/getSymbolColor"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CustomizedProgressBars from "./CustomizedProgressBars"
import StockModal from "./StockModal"

interface MarketHeatmapProps {
  stocks: Stock[]
}

// Map of display names to actual index names in the data
const INDEX_MAP: Record<string, string> = {
  "All Stocks": "All Stocks",
  "Nifty 50": "Nifty 50",
  Auto: "Nifty Auto",
  Bank: "Nifty Bank",
  Energy: "Nifty Energy",
  "Financial Services": "Nifty Financial Services",
  FMCG: "Nifty FMCG",
  Healthcare: "Nifty Healthcare",
  IT: "Nifty IT",
  Media: "Nifty Media",
  Metal: "Nifty Metal",
  Pharma: "Nifty Pharma",
  "PVT Bank": "Nifty PVT Bank",
  "PSU Bank": "Nifty PSU Bank",
  Realty: "Nifty Realty",
}

// Metrics for the heatmap
const METRICS = [
  { id: "changepct", name: "Change %" },
  { id: "volume", name: "Volume" },
  { id: "marketcap", name: "Market Cap" },
  { id: "pe", name: "P/E Ratio" },
]

export default function StockHeatmap({ stocks }: MarketHeatmapProps) {
  const [selectedIndex, setSelectedIndex] = useState<string>("All Stocks") // Default to All Stocks
  const [selectedMetric, setSelectedMetric] = useState<string>("changepct")
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [stocksBySector, setStocksBySector] = useState<Record<string, Stock[]>>({})
  const [showSectorView, setShowSectorView] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    // Filter stocks based on selected index
    let filtered: Stock[] = []

    if (selectedIndex === "All Stocks") {
      // For "All Stocks", show only Nifty F&O stocks (type "EQ")
      filtered = stocks.filter((stock) => stock.type === "EQ")
    } else {
      // For specific indices, filter as before
      const actualIndexName = INDEX_MAP[selectedIndex]
      filtered = stocks.filter(
        (stock) => stock.type === "EQ" && stock.indices && stock.indices[actualIndexName] === true,
      )
    }

    // Sort all stocks based on selected metric
    if (selectedMetric === "changepct") {
      filtered.sort((a, b) => Number(b.changepct) - Number(a.changepct))
    } else if (selectedMetric === "volume") {
      filtered.sort((a, b) => Number(b.volume) - Number(a.volume))
    } else if (selectedMetric === "marketcap") {
      filtered.sort((a, b) => Number(b.marketcap) - Number(a.marketcap))
    } else if (selectedMetric === "pe") {
      // Filter out stocks with invalid P/E ratios
      filtered = filtered.filter((stock) => Number(stock.pe) > 0 && !isNaN(Number(stock.pe)))
      filtered.sort((a, b) => Number(b.pe) - Number(a.pe))
    }

    setFilteredStocks(filtered)

    // Group stocks by sector for sector view
    const sectorMap: Record<string, Stock[]> = {}
    filtered.forEach((stock) => {
      const sector = stock.sector || "Other"
      if (!sectorMap[sector]) {
        sectorMap[sector] = []
      }
      sectorMap[sector].push(stock)
    })

    // Sort sectors by total market cap
    const sortedSectors = Object.keys(sectorMap).sort((a, b) => {
      const aTotalMarketCap = sectorMap[a].reduce((sum, stock) => sum + Number(stock.marketcap || 0), 0)
      const bTotalMarketCap = sectorMap[b].reduce((sum, stock) => sum + Number(stock.marketcap || 0), 0)
      return bTotalMarketCap - aTotalMarketCap
    })

    // Create a new ordered sector map
    const orderedSectorMap: Record<string, Stock[]> = {}
    sortedSectors.forEach((sector) => {
      orderedSectorMap[sector] = sectorMap[sector]
    })

    setStocksBySector(orderedSectorMap)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [stocks, selectedIndex, selectedMetric])

  // Get gradient color based on change percentage
  const getGradientByChange = (changePct: number): string => {
    if (changePct >= 3) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(22, 163, 74, 0.9) 100%)" // green-600
    if (changePct >= 2) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(34, 197, 94, 0.9) 100%)" // green-500
    if (changePct >= 1) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(74, 222, 128, 0.9) 100%)" // green-400
    if (changePct >= 0.5) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(134, 239, 172, 0.9) 100%)" // green-300
    if (changePct > 0) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(187, 247, 208, 0.9) 100%)" // green-200
    if (changePct === 0) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(229, 231, 235, 0.9) 100%)" // gray-200
    if (changePct > -0.5) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(254, 202, 202, 0.9) 100%)" // red-200
    if (changePct > -1) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(252, 165, 165, 0.9) 100%)" // red-300
    if (changePct > -2) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(248, 113, 113, 0.9) 100%)" // red-400
    if (changePct > -3) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(239, 68, 68, 0.9) 100%)" // red-500
    return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(220, 38, 38, 0.9) 100%)" // red-600
  }

  // Get gradient color based on volume
  const getGradientByVolume = (volume: number, maxVolume: number): string => {
    const ratio = volume / maxVolume
    if (ratio >= 0.8) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(147, 51, 234, 0.9) 100%)" // purple-600
    if (ratio >= 0.6) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(168, 85, 247, 0.9) 100%)" // purple-500
    if (ratio >= 0.4) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(192, 132, 252, 0.9) 100%)" // purple-400
    if (ratio >= 0.2) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(216, 180, 254, 0.9) 100%)" // purple-300
    if (ratio >= 0.1) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(233, 213, 255, 0.9) 100%)" // purple-200
    return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(243, 232, 255, 0.9) 100%)" // purple-100
  }

  // Get gradient color based on market cap
  const getGradientByMarketCap = (marketCap: number, maxMarketCap: number): string => {
    const ratio = marketCap / maxMarketCap
    if (ratio >= 0.8) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(37, 99, 235, 0.9) 100%)" // blue-600
    if (ratio >= 0.6) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(59, 130, 246, 0.9) 100%)" // blue-500
    if (ratio >= 0.4) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(96, 165, 250, 0.9) 100%)" // blue-400
    if (ratio >= 0.2) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(147, 197, 253, 0.9) 100%)" // blue-300
    if (ratio >= 0.1) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(191, 219, 254, 0.9) 100%)" // blue-200
    return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(219, 234, 254, 0.9) 100%)" // blue-100
  }

  // Get gradient color based on P/E ratio
  const getGradientByPE = (pe: number): string => {
    if (pe >= 50) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(202, 138, 4, 0.9) 100%)" // yellow-600
    if (pe >= 40) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(234, 179, 8, 0.9) 100%)" // yellow-500
    if (pe >= 30) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(250, 204, 21, 0.9) 100%)" // yellow-400
    if (pe >= 20) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(253, 224, 71, 0.9) 100%)" // yellow-300
    if (pe >= 10) return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(254, 240, 138, 0.9) 100%)" // yellow-200
    return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(254, 249, 195, 0.9) 100%)" // yellow-100
  }

  // Get gradient for a stock based on selected metric
  const getStockGradient = (stock: Stock): string => {
    if (selectedMetric === "changepct") {
      return getGradientByChange(Number(stock.changepct))
    } else if (selectedMetric === "volume") {
      const maxVolume = Math.max(...filteredStocks.map((s) => Number(s.volume) || 0))
      return getGradientByVolume(Number(stock.volume) || 0, maxVolume)
    } else if (selectedMetric === "marketcap") {
      const maxMarketCap = Math.max(...filteredStocks.map((s) => Number(s.marketcap) || 0))
      return getGradientByMarketCap(Number(stock.marketcap) || 0, maxMarketCap)
    } else if (selectedMetric === "pe") {
      return getGradientByPE(Number(stock.pe) || 0)
    }
    return "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(229, 231, 235, 0.9) 100%)" // gray-200
  }

  // Get display value based on selected metric
  const getDisplayValue = (stock: Stock): string => {
    if (selectedMetric === "changepct") {
      const changePct = Number(stock.changepct)
      return `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`
    } else if (selectedMetric === "volume") {
      const volume = Number(stock.volume)
      return volume >= 1000000
        ? `${(volume / 1000000).toFixed(2)}M`
        : volume >= 1000
          ? `${(volume / 1000).toFixed(2)}K`
          : volume.toString()
    } else if (selectedMetric === "marketcap") {
      const marketCap = Number(stock.marketcap)
      return marketCap >= 1000000000000
        ? `${(marketCap / 1000000000000).toFixed(2)}T`
        : marketCap >= 1000000000
          ? `${(marketCap / 1000000000).toFixed(2)}B`
          : marketCap >= 1000000
            ? `${(marketCap / 1000000).toFixed(2)}M`
            : marketCap.toString()
    } else if (selectedMetric === "pe") {
      const pe = Number(stock.pe)
      return pe.toFixed(2)
    }
    return ""
  }

    // Handle stock click
  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  // Get text color based on change percentage
  const getTextColor = (changePct: number): string => {
    if (changePct > 0) return "text-green-500"
    if (changePct < 0) return "text-red-500"
    return "text-gray-500"
  }

  // Render a stock tile
  const renderStockTile = (stock: Stock) => {
    const changePct = Number(stock.changepct)
    const displayValue = getDisplayValue(stock)
    const gradient = getStockGradient(stock)

    return (
      <div
        key={stock.symbol}
        className="rounded p-2 flex flex-col justify-between transition-all duration-200 hover:scale-105 hover:z-10 cursor-pointer"
        style={{
          height: "120px",
          background: gradient,
        }}
        onClick={() => handleStockClick(stock)}
      >
        <div className="flex items-center gap-1">
          {/* <img
            src={`/images/${stock.symbol}.svg`}
            alt={stock.symbol}
            className="w-6 h-6 rounded-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/no_image.jpeg";
            }}
          /> */}
          <span
            className="font-bold text-sm text-white truncate px-1 py-0 rounded inline-block"
            style={{ backgroundColor: getSymbolColor(stock.symbol) }}
          >
            {stock.symbol}
          </span>
        </div>

        <div>
          <div className="text-xl font-medium text-white">₹{Number(stock.price).toLocaleString()}</div>
          <div className={`text-md font-bold ${getTextColor(changePct)}`}>{displayValue}</div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div>
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide items-center mb-6 border-b border-border sticky top-40 z-30 bg-background">
      <div className="flex gap-2 p-2">
        <Select onValueChange={setSelectedIndex} value={selectedIndex}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Index" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
          <SelectLabel>Indices</SelectLabel>
          {Object.keys(INDEX_MAP).map((index) => (
            <SelectItem key={index} value={index}>
            {index}
            </SelectItem>
          ))}
          </SelectGroup>
        </SelectContent>
        </Select>

        <Select onValueChange={setSelectedMetric} value={selectedMetric}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select Metric" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
          <SelectLabel>Metrics</SelectLabel>
          {METRICS.map((metric) => (
            <SelectItem key={metric.id} value={metric.id}>
            {metric.name}
            </SelectItem>
          ))}
          </SelectGroup>
        </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        onClick={() => setShowSectorView((prev) => !prev)}
        className="flex items-center gap-2"
      >
        {showSectorView ? <LayoutGrid size={16} /> : <ListFilter size={16} />}
        {showSectorView ? "Sector View" : "List View"}
      </Button>
      </div>

      {/* Heatmap */}
      {isLoading ? (
      <div className="text-center"><CustomizedProgressBars/></div>
      ) : showSectorView ? (
      <div className="grid grid-cols-1 gap-4">
        {Object.keys(stocksBySector).map((sector) => (
        <Card key={sector} className="p-4">
          <h2 className="text-lg font-bold mb-2">{sector}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stocksBySector[sector].map((stock) => renderStockTile(stock))}
          </div>
        </Card>
        ))}
      </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredStocks.map((stock) => renderStockTile(stock))}
      </div>
      )}
    </div>
    <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
    
  )
}
