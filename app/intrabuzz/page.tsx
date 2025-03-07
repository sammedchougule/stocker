
"use client"

import { Metadata } from "next";
import { metadataConfig } from "@/lib/metadataConfig";

export const metadata: Metadata = {
  title: metadataConfig.intrabuzz.title,
  description: metadataConfig.intrabuzz.description,
  keywords: metadataConfig.intrabuzz.keywords.join(", "),
  openGraph: {
    ...metadataConfig.default.openGraph,
    title: metadataConfig.intrabuzz.title,
    description: metadataConfig.intrabuzz.description,
  },
};



import { useEffect, useState, useMemo, Suspense } from "react"
import { useStockContext } from "@/contexts/StockContext"
import type { Stock } from "@/types/Stock"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowDown, TableIcon, LayoutGrid, Flame, Percent } from "lucide-react"
import { StockModal } from "@/components/StockModal"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import StockCard from "@/components/StockCard"
import IntrabuzzStockDataTable from "@/components/IntrabuzzStockDataTable"
import CustomizedProgressBars from "@/components/CustomizedProgressBars"



type SortOption =
  | "changepct_desc"
  | "changepct_asc"
  | "volumespike_desc"
  | "volumespike_asc"
  | "today_hlCross_desc"
  | "today_hlCross_asc"

type FilterOption =
  | "all"
  | "Nifty 50"
  | "Nifty Bank"
  | "Nifty IT"
  | "Nifty Auto"
  | "Nifty FnO"
  | "Nifty Financial Services"
  | "Nifty FMCG"
  | "Nifty Healthcare"
  | "Nifty Media"
  | "Nifty Metal"
  | "Nifty Pharma"
  | "Nifty PVT Bank"
  | "Nifty PSU Bank"
  | "Nifty Realty"

type TableSortColumn =
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
type TableSortDirection = "asc" | "desc"

function IntrabuzzContent() {
  const { stocks, isLoading } = useStockContext()
  const searchParams = useSearchParams()

  const [sortBy, setSortBy] = useState<SortOption>(() => {
    if (typeof window !== "undefined") {
      const savedSort = localStorage.getItem("sortBy")
      return (savedSort as SortOption) || searchParams.get("sort") || "changepct_desc"
    }
    return "changepct_desc" // Default value for SSR
  })

  const [filterBy, setFilterBy] = useState<FilterOption>(() => {
    if (typeof window !== "undefined") {
      const savedFilter = localStorage.getItem("filterBy")
      return (savedFilter as FilterOption) || searchParams.get("filter") || "Nifty 50"
    }
    return "Nifty 50" // Default value for SSR
  })

  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableSortColumn, setTableSortColumn] = useState<TableSortColumn>("symbol")
  const [tableSortDirection, setTableSortDirection] = useState<TableSortDirection>("asc")
  const [spikeFilterOn, setSpikeFilterOn] = useState(false)
  const [highLowFilterOn, setHighLowFilterOn] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sortBy", sortBy)
      localStorage.setItem("filterBy", filterBy)
    }
  }, [sortBy, filterBy])

  const filteredAndSortedStocks = useMemo(() => {
    if (!stocks) return []

    let filtered = stocks.filter((stock) => stock.type === "EQ")

    if (filterBy !== "all") {
      filtered = filtered.filter((stock) => stock.indices && stock.indices[filterBy as keyof typeof stock.indices])
    } else {
      filtered = filtered.filter((stock) => stock.indices && stock.indices["Nifty 50"])
    }

    if (spikeFilterOn) {
      filtered = filtered.filter((stock) => (stock.volumespike ?? 0) > 0)
      filtered.sort((a, b) => (b.volumespike ?? 0) - (a.volumespike ?? 0))
    } else if (highLowFilterOn) {
      filtered.sort((a, b) => (Number(b.today_hlCross) ?? 0) - (Number(a.today_hlCross) ?? 0))
    } else {
      if (viewMode === "card") {
        switch (sortBy) {
          case "changepct_desc":
            filtered.sort((a, b) => b.changepct - a.changepct)
            break
          case "changepct_asc":
            filtered.sort((a, b) => a.changepct - b.changepct)
            break
          case "volumespike_desc":
            filtered.sort((a, b) => (b.volumespike ?? 0) - (a.volumespike ?? 0))
            break
          case "volumespike_asc":
            filtered.sort((a, b) => (a.volumespike ?? 0) - (b.volumespike ?? 0))
            break
          case "today_hlCross_desc":
            filtered.sort((a, b) => (Number(b.today_hlCross) ?? 0) - (Number(a.today_hlCross) ?? 0))
            break
          case "today_hlCross_asc":
            filtered.sort((a, b) => (Number(a.today_hlCross) ?? 0) - (Number(b.today_hlCross) ?? 0))
            break
        }
      } else {
        filtered.sort((a, b) => {
          let aValue = a[tableSortColumn]
          let bValue = b[tableSortColumn]

          if (typeof aValue === "string") aValue = aValue.toLowerCase()
          if (typeof bValue === "string") bValue = bValue.toLowerCase()

          if ((aValue ?? 0) < (bValue ?? 0)) return tableSortDirection === "asc" ? -1 : 1
          if ((aValue ?? 0) > (bValue ?? 0)) return tableSortDirection === "asc" ? 1 : -1
          return 0
        })
      }
    }

    return filtered
  }, [stocks, sortBy, filterBy, viewMode, tableSortColumn, tableSortDirection, spikeFilterOn, highLowFilterOn])

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const handleTableSort = (column: TableSortColumn) => {
    if (column === tableSortColumn) {
      setTableSortDirection(tableSortDirection === "asc" ? "desc" : "asc")
    } else {
      setTableSortColumn(column)
      setTableSortDirection("asc")
    }
  }

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 14

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 mt-10 sm:mt-4">
        <CustomizedProgressBars />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 mt-8 sm:mt-4">
      <div className="overflow-x-auto whitespace-nowrap flex items-center gap-4 mb-6">
        <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter by Index" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="Nifty FnO">All</SelectItem>
            <SelectItem value="Nifty 50">Nifty 50</SelectItem>
            <SelectItem value="Nifty Auto">Auto</SelectItem>
            <SelectItem value="Nifty Bank">Bank</SelectItem>
            <SelectItem value="Nifty Financial Services">Financials</SelectItem>
            <SelectItem value="Nifty FMCG">FMCG</SelectItem>
            <SelectItem value="Nifty Healthcare">Healthcare</SelectItem>
            <SelectItem value="Nifty IT">IT</SelectItem>
            <SelectItem value="Nifty Media">Media</SelectItem>
            <SelectItem value="Nifty Metal">Metal</SelectItem>
            <SelectItem value="Nifty Pharma">Pharma</SelectItem>
            <SelectItem value="Nifty PVT Bank">PVT Bank</SelectItem>
            <SelectItem value="Nifty PSU Bank">PSU Bank</SelectItem>
            <SelectItem value="Nifty Realty">Realty</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
  {/* Change Percentage Sorting */}
  <Button
    variant="outline"
    size="sm"
    className="flex items-center gap-1"
    onClick={() => setSortBy(sortBy === "changepct_desc" ? "changepct_asc" : "changepct_desc")}
  >
    Chg
    <Percent className="w-4 h-4" />
    {sortBy.startsWith("changepct") ? (
      sortBy === "changepct_desc" ? (
        <ArrowUp className="w-4 h-4 text-green-500" />
      ) : (
        <ArrowDown className="w-4 h-4 text-red-500" />
      )
    ) : (
      <ArrowUp className="w-4 h-4 text-gray-400" />
    )}
  </Button>

  {/* Spike Button */}
  <Button
    variant="outline"
    onClick={() => {
      setSpikeFilterOn(!spikeFilterOn);
      setHighLowFilterOn(false);
    }}
    className={`flex items-center gap-2 rounded-lg ${
      spikeFilterOn
        ? "text-orange-700 bg-orange-200 dark:bg-orange-600 dark:text-white"
        : "bg-gray-100 text-gray-500 dark:bg-[#151719] dark:text-gray-300"
    }`}
  >
    <span className="text-sm font-semibold">Spike</span>
    <Flame className="w-4 h-4" />
  </Button>

  {/* High-Low Button */}
  <Button
    variant="outline"
    onClick={() => {
      setHighLowFilterOn(!highLowFilterOn);
      setSpikeFilterOn(false);
    }}
    className={`flex items-center gap-2 rounded-lg ${
      highLowFilterOn
        ? "text-blue-700 bg-blue-200 dark:bg-blue-600 dark:text-white"
        : "bg-gray-100 text-gray-500 dark:bg-[#151719] dark:text-gray-300"
    }`}
  >
    <span className="text-sm font-semibold">High-Low</span>
  </Button>

  {/* View Mode Toggle */}
  <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}>
    {viewMode === "card" ? <TableIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
  </Button>
</div>

      </div>

      {stocks?.length === 0 ? (
        <div>
          <CustomizedProgressBars />
        </div>
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredAndSortedStocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={handleStockClick}
                  spikeFilterOn={spikeFilterOn}
                  highLowFilterOn={highLowFilterOn}
                />
              ))}
            </div>
          ) : (
            <>
              <IntrabuzzStockDataTable
                stocks={filteredAndSortedStocks}
                onStockClick={handleStockClick}
                onSort={handleTableSort}
                sortColumn={tableSortColumn}
                sortDirection={tableSortDirection}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                spikeFilterOn={spikeFilterOn}
                highLowFilterOn={highLowFilterOn}
              />
            </>
          )}
        </>
      )}

      <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default function Intrabuzz() {
  return (
    <Suspense fallback={<CustomizedProgressBars />}>
      <IntrabuzzContent />
    </Suspense>
  )
}


