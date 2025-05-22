"use client"
import { useState, useRef, useEffect, type TouchEvent } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import type { Stock } from "@/lib/utils/fetchStocks"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getSymbolColor } from "@/lib/utils/getSymbolColor"
import StockModal from "./StockModal"

interface IndicesProps {
  stocks: Stock[]
}

export default function Indices({ stocks }: IndicesProps) {
  // Filter out only INDEX type stocks and limit to 9
  const indexStocks = (stocks ?? []).filter((stock) => stock.type === "INDEX").slice(0, 9)

  // State for mobile slider
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Items per page on mobile
  const itemsPerPage = 3

  useEffect(() => {
    if (indexStocks.length > 0) {
      setTotalPages(Math.ceil(indexStocks.length / itemsPerPage))
    }
  }, [indexStocks])

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setIsTransitioning(true)
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setIsTransitioning(true)
      setCurrentPage(currentPage - 1)
    }
  }

  // Touch handlers for swiping
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      handleNext()
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      handlePrev()
    }
  }

  // Handle transition end
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
  }


  const handleIndexClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }


  return (
    <>
    <div className="bg-card rounded-lg p-6 shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sectoral Indices</h2>
        <Link href="/intrabuzz" className="text-blue-500 hover:underline text-sm">
          See All
        </Link>
      </div>

      {/* Desktop view - grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {indexStocks.map((index) => {
          const changeValue = Number.parseFloat(index.change)
          const changePctValue = Number.parseFloat(index.changepct)
          const isPositive = changeValue >= 0

          return (
            <div key={index.symbol} className="flex items-start gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors"
             onClick={() => handleIndexClick(index)}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1">
                <img
                  src={`/images/${index.symbol}.svg`}
                  alt={index.symbol}
                  className="w-8 h-8 object-contain rounded-full"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/no_image.jpeg';
                  }}
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate mr-2">{index.companyname}</h3>
                  <span className="font-bold whitespace-nowrap">{Number.parseFloat(index.price).toLocaleString()}</span>
                </div>
                <div className="flex justify-end mt-1">
                  <div
                    className={`text-sm flex items-center justify-center rounded px-2 py-1 font-semibold ${
                      isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(changePctValue).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile view - horizontal sliding carousel */}
      <div className="sm:hidden">
        <div className="relative">
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {/* Create groups of 3 indices */}
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0 space-y-4">
                  {indexStocks.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((index) => {
                    const changeValue = Number.parseFloat(index.change)
                    const changePctValue = Number.parseFloat(index.changepct)
                    const isPositive = changeValue >= 0

                    return (
                      <div key={index.symbol} className="flex items-start gap-3 cursor-pointer hover:bg-muted/100 p-2 rounded-md transition-colors"
                      onClick={() => handleIndexClick(index)}
                      >
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
                          style={{ backgroundColor: getSymbolColor(index.symbol) }}
                        >
                          <img
                            src={`/images/${index.symbol}.svg`}
                            alt={index.symbol}
                            className="w-7 h-7 object-contain rounded-full"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/no_image.jpeg';
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate mr-2">{index.companyname}</h3>
                            <span className="font-bold whitespace-nowrap">
                              {Number.parseFloat(index.price).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-end mt-1">
                            <div
                              className={`text-sm flex items-center justify-center rounded px-2 py-1 font-semibold ${
                                isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                              }`}
                            >
                              {isPositive ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(changePctValue).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${currentPage === index ? "bg-blue-500" : "bg-gray-400"}`}
                onClick={() => {
                  setIsTransitioning(true)
                  setCurrentPage(index)
                }}
                disabled={isTransitioning}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

    <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </>
  )
}
