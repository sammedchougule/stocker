"use client"

import { useEffect, useState } from "react"
import { useStockContext } from "@/contexts/StockContext"
import type { Stock } from "@/types/Stock"
import { Treemap, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { StockModal } from "@/components/StockModal"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { CardContent } from "@mui/material"
import { CustomTreemapContent } from "@/components/CustomTreemapContent"
import { Metadata } from "next";
import { metadataConfig } from "@/lib/metadataConfig";

export const metadata: Metadata = {
  title: metadataConfig.heatmap.title,
  description: metadataConfig.heatmap.description,
  keywords: metadataConfig.heatmap.keywords.join(", "),
  openGraph: {
    ...metadataConfig.default.openGraph,
    title: metadataConfig.heatmap.title,
    description: metadataConfig.heatmap.description,
  },
};

type FilterOption =
  | "Nifty FnO"
  | "Nifty 50"
  | "Nifty Auto"
  | "Nifty Bank"
  | "Nifty Energy"
  | "Nifty Financial Services"
  | "Nifty FMCG"
  | "Nifty IT"
  | "Nifty Metal"
  | "Nifty Pharma"

const filterOptions: FilterOption[] = [
  "Nifty FnO",
  "Nifty 50",
  "Nifty Auto",
  "Nifty Bank",
  "Nifty Energy",
  "Nifty Financial Services",
  "Nifty FMCG",
  "Nifty IT",
  "Nifty Metal",
  "Nifty Pharma",
]

type SortOption = "changepct" | "marketcap" | "volumespike" | "pe" | "volume"

const sortOptions: SortOption[] = ["changepct", "marketcap", "volumespike", "pe", "volume"]

const sortOptionLabels = {
  pe: "PE",
  changepct: "Change %",
  marketcap: "Market Cap",
  volumespike: "1M Volume",
  volume: "1D Volume",
}

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="custom-tooltip bg-white dark:bg-[#151719] p-2 border border-gray-200 rounded shadow">
        <p className="font-semibold">{data.companyname}</p>
        <p>Price: ₹{Number(data.price).toFixed(2)}</p>
        <p>
          {sortOptionLabels[data.selectedSort as SortOption]}: {Number(data[data.selectedSort]).toFixed(2)}
          {data.selectedSort === "changepct" ? "%" : ""}
        </p>
      </div>
    )
  }
  return null
}

export default function Heatmap() {
  const { stocks } = useStockContext()
  const [heatmapData, setHeatmapData] = useState<Stock[]>([])
  const [selectedIndex, setSelectedIndex] = useState<FilterOption>("Nifty 50")
  const [selectedSort, setSelectedSort] = useState<SortOption>("changepct")
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let filtered = stocks.filter((stock) => stock.type === "EQ")

    if (selectedIndex === "Nifty FnO") {
      filtered = filtered.filter((stock) => stock.indices && stock.indices["Nifty FnO"])
    } else {
      filtered = filtered.filter((stock) => stock.indices && stock.indices[selectedIndex as keyof typeof stock.indices])
    }

    if (filtered.length > 0) {
      const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct)
      setHeatmapData(sortedStocks)
    }
  }, [stocks, selectedIndex])

  const getColor = (value: number, maxChange = 3) => {
    const clampedChange = Math.max(-maxChange, Math.min(value, maxChange))
    const normalizedChange = clampedChange / maxChange

    const green = [34, 197, 94] // Emerald Green
    const yellow = [253, 224, 71] // Canary Yellow
    const red = [239, 68, 68] // Crimson Red

    let startColor, endColor, t

    if (normalizedChange > 0) {
      startColor = yellow
      endColor = green
      t = Math.sqrt(normalizedChange)
    } else {
      startColor = yellow
      endColor = red
      t = Math.sqrt(Math.abs(normalizedChange))
    }

    const interpolatedColor = startColor.map((start, i) => Math.round(start + (endColor[i] - start) * t))

    return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`
  }

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const formattedData = heatmapData.map((stock) => ({
    name: stock.symbol,
    value: Math.abs(stock[selectedSort] || 0),
    changepct: stock.changepct,
    price: stock.price,
    [selectedSort]: stock[selectedSort],
    color: getColor(stock.changepct),
    image: `/images/${stock.symbol}.svg`,
    companyname: stock.companyname,
    selectedSort: selectedSort,
  }))

  return (
    <div className="container mx-auto bg-white dark:bg-[#151719] mt-0 ">
      
      <div className="flex gap-2 py-4">
        <div className="relative">
          <Select value={selectedIndex} onValueChange={(value) => setSelectedIndex(value as FilterOption)}>
            <SelectTrigger className=" bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{selectedIndex.replace("_", " ")}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {filterOptions.map((option) => (
                <SelectItem key={option} value={option} className="text-gray-700 dark:text-gray-300">
                  {option.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select value={selectedSort} onValueChange={(value) => setSelectedSort(value as SortOption)}>
            <SelectTrigger className=" bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{sortOptionLabels[selectedSort]}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option} className="text-gray-700 dark:text-gray-300">
                  {sortOptionLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

        <CardContent>
            <ResponsiveContainer width="100%" height={700}>
                <Treemap
                    data={formattedData}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={300}
                    animationEasing="ease-out"
                    content={
                        <CustomTreemapContent
                        x={0}
                        y={0}
                        width={0}
                        height={0}
                        name=""
                        color=""
                        image=""
                        changepct={0}
                        price={0}
                        onClick={(name) => {
                            const stock = heatmapData.find((s) => s.symbol === name)
                            if (stock) handleStockClick(stock)
                        }}
                        />
                    }
                    >
                    <Tooltip content={<CustomTooltip />} />
                </Treemap>
            </ResponsiveContainer>
        </CardContent>

      <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

