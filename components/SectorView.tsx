"use client"

import { useState, useEffect, useRef } from "react"
import SectorBars from "@/components/SectorBars"
import SectorTable from "@/components/SectorTable"
import type { Stock } from "@/lib/utils/fetchStocks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface SectorViewProps {
  stocks: Stock[]
}

// Map of display names to actual index names in the data
const INDEX_MAP: Record<string, string> = {
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

export default function SectorView({ stocks }: SectorViewProps) {
  const [selectedSector, setSelectedSector] = useState<string>("Nifty 50")
  const [sectorIndices, setSectorIndices] = useState<Stock[]>([])
  const [sectorStocks, setSectorStocks] = useState<Stock[]>([])
  const sectorTableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Filter out only INDEX type stocks for the sector bars
    const indices = stocks.filter(
      (stock) => stock.type === "INDEX" && Object.values(INDEX_MAP).includes(stock.companyname),
    )
    setSectorIndices(indices)

    // Get stocks for the selected sector
    updateSectorStocks(selectedSector)
  }, [stocks, selectedSector])

  const updateSectorStocks = (sector: string) => {
    const actualIndexName = INDEX_MAP[sector]
    const filteredStocks = stocks.filter(
      (stock) => stock.type === "EQ" && stock.indices && stock.indices[actualIndexName] === true,
    )
    setSectorStocks(filteredStocks)
  }

  const handleSectorSelect = (sector: string) => {
    setSelectedSector(sector)

    // Scroll to the sector table with a small delay to ensure state updates first
    setTimeout(() => {
      if (sectorTableRef.current) {
        sectorTableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }, 100)
  }

  if (stocks.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No stock data available. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <SectorBars indices={sectorIndices} selectedSector={selectedSector} onSectorSelect={handleSectorSelect} />

      <div ref={sectorTableRef}>
        <SectorTable stocks={sectorStocks} sectorName={selectedSector} />
      </div>
    </div>
  )
}
