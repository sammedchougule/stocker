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


type FilterType = 'gainers' | 'losers' | 'most-active' | '52w-high' | '52w-low'

type LargeCapFilter = 'All' | 'Nifty50' | 'NiftyF&O' | 'NiftyAuto' | 'NiftyBank' | 
                      'NiftyConsumerDurables' | 'NiftyFinancialServices' | 'NiftyFmcg' | 
                      'NiftyHealthcare' |  'NiftyIt' | 'NiftyMedia' | 'NiftyMetal' | 'NiftyMidSmallHealthcare' | 
                      'NiftyOilGas' | 'NiftyPharma' | 'NiftyPrivateBank' | 'NiftyPsuBank' | 'NiftyRealty' | 'NiftyFinancialServices25/50'

const largeCapFilters: LargeCapFilter[] = ['All' , 'Nifty50' , 'NiftyF&O' , 'NiftyAuto' , 'NiftyBank', 
                                          'NiftyConsumerDurables' , 'NiftyFinancialServices' , 'NiftyFmcg' , 
                                          'NiftyHealthcare' ,  'NiftyIt' , 'NiftyMedia' , 'NiftyMetal' , 'NiftyMidSmallHealthcare' , 
                                          'NiftyOilGas' , 'NiftyPharma' , 'NiftyPrivateBank' , 'NiftyPsuBank' , 'NiftyRealty' , 'NiftyFinancialServices25/50']

const TodaysStocks = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('gainers')
  const [largeCapFilterIndex, setLargeCapFilterIndex] = useState(0)
  const { stocks, loading, error } = useStockContext()
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const largeCapFilter = largeCapFilters[largeCapFilterIndex]

  const filteredStocks = useMemo(() => {
    if (!stocks) return []
    
    let filtered = stocks
    if (largeCapFilter !== 'All') {
      filtered = stocks.filter(stock => stock.indices && stock.indices[largeCapFilter])
    }
    
    let sorted = [...filtered]
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
    return <div>Error: {error}</div>
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
              <div className="col-span-6 sm:col-span-5 text-center">STOCKS</div>
              <div className="col-span-3 sm:col-span-3 text-right">PRICE</div>
              <div className="col-span-3 sm:col-span-4 text-right">CHANGE</div>
            </div>
            {loading ? (
              renderSkeleton()
            ) : (
              <div className="divide-y">
                {filteredStocks.map((stock) => (
                  <div key={stock.symbol} className="grid grid-cols-12 gap-4 items-center py-3 px-2 sm:px-4 hover:bg-gray-100 cursor-pointer" onClick={() => handleStockClick(stock)}>
                    <div className="col-span-1 sm:col-span-1">
                      <div className=" flex items-center justify-center">
                        <Image
                          className='w-8 h-8 rounded-full'
                          src={`/images/${stock.symbol}.svg`}
                          alt={stock.companyname}
                          width={32}
                          height={32}
                          onError={(e) => {
                            e.target.src ='/images/nse.svg';
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-span-5 sm:col-span-4 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{stock.companyname}</div>
                      <div className="text-sm text-gray-500 truncate">{stock.symbol}</div>
                    </div>
                    <div className="col-span-3 sm:col-span-3 text-right">
                      <div className="font-medium text-gray-900">₹ {stock.price.toFixed(2)}</div>
                    </div>
                    <div className="col-span-3 sm:col-span-4 flex items-center justify-end gap-2">
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-1 ${
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
                        <span className="text-sm font-semibold">
                          {stock.changepct.toFixed(2)}%
                        </span>
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
      <div className="col-span-12 lg:col-span-6 flex flex-col">
    <Card className="h-full">
      <CardContent className="pt-6">
        {/* Market Mood Index */}
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Market Mood Index</h3>
          <p className="text-sm text-gray-500 mb-6">Know whats the sentiment on the street today</p>
          {/* Gauge Component */}
          <div className="relative w-full aspect-square">
            <svg viewBox="0 0 200 100" className="w-full">
              <path
                d="M20 80 A60 60 0 0 1 180 80"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M20 80 A60 60 0 0 1 180 80"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray="251"
                strokeDashoffset="50"
              />
              <text x="20" y="95" className="text-xs" fill="#9CA3AF">FEAR</text>
              <text x="85" y="30" className="text-xs" fill="#9CA3AF">GREED</text>
              <text x="150" y="95" className="text-xs" fill="#9CA3AF">EXTREME</text>
              <text x="100" y="65" className="text-2xl font-bold" fill="currentColor" textAnchor="middle">
                74.79
              </text>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-sm text-gray-500 mt-4">Updated 44 minutes ago</p>
        </div>
      </CardContent>
    </Card>
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

