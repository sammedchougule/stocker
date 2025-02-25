// "use client"

// import type React from "react"
// import { useMemo } from "react"
// import { ArrowUp, ArrowDown, Flame, ArrowUpDown } from "lucide-react"
// import Image from "next/image"
// import type { Stock } from "@/types/Stock"
// import { getStockBgColor } from "@/lib/getstockBgColor"
// import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "./ui/table"

// interface IntrabuzzStockDataTableProps {
//   stocks: Stock[]
//   onStockClick?: (stock: Stock) => void
//   onSort: (column: SortColumn) => void
//   sortColumn: SortColumn
//   sortDirection: SortDirection
//   currentPage: number
//   rowsPerPage: number
//   onPageChange: (page: number) => void
//   spikeFilterOn: boolean
//   highLowFilterOn: boolean
// }

// type SortColumn =
//   | "symbol"
//   | "companyname"
//   | "closeyest"
//   | "price"
//   | "change"
//   | "changepct"
//   | "volumespike"
//   | "today_hlCross"
//   | "month_hlCross"
//   | "year_hlCross"
// type SortDirection = "asc" | "desc"

// const IntrabuzzStockDataTable: React.FC<IntrabuzzStockDataTableProps> = ({
//   stocks,
//   onStockClick,
//   onSort,
//   sortColumn,
//   sortDirection,
//   currentPage,
//   rowsPerPage,
//   onPageChange,
//   spikeFilterOn,
//   highLowFilterOn,
// }) => {
//   const sortedStocks = useMemo(() => {
//     return [...stocks]
//       .filter((stock) => {
//         if (highLowFilterOn) {
//           // Only include stocks that have at least one non-"-" HL Cross value
//           const hasValidHLCross = [stock.today_hlCross, stock.month_hlCross, stock.year_hlCross].some(
//             (value) => value && value !== "-",
//           )
//           return hasValidHLCross
//         }
//         return true
//       })
//       .sort((a, b) => {
//         let aValue = a[sortColumn]
//         let bValue = b[sortColumn]

//         const parseCurrency = (value: string | null) => {
//           if (value && typeof value === "string" && value.includes("₹")) {
//             return Number.parseFloat(value.replace(/[^\d.-]/g, ""))
//           }
//           return value ? Number.parseFloat(value) : 0
//         }

//         const parsePercentage = (value: string | null) => {
//           if (value && typeof value === "string" && value.includes("%")) {
//             return Number.parseFloat(value.replace("%", ""))
//           }
//           return value ? Number.parseFloat(value) : 0
//         }

//         if (sortColumn === "price" || sortColumn === "closeyest" || sortColumn === "change") {
//           aValue = parseCurrency(aValue?.toString() ?? null)
//           bValue = parseCurrency(bValue?.toString() ?? null)
//         } else if (
//           sortColumn === "changepct" ||
//           sortColumn === "today_hlCross" ||
//           sortColumn === "month_hlCross" ||
//           sortColumn === "year_hlCross"
//         ) {
//           aValue = parsePercentage(aValue?.toString() ?? null)
//           bValue = parsePercentage(bValue?.toString() ?? null)
//         } else {
//           aValue = aValue ? Number.parseFloat(aValue.toString()) : 0
//           bValue = bValue ? Number.parseFloat(bValue.toString()) : 0
//         }

//         if ((aValue ?? 0) < (bValue ?? 0)) return sortDirection === "asc" ? -1 : 1
//         if ((aValue ?? 0) > (bValue ?? 0)) return sortDirection === "asc" ? 1 : -1
//         return 0
//       })
//   }, [stocks, sortColumn, sortDirection, highLowFilterOn])

//   const paginatedStocks = useMemo(() => {
//     const startIndex = (currentPage - 1) * rowsPerPage
//     const endIndex = startIndex + rowsPerPage
//     return sortedStocks.slice(startIndex, endIndex)
//   }, [sortedStocks, currentPage, rowsPerPage])

//   const renderSortIcon = (column: SortColumn) => {
//     if (column === sortColumn) {
//       return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
//     }
//     return <ArrowUpDown className="w-4 h-4" />
//   }

//   const renderHLCrossValue = (value: string | undefined) => {
//     if (!value || value === "-") return null
//     const isHigh = value.includes("H")
//     const className = isHigh ? "text-green-500 bg-green-50 rounded-lg" : "text-red-500 bg-red-50 rounded-lg"
//     return (
//       <span className={`inline-flex items-center rounded px-1 py-1 font-medium ${className}`}>
//         {isHigh ? <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDown className="w-3.5 h-3.5 mr-0.5" />}
//         {value}
//       </span>
//     )
//   }

//   return (
//     <div className="relative border border-gray-200 rounded-lg">
//       <div className="overflow-auto max-h-[710px] bottom-b">
//         <Table className="w-full border-collapse">
//           <TableHeader className="sticky top-0 z-20 bg-blue-200">
//             <TableRow>
//               <TableHead
//                 className="sticky left-0 z-30 min-w-[100px] bg-blue-200 p-4 text-left font-medium cursor-pointer"
//                 onClick={() => onSort("symbol")}
//               >
//                 <div className="flex items-center gap-2">
//                   <span>Symbol</span>
//                   {renderSortIcon("symbol")}
//                 </div>
//               </TableHead>
//               <TableHead
//                 className="p-4 text-left font-medium min-w-[200px] cursor-pointer"
//                 onClick={() => onSort("companyname")}
//               >
//                 <div className="flex items-center gap-2">
//                   <span>Company Name</span>
//                   {renderSortIcon("companyname")}
//                 </div>
//               </TableHead>
//               <TableHead
//                 className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                 onClick={() => onSort("closeyest")}
//               >
//                 <div className="flex items-center justify-end gap-2">
//                   <span>Previous Close</span>
//                   {renderSortIcon("closeyest")}
//                 </div>
//               </TableHead>
//               <TableHead
//                 className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                 onClick={() => onSort("price")}
//               >
//                 <div className="flex items-center justify-end gap-2">
//                   <span>Price</span>
//                   {renderSortIcon("price")}
//                 </div>
//               </TableHead>
//               <TableHead
//                 className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                 onClick={() => onSort("change")}
//               >
//                 <div className="flex items-center justify-end gap-2">
//                   <span>Change</span>
//                   {renderSortIcon("change")}
//                 </div>
//               </TableHead>
//               <TableHead
//                 className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                 onClick={() => onSort("changepct")}
//               >
//                 <div className="flex items-center justify-end gap-2">
//                   <span>Change %</span>
//                   {renderSortIcon("changepct")}
//                 </div>
//               </TableHead>
//               {spikeFilterOn && (
//                 <TableHead
//                   className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                   onClick={() => onSort("volumespike")}
//                 >
//                   <div className="flex items-center justify-end gap-2">
//                     <span>Spike</span>
//                     {renderSortIcon("volumespike")}
//                   </div>
//                 </TableHead>
//               )}
//               {highLowFilterOn && (
//                 <>
//                   <TableHead
//                     className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                     onClick={() => onSort("today_hlCross")}
//                   >
//                     <div className="flex items-center justify-end gap-2">
//                       <span>Today HL Cross</span>
//                       {renderSortIcon("today_hlCross")}
//                     </div>
//                   </TableHead>
//                   <TableHead
//                     className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                     onClick={() => onSort("month_hlCross")}
//                   >
//                     <div className="flex items-center justify-end gap-2">
//                       <span>Month HL Cross</span>
//                       {renderSortIcon("month_hlCross")}
//                     </div>
//                   </TableHead>
//                   <TableHead
//                     className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
//                     onClick={() => onSort("year_hlCross")}
//                   >
//                     <div className="flex items-center justify-end gap-2">
//                       <span>Year HL Cross</span>
//                       {renderSortIcon("year_hlCross")}
//                     </div>
//                   </TableHead>
//                 </>
//               )}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedStocks.map((stock) => (
//               <TableRow
//                 key={stock.symbol}
//                 className="cursor-pointer hover:bg-gray-50"
//                 onClick={() => onStockClick && onStockClick(stock)}
//               >
//                 <TableCell className="p-2 border-t sticky left-0 z-10 bg-white">
//                   <div className="flex items-center gap-2">
//                     <Image
//                       className="w-6 h-6 rounded-full"
//                       src={`/images/${stock.symbol}.svg`}
//                       alt={stock.companyname}
//                       width={20}
//                       height={20}
//                     />
//                     <div
//                       className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
//                       style={{ backgroundColor: getStockBgColor(stock.symbol), width: "7rem" }}
//                     >
//                       <span
//                         className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
//                         style={{
//                           paddingLeft: "4px",
//                           paddingRight: "4px",
//                           maxWidth: "100%",
//                           fontSize: stock.symbol.length > 10 ? "12px" : "14px",
//                         }}
//                       >
//                         {stock.symbol}
//                       </span>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell className="p-2 border-t truncate max-w-[200px]">{stock.companyname}</TableCell>
//                 <TableCell className="p-2 border-t text-right">₹{Number(stock.closeyest).toFixed(2)}</TableCell>
//                 <TableCell className="p-2 border-t text-right">₹{Number(stock.price).toFixed(2)}</TableCell>
//                 <TableCell className="p-2 border-t text-right">
//                   <span
//                     className={`inline-flex items-center rounded px-1 py-1 font-medium ${
//                       stock.change >= 0 ? "text-green-500 bg-green-50 rounded-lg" : "text-red-500 bg-red-50 rounded-lg"
//                     }`}
//                   >
//                     {stock.change >= 0 ? (
//                       <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
//                     ) : (
//                       <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
//                     )}
//                     {Number(stock.change).toFixed(2)}
//                   </span>
//                 </TableCell>
//                 <TableCell className="p-2 border-t text-right">
//                   <span
//                     className={`inline-flex items-center rounded px-1 py-1 font-medium ${
//                       stock.changepct >= 0
//                         ? "text-green-500 bg-green-50 rounded-lg"
//                         : "text-red-500 bg-red-50 rounded-lg"
//                     }`}
//                   >
//                     {stock.changepct >= 0 ? (
//                       <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
//                     ) : (
//                       <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
//                     )}
//                     {Number(stock.changepct).toFixed(2)}%
//                   </span>
//                 </TableCell>
//                 {spikeFilterOn && (
//                   <TableCell className="p-2 border-t text-right">
//                     <span
//                       className={`inline-flex items-center rounded px-1 py-1 font-medium ${
//                         (stock.volumespike ?? 0) >= 0
//                           ? "text-orange-600 bg-orange-100 rounded-lg"
//                           : "text-yellow-600 bg-yellow-100 rounded-lg"
//                       }`}
//                     >
//                       <Flame className="w-3.5 h-3.5 mr-0.5" />
//                       {Number(stock.volumespike).toFixed(2)}X
//                     </span>
//                   </TableCell>
//                 )}
//                 {highLowFilterOn && (
//                   <>
//                     <TableCell className="p-2 border-t text-right">{renderHLCrossValue(stock.today_hlCross ?? undefined)}</TableCell>
//                     <TableCell className="p-2 border-t text-right">{renderHLCrossValue(stock.month_hlCross ?? undefined)}</TableCell>
//                     <TableCell className="p-2 border-t text-right">{renderHLCrossValue(stock.year_hlCross ?? undefined)}</TableCell>
//                   </>
//                 )}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-between p-4">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-200 rounded-md"
//         >
//           Previous
//         </button>
//         <span>Page {currentPage}</span>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage * rowsPerPage >= sortedStocks.length}
//           className="px-4 py-2 bg-gray-200 rounded-md"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   )
// }

// export default IntrabuzzStockDataTable



"use client"

import type React from "react"
import { useMemo } from "react"
import { ArrowUp, ArrowDown, Flame, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
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
  | "today_hlCross"
  | "month_hlCross"
  | "year_hlCross"
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
          const hasValidHLCross = [stock.today_hlCross, stock.month_hlCross, stock.year_hlCross].some(
            (value) => value && value !== "-",
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
          sortColumn === "today_hlCross" ||
          sortColumn === "month_hlCross" ||
          sortColumn === "year_hlCross"
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

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>,
      )
    }

    return buttons
  }

  return (
    <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="overflow-auto max-h-[710px] bottom-b">
        <Table className="w-full border-collapse">
          <TableHeader className="sticky top-0 z-20 bg-blue-200 dark:bg-blue-900">
            <TableRow>
              <TableHead
                className="sticky left-0 z-30  bg-blue-200 dark:bg-blue-900 min-w-[160px] p-4 text-left font-medium cursor-pointer"
                onClick={() => onSort("symbol")}
              >
                <div className="flex items-center gap-2">
                  <span>Symbol</span>
                  {renderSortIcon("symbol")}
                </div>
              </TableHead>
              <TableHead
                className="p-4 text-left font-medium min-w-[200px] cursor-pointer"
                onClick={() => onSort("companyname")}
              >
                <div className="flex items-center gap-2">
                  <span>Company Name</span>
                  {renderSortIcon("companyname")}
                </div>
              </TableHead>
              <TableHead
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort("closeyest")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Previous Close</span>
                  {renderSortIcon("closeyest")}
                </div>
              </TableHead>
              <TableHead
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort("price")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Price</span>
                  {renderSortIcon("price")}
                </div>
              </TableHead>
              <TableHead
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort("change")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Change</span>
                  {renderSortIcon("change")}
                </div>
              </TableHead>
              <TableHead
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort("changepct")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Change %</span>
                  {renderSortIcon("changepct")}
                </div>
              </TableHead>
              {spikeFilterOn && (
                <TableHead
                  className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                  onClick={() => onSort("volumespike")}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span>Spike</span>
                    {renderSortIcon("volumespike")}
                  </div>
                </TableHead>
              )}
              {highLowFilterOn && (
                <>
                  <TableHead
                    className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                    onClick={() => onSort("today_hlCross")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Today HL Cross</span>
                      {renderSortIcon("today_hlCross")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                    onClick={() => onSort("month_hlCross")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Month HL Cross</span>
                      {renderSortIcon("month_hlCross")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                    onClick={() => onSort("year_hlCross")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Year HL Cross</span>
                      {renderSortIcon("year_hlCross")}
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
                className="cursor-pointer border rounded-md bg-white dark:bg-[#151719] hover:bg-gray-500 dark:hover:bg-muted/100"
                onClick={() => onStockClick && onStockClick(stock)}
              >
                <TableCell className="p-2 border-t sticky left-0 z-10 ">
                  <div className="flex items-center gap-2">
                    <Image
                      className="w-6 h-6 rounded-full"
                      src={`/images/${stock.symbol}.svg`}
                      alt={stock.companyname}
                      width={20}
                      height={20}
                    />
                    <div
                      className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
                      style={{ backgroundColor: getStockBgColor(stock.symbol), width: "7rem" }}
                    >
                      <span
                        className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
                        style={{
                          paddingLeft: "4px",
                          paddingRight: "4px",
                          maxWidth: "100%",
                          fontSize: stock.symbol.length > 10 ? "12px" : "14px",
                        }}
                      >
                        {stock.symbol}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-2 border-t truncate max-w-[200px] text-gray-900 dark:text-gray-100">
                  {stock.companyname}
                </TableCell>
                <TableCell className="p-2 border-t text-right text-gray-900 dark:text-gray-100">
                  ₹{Number(stock.closeyest).toFixed(2)}
                </TableCell>
                <TableCell className="p-2 border-t text-right text-gray-900 dark:text-gray-100">
                  ₹{Number(stock.price).toFixed(2)}
                </TableCell>
                <TableCell className="p-2 border-t text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      stock.change >= 0
                        ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50 rounded-lg"
                        : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50 rounded-lg"
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
                <TableCell className="p-2 border-t text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      stock.changepct >= 0
                        ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50 rounded-lg"
                        : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50 rounded-lg"
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
                  <TableCell className="p-2 border-t text-right">
                    <span
                      className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                        (stock.volumespike ?? 0) >= 0
                          ? "text-orange-600 bg-orange-100 rounded-lg"
                          : "text-yellow-600 bg-yellow-100 rounded-lg"
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 mr-0.5" />
                      {Number(stock.volumespike).toFixed(2)}X
                    </span>
                  </TableCell>
                )}
                {highLowFilterOn && (
                  <>
                    <TableCell className="p-2 border-t text-right">{renderHLCrossValue(stock.today_hlCross ?? undefined)}</TableCell>
                    <TableCell className="p-2 border-t text-right">{renderHLCrossValue(stock.month_hlCross ?? undefined)}</TableCell>
                    <TableCell className="p-2 border-t text-right">{renderHLCrossValue(stock.year_hlCross ?? undefined)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Updated Pagination Controls */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="sm">
          <ChevronLeft className="w-4 h-4 mr-2" />Previous
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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

