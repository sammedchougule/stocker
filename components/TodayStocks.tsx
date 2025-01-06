'use client'

import { useState, useMemo } from 'react'
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown, Activity, Plus, ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useStockContext } from '@/context/StockContext'
import { Stock } from '@/types/Stock'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { StockModal } from './StockModal'
import Image from 'next/image';
import MarketMood from './MarketMood';
import { useStockAnimation } from '@/hooks/useStockAnimation'; 
import { AnimatedValue } from './AnimatedValue';

type FilterType = 'gainers' | 'losers' | 'most-active' | '52w-high' | '52w-low'

type LargeCapFilter = 
| 'All'
| 'Nifty Auto'
| 'Nifty Bank'
| 'Nifty IT'
| 'Nifty Metal'
| 'Nifty Pharma'

const largeCapFilters: LargeCapFilter[] = [
  'All',
  'Nifty Auto',
  'Nifty Bank',
  'Nifty IT',
  'Nifty Metal',
  'Nifty Pharma'
];

const TodaysStocks = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('gainers')
  const [largeCapFilterIndex, setLargeCapFilterIndex] = useState(0)
  const { stocks, loading, error } = useStockContext()
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const largeCapFilter = largeCapFilters[largeCapFilterIndex]

  const filteredStocks = useMemo(() => {
    if (!stocks) return []

    let filtered = stocks.filter(stock => stock.type === 'EQ')
    
    if (largeCapFilter !== 'All') {
      filtered = stocks.filter(stock => stock.indices && stock.indices[largeCapFilter])
    }
    
    const sorted = [...filtered] // let
    switch (activeFilter) {
      case 'gainers':
        return sorted.sort((a, b) => b.changepct - a.changepct).slice(0, 5)
      case 'losers':
        return sorted.sort((a, b) => a.changepct - b.changepct).slice(0, 5)
      case 'most-active':
        return sorted.sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5)
      case '52w-high':
        return sorted.filter(stock => stock.price >= stock.high52).slice(0, 5)
      case '52w-low':
        return sorted.filter(stock => stock.price <= stock.low52).slice(0, 5)
      default:
        return sorted.slice(0, 5)
    }
  }, [stocks, activeFilter, largeCapFilter])

  const cycleLargeCapFilter = () => {
    setLargeCapFilterIndex((prevIndex) => (prevIndex + 1) % largeCapFilters.length)
  }

    // Create an array of animation hooks for each possible sector (up to 9)
    const stockAnimations = filteredStocks.map((stock) => ({
      priceDirection: useStockAnimation(stock, ['price']),
      changeDirection: useStockAnimation(stock, ['change', 'changepct'])
    }));

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array(5)
        .fill(null)
        .map((_, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-4 items-center px-2 py-3">
            <div className="col-span-1 sm:col-span-1">
              <Skeleton circle width={32} height={32} />
            </div>
            <div className="col-span-5 sm:col-span-4 flex flex-col">
              <Skeleton width={100} height={20} />
              <Skeleton width={60} height={16} />
            </div>
            <div className="col-span-3 sm:col-span-3 text-right">
              <Skeleton width={60} height={20} />
            </div>
            <div className="col-span-3 sm:col-span-4 flex justify-end items-center gap-2">
              <Skeleton width={50} height={24} style={{ borderRadius: '0.5rem' }} />
              <Skeleton circle width={24} height={24} />
            </div>
          </div>
        ))}
    </div>
  )

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  if (error) {
    return (
      <div className="container mx-auto sm:px-6 lg:px-8">
      <Card className="bg-white">
        <CardContent>
          <p className="text-red-500 ">Error: {error}</p>
        </CardContent>
      </Card>
    </div>
    );
  }

  return (
    <div className="container mt-2 mx-auto sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 items-stretch">
      {/* Today's Stocks Section - 65% width on large screens */}
      <div className="w-full lg:w-[65%] flex flex-col">
        <Card>
          <CardHeader className="pb-4 px-2 sm:px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Today&apos;s stocks</h2>
              <button
                onClick={cycleLargeCapFilter}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 bg-transparent border-none cursor-pointer"
              >
                {largeCapFilter}
                <ListFilter className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant={activeFilter === 'gainers' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('gainers')}
                className={`flex items-center gap-2 ${
                  activeFilter === 'gainers' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900 border border-gray-300'
                }`}
              >
                {activeFilter === 'gainers' ? <ArrowUpIcon className="h-4 w-4 text-white" /> : <ArrowUpIcon className="h-4 w-4 text-green-500" />}
                Gainers
              </Button>
              <Button 
                variant={activeFilter === 'losers' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('losers')}
                className={`flex items-center gap-2 ${
                  activeFilter === 'losers' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900 border-gray-300 '
                }`}
              >
                {activeFilter === 'losers' ? <ArrowDownIcon className="h-4 w-4 text-white" /> : <ArrowDownIcon className="h-4 w-4 text-red-500" />}
                Losers
              </Button>
              <Button 
                variant={activeFilter === 'most-active' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('most-active')}
                className={`flex items-center gap-2 ${
                  activeFilter === 'most-active' 
                    ? 'bg-gray-700 text-white ' 
                    : 'bg-white text-gray-900  border-gray-300 '
                }`}
              >
                {activeFilter === 'most-active' ? <Activity className="h-4 w-4 text-white" /> : <Activity className="h-4 w-4" />}
                Most Active
              </Button>
              <Button 
                variant={activeFilter === '52w-high' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('52w-high')}
                className={`flex items-center gap-2 ${
                  activeFilter === '52w-high' 
                    ? 'bg-gray-700 text-white ' 
                    : 'bg-white text-gray-900  border border-gray-300 '
                }`}
              >
                {activeFilter === '52w-high' ? <TrendingUp className="h-4 w-4 text-white" /> : <TrendingUp className="h-4 w-4" />}
                52W High
              </Button>
              <Button 
                variant={activeFilter === '52w-low' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('52w-low')}
                className={`flex items-center gap-2 ${
                  activeFilter === '52w-low' 
                    ? 'bg-gray-700 text-white  ' 
                    : 'bg-white text-gray-900 border border-gray-300'
                }`}
              >
                {activeFilter === '52w-low' ? <TrendingDown className="h-4 w-4 text-white" /> : <TrendingDown className="h-4 w-4" />}
                52W Low
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-2 sm:px-6">
            <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-gray-500 px-2 sm:px-0">
              {/* Adjusted heading alignment and col span */}
              <div className="col-span-4 sm:col-span-4  text-left ">STOCKS</div>
              <div className="col-span-4 sm:col-span-4 text-right">PRICE</div>
              <div className="col-span-4 sm:col-span-4 text-right pr-2">CHANGE</div>
            </div>
            {loading ? (
              renderSkeleton()
            ) : (
              <div className="divide-y">
                {filteredStocks.map((stock, index) => (
                  <div key={stock.symbol} className="grid grid-cols-12 gap-4 items-center py-3 px-2 sm:px-4 hover:bg-gray-100 cursor-pointer" onClick={() => handleStockClick(stock)}>
                    {/* Adjusted Stock Info  col span */}
                    <div className="col-span-1 sm:col-span-1 flex items-center justify-center">
                        <Image
                          className='rounded-full'
                          width={32}
                          height={32}
                          src={`/images/${stock.symbol}.svg`}
                          alt={stock.companyname}
                        />
                    </div>
                    <div className="col-span-3 sm:col-span-3 min-w-0">
                      <div className="font-medium max-w-[120px]">{stock.symbol}</div>
                      <div className="text-sm text-gray-700 truncate">{stock.companyname}</div>
                    </div>
                    {/* Adjusted price and change col span */}
                    <div className="col-span-4 sm:col-span-4 text-right">
                    <AnimatedValue
                        value={`₹${Number(stock.price).toFixed(2)}`}
                        direction={stockAnimations[index].priceDirection}
                        className="font-medium"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-4 flex items-center justify-end gap-2 pr-2">
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-1 font-medium ${
                          stock.changepct >= 0
                            ? 'text-green-500 bg-green-50 rounded-lg'
                            : 'text-red-500 bg-red-50 rounded-lg'
                        }`}
                      >
                        {stock.changepct >= 0 ? (
                          <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5" />
                        ) : (
                          <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5" />
                        )}
                        <AnimatedValue
                          value={`${Number(stock.changepct).toFixed(2)}%`}
                          direction={stockAnimations[index].priceDirection}
                        />
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Mood Index Section - 35% width on large screens */}
      <div className="w-full lg:w-1/3">
        <MarketMood stocks={stocks} />
      </div>

      <StockModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default TodaysStocks

