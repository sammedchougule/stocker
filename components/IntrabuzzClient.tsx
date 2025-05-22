"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GridIcon, ListIcon, Filter, ArrowDown, ArrowUp, Flame, Signal, Percent } from "lucide-react"
import StockCard from "./StockCard"
import StockTable from "@/components/StockTable"
import type { Stock } from "@/lib/utils/fetchStocks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface IntrabuzzClientProps {
  initialStocks: Stock[]
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

// List of display names for the dropdown
const INDICES = [
  "All Stocks",
  "Nifty 50",
  "Auto",
  "Bank",
  "Energy",
  "Financial Services",
  "FMCG",
  "Healthcare",
  "IT",
  "Media",
  "Metal",
  "Pharma",
  "PVT Bank",
  "PSU Bank",
  "Realty",
]

// Sort directions
type SortDirection = "none" | "asc" | "desc"

// Sort types
type SortType = "none" | "change" | "volumeSpike" | "highLow"

export default function IntrabuzzClient({ initialStocks }: IntrabuzzClientProps) {
  // Filter out only "EQ" type stocks
  const equityStocks = initialStocks.filter((stock) => stock.type === "EQ")

  const [allStocks, setAllStocks] = useState<Stock[]>(equityStocks)
  const [displayedStocks, setDisplayedStocks] = useState<Stock[]>([])
  const [selectedIndex, setSelectedIndex] = useState<string>("Nifty 50")
  const [sortType, setSortType] = useState<SortType>("none")
  const [sortDirection, setSortDirection] = useState<SortDirection>("none")
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  //const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const buttonsScrollRef = useRef<HTMLDivElement>(null)

  // Filter and sort stocks based on selected index and sort settings
  useEffect(() => {
    // First, filter by index
    let filtered: Stock[]
    if (selectedIndex === "All Stocks") {
      filtered = [...allStocks]
    } else {
      // Get the actual index name from the map
      const actualIndexName = INDEX_MAP[selectedIndex]
      filtered = allStocks.filter((stock) => stock.indices && stock.indices[actualIndexName] === true)
    }

    // Then, apply additional filtering and sorting based on sort type
    if (sortType === "volumeSpike") {
      // Filter out stocks with negative volume spike
      filtered = filtered.filter((stock) => {
        const volumeSpike = Number.parseFloat(stock.volumespike)
        return !isNaN(volumeSpike) && volumeSpike >= 0
      })

      // Sort by volume spike if needed
      if (sortDirection !== "none") {
        filtered.sort((a, b) => {
          const spikeA = Number.parseFloat(a.volumespike)
          const spikeB = Number.parseFloat(b.volumespike)
          return sortDirection === "asc" ? spikeA - spikeB : spikeB - spikeA
        })
      }
    } else if (sortType === "change") {
      // Sort by change percentage if needed
      if (sortDirection !== "none") {
        filtered.sort((a, b) => {
          const changeA = Number.parseFloat(a.changepct)
          const changeB = Number.parseFloat(b.changepct)
          return sortDirection === "asc" ? changeA - changeB : changeB - changeA
        })
      }
    } else if (sortType === "highLow") {
      // Filter out stocks with "..." in all three high-low cross fields
      filtered = filtered.filter((stock) => {
        return stock.todayHLCross !== "..." || stock.monthHLCross !== "..." || stock.yearHLCross !== "..."
      })
    }

    setDisplayedStocks(filtered)
  }, [selectedIndex, allStocks, sortType, sortDirection])

  // // Initialize displayed stocks on component mount
  // useEffect(() => {
  //   // Initial filter for Nifty 50 stocks
  //   const nifty50Stocks = equityStocks.filter((stock) => stock.indices && stock.indices["Nifty 50"] === true)
  //   setDisplayedStocks(nifty50Stocks)
  //   setLastUpdated(new Date())
  //   // This effect runs only once on mount
  // }, []) // Empty dependency array

  const toggleViewMode = () => {
    setViewMode(viewMode === "card" ? "table" : "card")
  }

  const handleIndexChange = (value: string) => {
    setSelectedIndex(value)
  }

  const toggleChangeSort = () => {
    if (sortType !== "change") {
      // Switch to change sort
      setSortType("change")
      setSortDirection("asc")
    } else {
      // Cycle through: asc -> desc -> none
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortType("none")
        setSortDirection("none")
      } else {
        setSortDirection("asc")
      }
    }
  }

  const toggleVolumeSpike = () => {
    if (sortType !== "volumeSpike") {
      // Switch to volume spike sort
      setSortType("volumeSpike")
      setSortDirection("asc")
    } else {
      // Cycle through: asc -> desc -> none
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortType("none")
        setSortDirection("none")
      } else {
        setSortDirection("asc")
      }
    }
  }

  const toggleHighLow = () => {
    if (sortType !== "highLow") {
      // Switch to high-low sort
      setSortType("highLow")
      setSortDirection("asc") // Not really used for high-low, but keeping for consistency
    } else {
      // Turn off high-low sort
      setSortType("none")
      setSortDirection("none")
    }
  }

  // Get sort icon for different sort types
  const getSortIcon = (type: SortType) => {
    if (type === "change") {
      if (sortType !== "change" || sortDirection === "none") return <Percent className="h-4 w-4 mr-2" />
      if (sortDirection === "asc") return <ArrowUp className="h-4 w-4 mr-2" />
      return <ArrowDown className="h-4 w-4 mr-2" />
    } else {
      if (sortType !== "volumeSpike" || sortDirection === "none") return <Flame className="h-4 w-4 mr-2" />
      if (sortDirection === "asc") return <ArrowUp className="h-4 w-4 mr-2" />
      return <ArrowDown className="h-4 w-4 mr-2" />
    }
  }

  // Get sort description for display
  const getSortDescription = () => {
    if (sortType === "none" || sortDirection === "none") return ""

    if (sortType === "change") {
      return `By ${sortDirection === "asc" ? "Lowest" : "Highest"} Change %`
    } else if (sortType === "volumeSpike") {
      return `By ${sortDirection === "asc" ? "Lowest" : "Highest"} Spike`
    } else if (sortType === "highLow") {
      return "By High-Low Crossings"
    }

    return ""
  }

  return (
    <div className="flex flex-col">
      {/* Sticky filter buttons section */}
      <div className="sticky top-[168px] md:top-[168px] z-30 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Horizontally scrollable buttons container (including index selector) */}
            <div className="overflow-x-auto scrollbar-hide -mx-2 w-full" ref={buttonsScrollRef}>
              <div className="flex gap-2 min-w-max items-center">
              <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-[160px]">
                  <Select value={selectedIndex} onValueChange={handleIndexChange}>
                    <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select Index" />
                    </div>
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Indices</SelectLabel>
                      {INDICES.map((index) => (
                      <SelectItem key={index} value={index}>
                        {index}
                      </SelectItem>
                      ))}
                    </SelectGroup>
                    </SelectContent>
                  </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Filter stocks by indices</p>
                </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                  onClick={toggleChangeSort}
                  variant={
                    sortType === "change" && sortDirection === "asc"
                    ? "destructive"
                    : "outline"
                  }
                  className={`${
                    sortType === "change" && sortDirection === "desc"
                    ? "bg-green-900/30 hover:bg-green-900/40 text-green-400 border-green-800"
                    : ""
                  }`}
                  >
                  {getSortIcon("change")}
                  Change 
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Sort stocks by % change</p>
                </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                  onClick={toggleVolumeSpike}
                  variant={
                    sortType === "volumeSpike" ? (sortDirection === "asc" ? "outline" : "outline") : "outline"
                  }
                  className={`${
                    sortType === "volumeSpike" && sortDirection === "asc"
                    ? "bg-yellow-900/30 hover:bg-yellow-900/40 text-yellow-400 border-yellow-800"
                    : sortType === "volumeSpike" && sortDirection === "desc"
                      ? "bg-orange-900/30 hover:bg-orange-900/40 text-orange-400 border-orange-800"
                      : ""
                  }`}
                  >
                  {getSortIcon("volumeSpike")}
                  Spike
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Sort stocks by volume spike</p>
                </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                  onClick={toggleHighLow}
                  variant={sortType === "highLow" ? "outline" : "outline"}
                  className={`${
                    sortType === "highLow"
                    ? "bg-blue-900/30 hover:bg-blue-900/40 text-blue-400 border-blue-800"
                    : ""
                  }`}
                  >
                  <Signal className="h-4 w-4 mr-2" />
                  High-Low
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Show stocks at their daily, monthly, or yearly highs and lows</p>
                </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={toggleViewMode} variant="outline">
                  {viewMode === "card" ? (
                    <>
                    <ListIcon className="h-4 w-4 mr-2" />
                    Table
                    </>
                  ) : (
                    <>
                    <GridIcon className="h-4 w-4 mr-2" />
                    Card
                    </>
                  )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Toggle between card and table view</p>
                </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </div>
            </div>
            </div>
          {/* <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div> */}
        </div>
      </div>

      {/* Scrollable content section */}
      <div className="mt-4 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {displayedStocks.length === 0 && !error ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>
              {sortType === "volumeSpike"
                ? "No stocks found with positive volume spike. Try a different filter or sorting option."
                : sortType === "highLow"
                  ? "No stocks found with high-low crossings. Try a different filter or sorting option."
                  : selectedIndex !== "All Stocks"
                    ? `No stocks found in ${selectedIndex}. Try selecting a different index.`
                    : "No stock data available."}
            </AlertDescription>
          </Alert>
        ) : viewMode === "card" && displayedStocks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                viewMode={sortType === "volumeSpike" ? "spike" : sortType === "highLow" ? "highLow" : "change"}
              />
            ))}
          </div>
        ) : displayedStocks.length > 0 ? (
          <Card className="overflow-hidden">
            <StockTable
              stocks={displayedStocks}
              viewMode={sortType === "volumeSpike" ? "spike" : sortType === "highLow" ? "highLow" : "change"}
            />
          </Card>
        ) : null}
      </div>
    </div>
  )
}
