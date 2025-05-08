"use client"

import type React from "react"
import { useMemo } from "react"
import { ArrowUp, ArrowDown, Flame, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import type { Stock } from "@/types/Stock"
import { getStockBgColor } from "@/lib/getstockBgColor"
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "./ui/table"
import { Button } from "./ui/button"

interface IntrabuzzStockDataTableProps {
  stocks: Stock[]
  onStockClick?: (stock: Stock) => void
  onSort: (column: SortColumn) => void
  sortColumn: SortColumn
  sortDirection: SortDirection
  currentPage: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  spikeFilterOn: boolean
  highLowFilterOn: boolean
}

type SortColumn =
  | "symbol"
  | "companyname"
  | "closeyest"
  | "price"
  | "change"
  | "changepct"
  | "volumespike"
  | "todayHLCross"
  | "monthHLCross"
  | "yearHLCross"
type SortDirection = "asc" | "desc"

const IntrabuzzStockDataTable: React.FC<IntrabuzzStockDataTableProps> = ({
  stocks,
  onStockClick,
  onSort,
  sortColumn,
  sortDirection,
  currentPage,
  rowsPerPage,
  onPageChange,
  spikeFilterOn,
  highLowFilterOn,
}) => {
  const sortedStocks = useMemo(() => {
    return [...stocks]
      .filter((stock) => {
        if (highLowFilterOn) {
          // Only include stocks that have at least one non-"-" HL Cross value
          const hasValidHLCross = [stock.todayHLCross, stock.monthHLCross, stock.yearHLCross].some(
            (value) => value && value !== "...",
          )
          return hasValidHLCross
        }
        return true
      })
      .sort((a, b) => {
        let aValue = a[sortColumn]
        let bValue = b[sortColumn]

        const parseCurrency = (value: string | null) => {
          if (value && typeof value === "string" && value.includes("₹")) {
            return Number.parseFloat(value.replace(/[^\d.-]/g, ""))
          }
          return value ? Number.parseFloat(value) : 0
        }

        const parsePercentage = (value: string | null) => {
          if (value && typeof value === "string" && value.includes("%")) {
            return Number.parseFloat(value.replace("%", ""))
          }
          return value ? Number.parseFloat(value) : 0
        }

        if (sortColumn === "price" || sortColumn === "closeyest" || sortColumn === "change") {
          aValue = parseCurrency(aValue?.toString() ?? null)
          bValue = parseCurrency(bValue?.toString() ?? null)
        } else if (
          sortColumn === "changepct" ||
          sortColumn === "todayHLCross" ||
          sortColumn === "monthHLCross" ||
          sortColumn === "yearHLCross"
        ) {
          aValue = parsePercentage(aValue?.toString() ?? null)
          bValue = parsePercentage(bValue?.toString() ?? null)
        } else {
          aValue = aValue ? Number.parseFloat(aValue.toString()) : 0
          bValue = bValue ? Number.parseFloat(bValue.toString()) : 0
        }

        if ((aValue ?? 0) < (bValue ?? 0)) return sortDirection === "asc" ? -1 : 1
        if ((aValue ?? 0) > (bValue ?? 0)) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [stocks, sortColumn, sortDirection, highLowFilterOn])

  const paginatedStocks = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return sortedStocks.slice(startIndex, endIndex)
  }, [sortedStocks, currentPage, rowsPerPage])

  const totalPages = Math.ceil(sortedStocks.length / rowsPerPage)

  const renderSortIcon = (column: SortColumn) => {
    if (column === sortColumn) {
      return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
    }
    return <ArrowUpDown className="w-4 h-4" />
  }

  const renderHLCrossValue = (value: string | undefined) => {
    if (!value || value === "-") return null
    const isHigh = value.includes("H")
    const className = isHigh ? "text-green-500 bg-green-50 rounded-lg" : "text-red-500 bg-red-50 rounded-lg"
    return (
      <span className={`inline-flex items-center rounded px-1 py-1 font-medium ${className}`}>
        {isHigh ? <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDown className="w-3.5 h-3.5 mr-0.5" />}
        {value}
      </span>
    )
  }
  

  return (
    <div className=" overflow-x-auto">
      <div className="max-h-[650px] overflow-auto">
        <Table className="w-full">
          <TableHeader className="bg-blue-400 dark:bg-blue-900  sticky top-0 z-10">
            <TableRow >
              {/* Sticky Left Column - Symbol */}
              <TableHead
                className="p-4 text-left font-medium cursor-pointer sticky left-0 bg-blue-400 dark:bg-blue-900 z-30"
                onClick={() => onSort("symbol")}
              >
                <div className="flex text-gray-900 dark:text-white items-center gap-2">
                  <span>Symbol</span>
                  {renderSortIcon("symbol")}
                </div>
              </TableHead>

              {/* Company Name */}
              <TableHead
                className="p-4 text-right font-medium cursor-pointer sticky top-0 left-0 bg-blue-400 dark:bg-blue-900 z-20"
                onClick={() => onSort("companyname")}
              >
                <div className="flex items-center text-gray-900 dark:text-white gap-2">
                  <span>Company Name</span>
                  {renderSortIcon("companyname")}
                </div>
              </TableHead>

              {/* Previous Close */}
              <TableHead
                className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                onClick={() => onSort("closeyest")}
              >
                <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                  <span>Previous Close</span>
                  {renderSortIcon("closeyest")}
                </div>
              </TableHead>

              {/* Price */}
              <TableHead
                className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                onClick={() => onSort("price")}
              >
                <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                  <span>Price</span>
                  {renderSortIcon("price")}
                </div>
              </TableHead>

              {/* Change */}
              <TableHead
                className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                onClick={() => onSort("change")}
              >
                <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                  <span>Change</span>
                  {renderSortIcon("change")}
                </div>
              </TableHead>

              {/* Change % */}
              <TableHead
                className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                onClick={() => onSort("changepct")}
              >
                <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                  <span>Change %</span>
                  {renderSortIcon("changepct")}
                </div>
              </TableHead>

              {spikeFilterOn && (
                <TableHead
                  className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                  onClick={() => onSort("volumespike")}
                >
                  <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                    <span>Spike</span>
                    {renderSortIcon("volumespike")}
                  </div>
                </TableHead>
              )}

              {highLowFilterOn && (
                <>
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                    onClick={() => onSort("todayHLCross")}
                  >
                    <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                      <span>Today HL Cross</span>
                      {renderSortIcon("todayHLCross")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                    onClick={() => onSort("monthHLCross")}
                  >
                    <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                      <span>Month HL Cross</span>
                      {renderSortIcon("monthHLCross")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer sticky top-0 bg-blue-400 dark:bg-blue-900 z-20"
                    onClick={() => onSort("yearHLCross")}
                  >
                    <div className="flex items-center text-gray-900 dark:text-white justify-end gap-2">
                      <span>Year HL Cross</span>
                      {renderSortIcon("yearHLCross")}
                    </div>
                  </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedStocks.map((stock) => (
              <TableRow
                key={stock.symbol}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => onStockClick && onStockClick(stock)}
              >
                <TableCell className="sticky left-0 p-4 border-t ">
                  <div
                    className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
                    style={{ backgroundColor: getStockBgColor(stock.symbol), width: "6rem" }}
                  >
                    <span
                      className="whitespace-nowrap text-[12px] leading-none text-center block overflow-hidden text-ellipsis"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                        maxWidth: "100%",
                        fontSize: stock.symbol.length > 10 ? "10px" : "12px",
                      }}
                    >
                      {stock.symbol}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="p-2 max-w-[120px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{stock.companyname}</TableCell>
                <TableCell className="p-2 text-right">₹{Number(stock.closeyest).toFixed(2)}</TableCell>
                <TableCell className="p-2 text-right">₹{Number(stock.price).toFixed(2)}</TableCell>

                <TableCell className="p-2 text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      stock.change >= 0
                        ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50"
                        : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50"
                    }`}
                  >
                    {stock.change >= 0 ? (
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {Number(stock.change).toFixed(2)}
                  </span>
                </TableCell>

                <TableCell className="p-2 text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      stock.changepct >= 0
                        ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50"
                        : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50"
                    }`}
                  >
                    {stock.changepct >= 0 ? (
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {Number(stock.changepct).toFixed(2)}%
                  </span>
                </TableCell>

                {spikeFilterOn && (
                  <TableCell className="p-2 text-right">
                    <span
                      className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                        (stock.volumespike ?? 0) >= 0
                          ? "text-orange-600 bg-orange-100"
                          : "text-yellow-600 bg-yellow-100"
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 mr-0.5" />
                      {Number(stock.volumespike).toFixed(2)}X
                    </span>
                  </TableCell>
                )}

                {highLowFilterOn && (
                  <>
                    <TableCell className="p-2 text-right">{renderHLCrossValue(stock.todayHLCross ?? undefined)}</TableCell>
                    <TableCell className="p-2 text-right">{renderHLCrossValue(stock.monthHLCross  ?? undefined)}</TableCell>
                    <TableCell className="p-2 text-right">{renderHLCrossValue(stock.yearHLCross  ?? undefined)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      {/* Updated Pagination Controls */}
      <div className="flex justify-between items-center p-2 bg-blue-400 dark:bg-blue-900">
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="sm">
          <ChevronLeft className="w-4 h-4 mr-2" />Previous
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>
        </div>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >Next<ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

export default IntrabuzzStockDataTable

