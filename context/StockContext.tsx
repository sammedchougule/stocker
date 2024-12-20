'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Stock, StockData } from '@/types/Stock'

interface StockContextType {
  stocks: Stock[]
  loading: boolean
  error: string | null
  setPollingInterval: (interval: number) => void
  lastUpdated: Date | null
}

const StockContext = createContext<StockContextType | undefined>(undefined)

export function useStockContext() {
  const context = useContext(StockContext)
  if (context === undefined) {
    throw new Error('useStockContext must be used within a StockProvider')
  }
  return context
}

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState(60000) // Default to 1 minute
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStocks = useCallback(async () => {
    try {
      const cachedData = localStorage.getItem('stockData')
      const cachedTimestamp = localStorage.getItem('stockDataTimestamp')

      if (cachedData && cachedTimestamp) {
        const parsedData: StockData = JSON.parse(cachedData)
        const timestamp = new Date(cachedTimestamp)
        const now = new Date()
        
        // Use cached data if it's less than 5 minutes old
        if (now.getTime() - timestamp.getTime() < 1 * 60 * 1000) {
          setStocks(parsedData.data)
          setLastUpdated(timestamp)
          setLoading(false)
          return
        }
      }

      const res = await fetch('https://script.google.com/macros/s/AKfycbwiEg6IZArG2gqeW0B_m_WxYhXYon4XEqqA1Cz7ssgZ52u3b_uTC9RMQJ9UsC9yJhr-kQ/exec')
      
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const stockData: StockData = await res.json()
      setStocks(stockData.data)
      setLastUpdated(new Date())
      setLoading(false)
      setError(null)

      // Cache the new data
      localStorage.setItem('stockData', JSON.stringify(stockData))
      localStorage.setItem('stockDataTimestamp', new Date().toISOString())
    } catch (error) {
      setError('Failed to fetch stock data')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStocks() // Initial fetch

    const intervalId = setInterval(() => {
      fetchStocks()
    }, pollingInterval)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [fetchStocks, pollingInterval])

  const contextValue: StockContextType = {
    stocks,
    loading,
    error,
    setPollingInterval,
    lastUpdated
  }

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  )
}

