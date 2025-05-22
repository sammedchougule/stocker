"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { Stock } from "@/lib/utils/fetchStocks"
import { getSymbolColor } from "@/lib/utils/getSymbolColor"
import StockModal from "./StockModal"

interface SectorTableProps {
  stocks: Stock[]
  sectorName: string
}

type SortField = "symbol" | "price" | "change" | "changepct" | "volume"
type SortDirection = "asc" | "desc"

export default function SectorTable({ stocks, sectorName }: SectorTableProps) {
  const [sortField, setSortField] = useState<SortField>("changepct")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [sortedStocks, setSortedStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Sort stocks based on current sort field and direction
    const sorted = [...stocks].sort((a, b) => {
      let valueA: number
      let valueB: number

      switch (sortField) {
        case "symbol":
          return sortDirection === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol)
        case "price":
          valueA = Number(a.price)
          valueB = Number(b.price)
          break
        case "change":
          valueA = Number(a.change)
          valueB = Number(b.change)
          break
        case "changepct":
          valueA = Number(a.changepct)
          valueB = Number(b.changepct)
          break
        case "volume":
          valueA = Number(a.volume)
          valueB = Number(b.volume)
          break
        default:
          valueA = Number(a.changepct)
          valueB = Number(b.changepct)
      }

      return sortDirection === "asc" ? valueA - valueB : valueB - valueA
    })

    setSortedStocks(sorted)
  }, [stocks, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to descending
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Get sort indicator
  const getSortIndicator = (field: SortField) => {
    if (field !== sortField) return null

    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    )
  }

  const handleRowClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  return (

    <>
    <Card className="overflow-hidden" style={{ height: "700px" }}>
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold">{sectorName} Stocks</h2>
        <p className="text-muted-foreground mt-1">Showing {sortedStocks.length} stocks</p>
      </div>

      <div className="overflow-x-auto" style={{ maxHeight: "650px", height: "calc(100% - 100px)" }}>
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead
                className="text-foreground font-bold sticky left-0 z-20 bg-muted cursor-pointer"
                onClick={() => handleSort("symbol")}
              >
                Symbol {getSortIndicator("symbol")}
              </TableHead>
              <TableHead className="text-foreground font-bold">Company Name</TableHead>
              <TableHead
                className="text-foreground font-bold text-right cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price {getSortIndicator("price")}
              </TableHead>
              <TableHead
                className="text-foreground font-bold text-right cursor-pointer"
                onClick={() => handleSort("change")}
              >
                Change {getSortIndicator("change")}
              </TableHead>
              <TableHead
                className="text-foreground font-bold text-right cursor-pointer"
                onClick={() => handleSort("changepct")}
              >
                Change % {getSortIndicator("changepct")}
              </TableHead>
              <TableHead
                className="text-foreground font-bold text-right cursor-pointer"
                onClick={() => handleSort("volume")}
              >
                Volume {getSortIndicator("volume")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStocks.map((stock) => {
              const changeValue = Number.parseFloat(stock.change)
              const changePctValue = Number.parseFloat(stock.changepct)
              const isPositive = changeValue >= 0

              return (
                <TableRow key={stock.symbol} 
                  className="hover:bg-muted/50 border-b border-border cursor-pointer"
                  onClick={() => handleRowClick(stock)}
                >
                  <TableCell className="sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                    <span
                      className="inline-block w-26 text-center text-xs font-bold text-white px-3 py-1 rounded-md"
                      style={{ backgroundColor: getSymbolColor(stock.symbol) }}
                    >
                      {stock.symbol}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{stock.companyname}</TableCell>
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
                  <TableCell className="text-right">{Number(stock.volume).toLocaleString()}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
    <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
