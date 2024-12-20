'use client'

import { useState, useMemo } from 'react'
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
import { Plus, ArrowUp, ArrowDown } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

type SortOption = 
  | 'changepct_desc' 
  | 'changepct_asc' 
  | 'volumespike_desc' 
  | 'volumespike_asc' 

type FilterOption = 'all' | 'Nifty50' | 'NiftyBank' | 'NiftyIT' | 'NiftyAuto'

const COLORS = [
  'bg-[#4A5568]', 'bg-[#B8860B]', 'bg-[#0088CC]', 'bg-[#663399]',
  'bg-[#2F4F4F]', 'bg-[#8B4513]', 'bg-[#4B0082]', 'bg-[#006400]',
  'bg-[#800000]', 'bg-[#4A148C]'
]

export default function Intrabuzz() {
  const { stocks, loading } = useStockContext()
  const [sortBy, setSortBy] = useState<SortOption>('changepct_desc')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  const filteredAndSortedStocks = useMemo(() => {
    if (!stocks) return []

    let filtered = stocks.filter(stock => stock.type === 'EQ')

    if (filterBy !== 'all') {
      filtered = filtered.filter(stock => 
        stock.indices && stock.indices[filterBy as keyof typeof stock.indices]
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

  const getRandomColor = (symbol: string) => {
    const index = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return COLORS[index % COLORS.length]
  }

  const StockCard = ({ stock }: { stock: Stock }) => (
    <Card className="relative flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className={`w-28 px-3 py-1 rounded-md text-white font-medium text-sm flex items-center justify-center ${getRandomColor(stock.symbol)}`}>
            <span className="text-center whitespace-nowrap text-[13px] leading-none">
              {stock.symbol}
            </span>
          </div>
          <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
          {stock.companyname}
        </h3>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <div className="text-xl font-semibold mb-1">
          ₹{stock.price}
        </div>
        <div className="flex justify-between w-full">
          <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
            ${typeof stock.changepct === 'number'
              ? (stock.changepct >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50')
              : 'text-gray-700 bg-gray-50'
            }`}>
            {typeof stock.changepct === 'number' ? (
              <>
                {stock.changepct >= 0 ? '↑' : '↓'} {stock.changepct}%
              </>
            ) : 'N/A'}
          </div>
          <div className="text-xs font-medium text-gray-500">
            Vol: {(stock.volumespike * 100)}
          </div>
        </div>
      </CardFooter>
    </Card>
  )

  const SkeletonCard = () => (
    <Card className="relative flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Skeleton width={112} height={28} />
          <Skeleton circle width={36} height={36} />
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <Skeleton width="100%" height={40} />
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <Skeleton width={80} height={24} className="mb-1" />
        <Skeleton width={60} height={20} />
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          value={filterBy}
          onValueChange={(value: FilterOption) => setFilterBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stocks</SelectItem>
            <SelectItem value="Nifty50">Nifty 50</SelectItem>
            <SelectItem value="NiftyBank">Nifty Bank</SelectItem>
            <SelectItem value="NiftyIT">Nifty IT</SelectItem>
            <SelectItem value="NiftyAuto">Nifty Auto</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value: SortOption) => setSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="changepct_desc">
              <span className="flex items-center">
                <ArrowDown className="w-4 h-4 mr-2" />
                Change % 
              </span>
            </SelectItem>
            <SelectItem value="changepct_asc">
              <span className="flex items-center">
                <ArrowUp className="w-4 h-4 mr-2" />
                Change % 
              </span>
            </SelectItem>
            <SelectItem value="volumespike_desc">
              <span className="flex items-center">
                <ArrowDown className="w-4 h-4 mr-2" />
                Volume Spike 
              </span>
            </SelectItem>
            <SelectItem value="volumespike_asc">
              <span className="flex items-center">
                <ArrowUp className="w-4 h-4 mr-2" />
                Volume Spike 
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading
          ? Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)
          : filteredAndSortedStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))
        }
      </div>
    </div>
  )
}

