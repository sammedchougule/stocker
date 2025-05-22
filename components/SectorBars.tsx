"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import type { Stock } from "@/lib/utils/fetchStocks"
import { ArrowUp, ArrowDown } from "lucide-react"

interface SectorBarsProps {
  indices: Stock[]
  selectedSector: string
  onSectorSelect: (sector: string) => void
}

// Map of index names to display names
const DISPLAY_NAMES: Record<string, string> = {
  "Nifty 50": "Nifty 50",
  "Nifty Auto": "Auto",
  "Nifty Bank": "Bank",
  "Nifty Energy": "Energy",
  "Nifty Financial Services": "Financial Services",
  "Nifty FMCG": "FMCG",
  "Nifty Healthcare": "Healthcare",
  "Nifty IT": "IT",
  "Nifty Media": "Media",
  "Nifty Metal": "Metal",
  "Nifty Pharma": "Pharma",
  "Nifty PVT Bank": "PVT Bank",
  "Nifty PSU Bank": "PSU Bank",
  "Nifty Realty": "Realty",
}

export default function SectorBars({ indices, selectedSector, onSectorSelect }: SectorBarsProps) {
  const [sortedIndices, setSortedIndices] = useState<Stock[]>([])
  const [maxAbsChange, setMaxAbsChange] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Sort indices by change percentage (high to low)
    const sorted = [...indices].sort((a, b) => {
      return Number(b.changepct) - Number(a.changepct)
    })

    // Find the maximum absolute change for scaling the bars
    const maxChange = sorted.reduce((max, index) => {
      const absChange = Math.abs(Number(index.changepct))
      return absChange > max ? absChange : max
    }, 0)

    setSortedIndices(sorted)
    setMaxAbsChange(maxChange)
  }, [indices])

  // Reset and trigger animation when component mounts
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [indices])

  // Get display name for an index
  const getDisplayName = (indexName: string) => {
    return DISPLAY_NAMES[indexName] || indexName
  }

  return (
  <Card className="p-6">
    <h2 className="text-xl font-bold mb-4">Sector Performance</h2>
    <p className="text-muted-foreground mb-2">Click on a sector to view its stocks</p>

    <div
      className="
        w-full flex flex-row items-end 
        gap-[2px] sm:gap-2 
        overflow-x-auto pb-2
        sm:justify-between
      "
      style={{ minHeight: 340 }}
    >
      {sortedIndices.map((index, i) => {
        const changePct = Number(index.changepct)
        const isPositive = changePct >= 0
        const absChangePct = Math.abs(changePct)
        const barHeight = maxAbsChange > 0 ? (absChangePct / maxAbsChange) * 100 : 0
        const displayName = getDisplayName(index.companyname)

        return (
          <div
            key={index.symbol}
            className={`flex flex-col items-center cursor-pointer transition-all duration-200 hover:bg-muted/50 rounded-md px-0.5 sm:px-0 py-1 ${
              selectedSector === displayName ? "bg-muted/70" : ""
            }`}
            style={{
              minWidth: 62,
              maxWidth: 62,
              width: "62px",
              flex: "0 0 62px",
              ...( // On desktop, distribute bars evenly
                {
                  ["@media (minwidth: 640px)"]: {
                    minWidth: "0",
                    maxWidth: "none",
                    width: "100%",
                    flex: "1 1 0%",
                  }
                }
              )
            }}
            onClick={() => onSectorSelect(displayName)}
          >
            {/* Bar */}
            <div className="flex flex-col justify-end h-64 sm:h-80 w-5 relative sm:w-full">
              <div
                className={`w-full rounded-t-md transition-all duration-1000 ease-out border border-opacity-30 ${isPositive ? "border-green-400" : "border-red-400"}`}
                style={{
                  height: isVisible ? `${barHeight}%` : "0%",
                  background: isPositive
                    ? `linear-gradient(180deg, rgba(34,197,94,0.5) 0%, rgba(34,197,94,${Math.min(0.8, 0.5 + absChangePct / 10)}) 100%)`
                    : `linear-gradient(180deg, rgba(239,68,68,0.5) 0%, rgba(239,68,68,${Math.min(0.8, 0.5 + absChangePct / 10)}) 100%)`,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            </div>
            {/* Percentage */}
            <div className={`flex items-center mt-2 text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {absChangePct.toFixed(2)}%
            </div>
            {/* Name */}
            <span
              className="font-medium text-xs text-center mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full"
              title={displayName}
            >
              {displayName}
            </span>
          </div>
        )
      })}
    </div>
  </Card>
)
}
