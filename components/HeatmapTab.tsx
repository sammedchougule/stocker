"use client"
import StockHeatmap from "@/components/StockHeatmap"
import type { Stock } from "@/lib/utils/fetchStocks"

interface HeatmapTabProps {
  stocks: Stock[]
}

export default function HeatmapTab({ stocks }: HeatmapTabProps) {
  return (
    <div className="space-y-4">
      <StockHeatmap stocks={stocks} />
    </div>
  )
}
