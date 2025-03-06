
// components/Sectors.tsx
"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { useStockContext } from "@/contexts/StockContext"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { Stock } from "@/types/Stock"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SectorStockDataTable from "@/components/SectorStockDataTable"
import { StockModal } from "@/components/StockModal"
import type { SortColumn, SortDirection } from "@/types/Stock"

// import AuthWrapper from "@/components/AuthWrapper";

// Define available sectors
const SECTORS = [
  "NIFTY_50",
  "NIFTY_AUTO",
  "NIFTY_BANK",
  "NIFTY_ENERGY",
  "NIFTY_FIN_SERVICE",
  "NIFTY_FMCG",
  "NIFTY_IT",
  "NIFTY_MEDIA",
  "NIFTY_METAL",
  "NIFTY_PHARMA",
  "NIFTY_PSU_BANK",
  "NIFTY_REALTY",
  "NIFTY_PVT_BANK",
]

interface SortState {
  [key: string]: {
    column: SortColumn
    direction: SortDirection
  }
}

export default function Sectors() {
  const { stocks } = useStockContext()
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [sortState, setSortState] = useState<SortState>({})
  const sectorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Prepare sector data
  const sectorData = useMemo(() => {
    return SECTORS.map((sector) => {
      const stock = stocks.find((s) => s.symbol === sector)
      return {
        sector: sector,
        name: sector.replace("NIFTY_", "").replace("_", " "),
        changepct: stock ? stock.changepct : 0,
      }
    }).sort((a, b) => b.changepct - a.changepct)
  }, [stocks])

  // Calculate min and max values for Y-axis
  const { minValue, maxValue } = useMemo(() => {
    const values = sectorData.map((d) => d.changepct)
    return {
      minValue: Math.min(...values, 0),
      maxValue: Math.max(...values, 0),
    }
  }, [sectorData])

  // Prepare stocks for each sector
  const sectorStocks = useMemo(() => {
    const indicesMap: { [key: string]: string } = {
      NIFTY_50: "Nifty 50",
      NIFTY_AUTO: "Nifty Auto",
      NIFTY_BANK: "Nifty Bank",
      NIFTY_ENERGY: "Nifty Energy",
      NIFTY_FIN_SERVICE: "Nifty Financial Services",
      NIFTY_FMCG: "Nifty FMCG",
      NIFTY_IT: "Nifty IT",
      NIFTY_MEDIA: "Nifty Media",
      NIFTY_METAL: "Nifty Metal",
      NIFTY_PHARMA: "Nifty Pharma",
      NIFTY_PVT_BANK: "Nifty PVT Bank",
      NIFTY_PSU_BANK: "Nifty PSU Bank",
      NIFTY_REALTY: "Nifty Realty",
    }

    return Object.fromEntries(
      SECTORS.map((sector) => {
        const indicesKey = indicesMap[sector] as keyof (typeof stocks)[0]["indices"]
        const sectorStocks = stocks
          .filter((stock) => stock.indices && stock.indices[indicesKey])
          .sort((a, b) => b.changepct - a.changepct)
        return [sector, sectorStocks]
      }),
    )
  }, [stocks])

  interface SectorData {
    sector: string
  }

  // Handle bar click event
  const handleBarClick = (data: SectorData) => {
    setSelectedSector(data.sector)
  }

  useEffect(() => {
    if (selectedSector) {
      const element = sectorRefs.current[selectedSector]
      if (element) {
        const yOffset = -100
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: "smooth" })
      }
    }
  }, [selectedSector])

  const handleSort = (tableId: string, column: SortColumn) => {
    setSortState((prevState) => {
      const currentSort = prevState[tableId] || { column: "symbol", direction: "asc" }
      const newDirection = currentSort.column === column && currentSort.direction === "asc" ? "desc" : "asc"
      return {
        ...prevState,
        [tableId]: { column, direction: newDirection },
      }
    })
  }

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const IndexTable = ({ sector, stocks }: { sector: string; stocks: Stock[] }) => {
    const { column: sortColumn, direction: sortDirection } = sortState[sector] || {
      column: "symbol",
      direction: "asc" as const,
    }

    return (
      <Card
        className={`mt-8 m-2 transition-all duration-300 bg-white dark:bg-[#151719] ${selectedSector === sector ? "ring-2 ring-blue-500" : ""}`}
        ref={(el: HTMLDivElement | null) => {
          sectorRefs.current[sector] = el
        }}
      >
        <CardHeader>
          <h3 className="text-xl font-semibold ">{sector.replace("NIFTY_", "").replace("_", " ")} Stocks</h3>
        </CardHeader>
        <CardContent className="p-0">
          <SectorStockDataTable
            tableId={sector}
            stocks={stocks}
            onStockClick={handleStockClick}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto">

      {/* Sector Performance Chart */}
      <Card className="bg-white dark:bg-[#151719] ">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sector Performance</h2>
        </CardHeader>
        <CardContent>
          {/* BarChart: Full Width */}
          <div className="w-full h-72 sm:h-96 lg:h-[700px]">
            <ChartContainer
              config={{
                changepct: {
                  label: "Change %",
                  color: "currentColor",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorData}
                  margin={{ top: 20, right: 0, left: -10, bottom: 20 }}
                  barSize={50}
                  barGap={10}
                >
                  {/* Gradients for 3D Effect */}
                  <defs>
                    <linearGradient id="positiveGradient3D" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                      <stop offset="50%" stopColor="#16a34a" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#15803d" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="negativeGradient3D" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                      <stop offset="50%" stopColor="#dc2626" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>

                  {/* Chart Axes */}
                  <CartesianGrid strokeDasharray="0 3" />
                  <XAxis dataKey="name" angle={-90} textAnchor="end" height={90} interval={0} tick={{ fontSize: 14 }} />
                  <YAxis
                    label={{
                      angle: -90,
                      position: "insideLeft",
                      offset: -20,
                    }}
                    tick={{ fontSize: 14 }}
                    domain={[minValue - 0.25, maxValue + 0.25]}
                    tickFormatter={(value) => `${value.toFixed(2)}%`}
                  />
                  <ReferenceLine y={0} stroke="#666" strokeWidth={2} />

                  {/* Tooltip */}
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value as number
                        return (
                          <div className="bg-white dark:bg-[#151719] p-2 border border-gray-200 rounded shadow">
                            <p className="font-semibold">Nifty {label}</p>
                            <p>
                              Change{" "}
                              <span
                                className={value >= 0 ? "font-semibold text-[#22c55e]" : "font-semibold text-[#ef4444]"}
                              >
                                {Number(value).toFixed(2)}%
                              </span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />

                  {/* Bars with 3D Effect */}
                  <Bar
                    dataKey="changepct"
                    cursor="pointer"
                    onClick={(data) => handleBarClick(data)}
                    radius={[2.5, 2.5, 0, 0]} // Rounded corners for the 3D look
                  >
                    {sectorData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#${entry.changepct >= 0 ? "positiveGradient3D" : "negativeGradient3D"})`}
                        style={{
                          filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.4))", // Shadow for depth
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sector Table and Index Tables */}

      <div className="mt-8 grid grid-cols-1 gap-2">
        {/* Row 1: Sector Table and First Index Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Sector Table */}
          <div>
            <Card className="bg-white dark:bg-[#151719]">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sector Performance</h2>
              </CardHeader>
              <CardContent className="h-[700px] overflow-hidden flex flex-col">
                <div className="flex-none">
                  <Table>
                    <TableHeader className="bg-blue-200 dark:bg-blue-900 ">
                      <TableRow>
                        <TableHead className="sticky top-0 text-lg text-gray-900 dark:text-gray-100">Sector</TableHead>
                        <TableHead className="sticky top-0 text-lg z-10 text-right text-gray-900 dark:text-gray-100">
                          Change %
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>
                <div className="flex-grow overflow-auto">
                  <Table>
                    <TableBody>
                      {sectorData.map((sector) => (
                        <TableRow
                          key={sector.sector}
                          className={`cursor-pointer font-medium p-4 text-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedSector === sector.sector ? "bg-gray-100 dark:bg-gray-700" : ""
                          }`}
                          onClick={() => setSelectedSector(sector.sector)}
                        >
                          <TableCell className="text-gray-900 dark:text-gray-100">{sector.name}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`inline-flex items-center rounded px-1 py-1 ${
                                sector.changepct >= 0
                                  ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900 rounded-lg"
                                  : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900 rounded-lg"
                              }`}
                            >
                              {sector.changepct >= 0 ? (
                                <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                              )}
                              <span className="text-md">{sector.changepct}%</span>
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* First Index Table */}
          <div>{SECTORS.length > 0 && <IndexTable sector={SECTORS[0]} stocks={sectorStocks[SECTORS[0]]} />}</div>
        </div>

        {/* Row 2: Remaining Index Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {SECTORS.slice(1).map((sector) => (
            <IndexTable key={sector} sector={sector} stocks={sectorStocks[sector]} />
          ))}
        </div>
      </div>

      <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

