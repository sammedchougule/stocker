import type React from "react"
import { useState, useEffect } from "react"
import { getStocks } from "@/lib/getStocks" // Import getStocks function
import type { Stock } from "@/types/Stock"

const StockInput: React.FC = () => {
  const [query, setQuery] = useState("")
  const [stocks, setStocks] = useState<Stock[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true)
      const fetchedStocks = await getStocks()
      setStocks(fetchedStocks)
      setLoading(false)
    }

    fetchStocks()
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      const results = stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.companyname.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredStocks(results)
    } else {
      setFilteredStocks([])
    }
  }, [query, stocks])

  if (loading) {
    return <div>Loading stocks...</div> // Optional loading state
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by stock symbol or company name..."
        className="flex h-8 w-full sm:w-48 md:w-64 lg:w-[28rem] bg-gray-100 dark:bg-[#151719] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {filteredStocks.length > 0 && (
        <ul className="absolute z-10 w-full sm:w-48 md:w-64 lg:w-[28rem] bg-white dark:bg-[#151719] border border-gray-300 dark:border-gray-700 rounded-md mt-2 max-h-80 overflow-y-auto shadow-lg scrollbar-hide">
          {filteredStocks.map((stock) => (
            <li
              key={stock.symbol}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 flex justify-between items-center"
              onClick={() => {
                window.location.href = `/stockdetail/${stock.symbol}`
              }}
            >
              <div>
                <div className="font-medium text-[16px] text-gray-800 dark:text-gray-200">{stock.companyname}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stock.symbol} • {stock.exchange} ({stock.type})
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <div className="text-sm text-gray-800 dark:text-gray-200">{stock.price}</div>
                <div
                  className={`text-sm ${
                    stock.changepct >= 0 ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                  } rounded-md px-2 py-1`}
                >
                  {stock.changepct}% 
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { StockInput }
