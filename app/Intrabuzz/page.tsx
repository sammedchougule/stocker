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

import { Skeleton, SkeletonText, SkeletonCircle } from '@/components/ui/skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
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
//import { TradingViewModal } from '@/components/TradingViewModal'


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
      return newColor; // Return the new color
    }
  
    return "#ffffff"; // Default color if window is not available
  };
  
  // Function to generate a random hex color
  const generateRandomColor = (): string => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hex value
    return `#${randomHex.padStart(6, "0")}`; // Ensure 6 characters with padding
  };
  
  // Stock Details Modal
  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };


  // TradingViewChart Modal
  // const [isModalOpen, setModalOpen] = useState(false);
  // const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // const handleChartClick = (symbol: string) => {
  //   setSelectedSymbol(symbol);
  //   setModalOpen(true);
  // };

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
          <button
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              > {/* onClick={() => handleChartClick(stock.symbol)} */}
            <ChartCandlestick  className="w-5 h-5 text-gray-400" />
          </button>
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

  const SkeletonCard = () => (
    <Card className="relative flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Skeleton className="w-28 h-7 rounded-md" />
          <SkeletonCircle className="w-9 h-9" />
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <SkeletonText className="w-full h-10" />
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <SkeletonText className="w-20 h-6 mb-2" />
        <div className="flex justify-between items-center w-full">
          <Skeleton className="w-16 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
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
                <SelectItem value="Nifty Auto">Nifty Auto</SelectItem>
                <SelectItem value="Nifty Bank">Nifty Bank</SelectItem>
                  <SelectItem value="Nifty Financial Services">
                    Nifty Financial Services
                  </SelectItem>
                  <SelectItem value="Nifty FMCG">Nifty FMCG</SelectItem>
                  <SelectItem value="Nifty Healthcare">
                    Nifty Healthcare
                  </SelectItem>
                  <SelectItem value="Nifty IT">Nifty IT</SelectItem>
                  <SelectItem value="Nifty Media">Nifty Media</SelectItem>
                  <SelectItem value="Nifty Metal">Nifty Metal</SelectItem>
                  <SelectItem value="Nifty Pharma">Nifty Pharma</SelectItem>
                  <SelectItem value="Nifty PVT Bank">Nifty PVT Bank</SelectItem>
                  <SelectItem value="Nifty PSU Bank">Nifty PSU Bank</SelectItem>
                  <SelectItem value="Nifty Realty">Nifty Realty</SelectItem>
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

      {viewMode === 'card' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)
            : filteredAndSortedStocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))
          }
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change %</TableHead>
              <TableHead className="text-right">Volume Spike</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array(10).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><SkeletonCircle className="w-8 h-8" /></TableCell>
                  <TableCell><SkeletonText className="w-16 h-4" /></TableCell>
                  <TableCell><SkeletonText className="w-40 h-4" /></TableCell>
                  <TableCell className="text-right"><SkeletonText className="w-20 h-4 ml-auto" /></TableCell>
                  <TableCell className="text-right"><SkeletonText className="w-16 h-4 ml-auto" /></TableCell>
                  <TableCell className="text-right"><SkeletonText className="w-20 h-4 ml-auto" /></TableCell>
              </TableRow>
                ))
              : filteredAndSortedStocks.map((stock) => (
                  <TableRow className='cursor-pointer' key={stock.symbol} >  {/* onClick={() => handleStockClick(stock)} */}
                    <TableCell className="font-medium">
                      <Image
                        className='w-8 h-8 rounded-full'
                        src={`/images/${stock.symbol}.svg`}
                        alt={stock.companyname}
                        width={32}
                        height={32}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>{stock.companyname}</TableCell>
                    <TableCell className="text-right">₹{Number(stock.price).toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${stock.changepct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(stock.changepct).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">{((stock.volumespike ?? 0 ) * 100).toFixed(2)}</TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      )}

      <StockModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* TradingView Modal */}
      {/* {isModalOpen && selectedSymbol && (
        <TradingViewModal
          symbol={`NSE:${selectedSymbol}`}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )} */}
    </div> 
  )
}

function IntrabuzzSkeleton() {
  return (
    <div className="container mx-auto px-4 mt-24">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="w-[180px] h-10" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-[180px] h-10" />
          <Skeleton className="w-10 h-10" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array(10).fill(0).map((_, index) => (
          <Card key={index} className="relative flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Skeleton className="w-28 h-7 rounded-md" />
                <SkeletonCircle className="w-9 h-9" />
              </div>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <SkeletonText className="w-full h-10" />
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-2">
              <SkeletonText className="w-20 h-6 mb-2" />
              <div className="flex justify-between items-center w-full">
                <Skeleton className="w-16 h-6 rounded-md" />
                <Skeleton className="w-20 h-6 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Intrabuzz() {
  return (
    <Suspense fallback={<IntrabuzzSkeleton />}>
      <IntrabuzzContent />
    </Suspense>
  )
}
