"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { fetchStocks, type Stock } from "@/lib/utils/fetchStocks"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import StockModal from "@/components/StockModal"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const [stocks, setStocks] = useState<Stock[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch stocks data
  useEffect(() => {
    const getStocks = async () => {
      setLoading(true)
      try {
        const data = await fetchStocks()
        // Filter out indices and only keep equity stocks
        const equityStocks = data.filter((stock) => stock.type === "EQ")
        setStocks(equityStocks)
      } catch (error) {
        console.error("Error fetching stocks:", error)
      } finally {
        setLoading(false)
      }
    }

    getStocks()
  }, [])

  // Filter stocks based on query
  useEffect(() => {
    if (query.length < 2) {
      setFilteredStocks([])
      setIsOpen(false)
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = stocks
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(lowerQuery) || stock.companyname.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 8) // Limit to 8 results for better UX

    setFilteredStocks(filtered)
    setIsOpen(filtered.length > 0)
    setSelectedIndex(-1)
  }, [query, stocks])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredStocks.length - 1 ? prev + 1 : prev))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleStockSelect(filteredStocks[selectedIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search stocks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        className="pl-10 bg-muted/50 border-muted focus-visible:bg-background"
      />

      {/* Dropdown results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-lg overflow-hidden max-h-[70vh] min-w-0 left-0 right-0"
          style={{ minWidth: 0 }}
        >
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : filteredStocks.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No results found</div>
          ) : (
            <ul className="max-h-[60vh] overflow-auto divide-y divide-border text-sm sm:text-base">
              {filteredStocks.map((stock, index) => {
                // Parse change percentage to determine color
                const changePercent = Number.parseFloat(stock.changepct)
                const isPositive = changePercent > 0
                const isNeutral = changePercent === 0

                return (
                  <li
                    key={stock.symbol}
                    className={cn(
                      "flex justify-between items-center p-2 cursor-pointer hover:bg-muted/50 border-b border-border last:border-0",
                      selectedIndex === index && "bg-muted/50",
                    )}
                    onClick={() => handleStockSelect(stock)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{stock.companyname}</span>
                      <span className="text-xs text-muted-foreground">
                        {stock.symbol} • NSE ({stock.type})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">{stock.price}</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          isPositive
                            ? "bg-green-500/20 text-green-500"
                            : isNeutral
                              ? "bg-gray-500/20 text-gray-500"
                              : "bg-red-500/20 text-red-500",
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {stock.changepct}%
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* Stock Modal */}
      <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
