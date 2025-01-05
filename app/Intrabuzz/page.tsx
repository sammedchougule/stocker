'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useStockContext } from '@/context/StockContext'
import { Stock } from '@/types/Stock'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartCandlestick , ArrowUp, ArrowDown, TableIcon, LayoutGrid, Flame, Percent } from 'lucide-react'
import { StockModal } from '@/components/StockModal';
import { Button } from '@/components/ui/buttons'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link'

type SortOption = 
  | 'changepct_desc' 
  | 'changepct_asc' 
  | 'volumespike_desc' 
  | 'volumespike_asc' 

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
| "Nifty Realty";

function IntrabuzzContent() {
  const { stocks, loading } = useStockContext()
  const searchParams = useSearchParams()

  const [sortBy, setSortBy] = useState<SortOption>(() => {
    if (typeof window !== 'undefined') {
      const savedSort = localStorage.getItem('sortBy')
      return (savedSort as SortOption) || searchParams.get('sort') || 'changepct_desc'
    }
    return 'changepct_desc' // Default value for SSR
  })

  const [filterBy, setFilterBy] = useState<FilterOption>(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = localStorage.getItem('filterBy')
      return (savedFilter as FilterOption) || searchParams.get('filter') || 'Nifty FnO'
    }
    return 'Nifty FnO' // Default value for SSR
  })

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sortBy', sortBy)
      localStorage.setItem('filterBy', filterBy)
    }
  }, [sortBy, filterBy])
    
  const filteredAndSortedStocks = useMemo(() => {
    if (!stocks) return []

    let filtered = stocks.filter(stock => stock.type === 'EQ')

    if (filterBy !== 'all') {
      filtered = filtered.filter(stock => 
        stock.indices && stock.indices[filterBy as keyof typeof stock.indices]
      )
    } else {
      filtered = filtered.filter(stock => 
        stock.indices && (
          stock.indices["Nifty 50"]
        )
      )
    }

    switch (sortBy) {
      case 'changepct_desc':
        filtered.sort((a, b) => b.changepct - a.changepct)
        break
      case 'changepct_asc':
        filtered.sort((a, b) => a.changepct - b.changepct)
        break
      case 'volumespike_desc':
        filtered.sort((a, b) => (b.volumespike || 0) - (a.volumespike || 0))
        break
      case 'volumespike_asc':
        filtered.sort((a, b) => (a.volumespike || 0) - (b.volumespike || 0))
        break
    }

    return filtered
  }, [stocks, sortBy, filterBy])
  
  //TODO Generating Random BG Color For symbols
  const getRandomColor = (symbol: string): string => {
    if (typeof window !== "undefined") {
      // Check if the color for the symbol is already stored in localStorage
      const cachedColor = localStorage.getItem(symbol);
      if (cachedColor) {
        return cachedColor; // Return the cached color from localStorage
      }
  
      // Generate a new random color (excluding black) and store it
      let newColor;
      do {
        newColor = generateRandomColor();
      } while (newColor === "#000000"); // Ensure it's not black
  
      localStorage.setItem(symbol, newColor); // Store the generated color in localStorage
      return newColor; 
    }
  
    return "#ffffff"; 
  };
  
  // Function to generate a random hex color
  const generateRandomColor = (): string => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16); 
    return `#${randomHex.padStart(6, "0")}`; 
  };
  
  // Stock Details Modal
  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  //Pagination for table
  const ITEMS_PER_PAGE = 10; // Number of rows per page

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indices for slicing the data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Get the current page's data
  const currentTableData = filteredAndSortedStocks.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedStocks.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const StockCard = ({ stock }: { stock: Stock }) => (
    <Card className="relative flex flex-col cursor-pointer" onClick={() => handleStockClick(stock)}> 
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center" >
          <div className="w-28 px-3 py-1 rounded-md text-white font-medium text-sm flex items-center justify-center"
            style={{ backgroundColor: getRandomColor(stock.symbol) }}
          >
            <span className="text-center whitespace-nowrap text-[13px] leading-none">
              {stock.symbol}
            </span>
          </div>
          <Link
              href={`https://in.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="icon" className="hover:bg-gray-200">
                <ChartCandlestick className="h-6 w-6 text-gray-700 hover:text-blue-500" />
              </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
          {stock.companyname}
        </h3>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <div className="text-xl font-semibold mb-2 w-full">
          ₹{Number(stock.price).toFixed(2)}
        </div>
        <div className="flex justify-between items-center w-full">
          {(sortBy === 'changepct_asc' || sortBy === 'changepct_desc') ? (
            <div className={`flex items-center px-2 py-1 rounded-md text-sm font-medium
              ${(stock.changepct >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100')}`}>
              {stock.changepct >= 0 ? '↑' : '↓'} {Number(stock.changepct).toFixed(2)}%
            </div>
          ) : (
            <div className="flex items-center px-2 py-1 rounded-md text-sm font-medium text-yellow-700 bg-yellow-100">
              <Flame className="w-4 h-4 mr-1" /> {Number(stock.volumespike).toFixed(2)}X
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-4 mb-6">
        <Select
          value={filterBy}
          onValueChange={(value: FilterOption) => setFilterBy(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter by Index" />
          </SelectTrigger>
          <SelectContent>
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
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSortBy(sortBy === 'changepct_desc' ? 'changepct_asc' : 'changepct_desc')}
          >
            <Percent className="w-4 h-4" />
            {sortBy.startsWith('changepct') && (
              sortBy === 'changepct_desc' ? (
                <ArrowDown className="w-4 h-4 font-extrabold text-green-500" />
              ) : (
                <ArrowUp className="w-4 h-4 font-extrabold text-red-500" />
              )
            )}
            {!sortBy.startsWith('changepct') && (
              <ArrowDown className="w-4 h-4 text-gray-400" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSortBy(sortBy === 'volumespike_desc' ? 'volumespike_asc' : 'volumespike_desc')}
          >
            <Flame className="w-4 h-4" />
            {sortBy.startsWith('volumespike') && (
              sortBy === 'volumespike_desc' ? (
                <ArrowDown className="w-4 h-4 font-extrabold text-green-500" />
              ) : (
                <ArrowUp className="w-4 h-4 font-extrabold text-red-500" />
              )
            )}
            {!sortBy.startsWith('volumespike') && (
              <ArrowDown className="w-4 h-4  text-gray-400" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
          >
            {viewMode === 'card' ? <TableIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <>
      {viewMode === 'card' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredAndSortedStocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
        </div>
      ) : (
        <>
          <Table className='border'>
            <TableHeader className='bg-blue-200'>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead className="text-right">Previous Close</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Change %</TableHead>
                <TableHead className="text-right">Vol_Spike</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTableData.map((stock) => (
                    <TableRow className="cursor-pointer" key={stock.symbol}>
                      <TableCell className="font-medium flex items-center gap-2">
                      <Image
                          className="w-6 h-6 rounded-full"
                          src={`/images/${stock.symbol}.svg`}
                          alt={stock.companyname}
                          width={20}
                          height={20}
                        />
                        {stock.symbol}
                      </TableCell>
                      <TableCell className='truncate max-w-[100px]'>{stock.companyname}</TableCell>
                      <TableCell className="text-right">₹{Number(stock.closeyest).toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{Number(stock.price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center rounded px-1 py-1 ${
                            stock.change >= 0
                              ? 'text-green-500 bg-green-50 rounded-lg'
                              : 'text-red-500 bg-red-50 rounded-lg'
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                          )}
                          <span className="text-sm font-md">
                            {stock.change}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center rounded px-1 py-1 ${
                            stock.changepct >= 0
                              ? 'text-green-500 bg-green-50 rounded-lg'
                              : 'text-red-500 bg-red-50 rounded-lg'
                          }`}
                        >
                          {stock.changepct >= 0 ? (
                            <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                          )}
                          <span className="text-sm font-md">
                            {stock.changepct}%
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center rounded px-1 py-1 ${
                            (stock.volumespike ?? 0) >= 0
                              ? 'text-orange-600 bg-orange-100 rounded-lg'
                              : 'text-yellow-600 bg-yellow-100 rounded-lg'
                          }`}
                        ><Flame className="w-3.5 h-3.5 mr-0.5" />
                          <span className="text-sm font-md">
                          {Number(stock.volumespike).toFixed(2)}X
                          </span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>

      <StockModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div> 
  )
}


export default function Intrabuzz() {
  return (
    <Suspense>
      <IntrabuzzContent />
    </Suspense>
  )
}
