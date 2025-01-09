'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Stock, StockData } from '@/types/Stock'

interface StockContextType {
  stocks: Stock[]
  loading: boolean
  error: string | null // Explicitly specify the type here
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

export function StockProvider({
  children,
  initialData,
}: {
  children: React.ReactNode
  initialData?: { stocks: Stock[]; lastUpdated: string }
}) {
  const [stocks, setStocks] = useState<Stock[]>(initialData?.stocks || [])
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null) // Explicitly specify the type here
  const [pollingInterval, setPollingInterval] = useState(60000) // Default to 1 minute
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData?.lastUpdated ? new Date(initialData.lastUpdated) : null
  )

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbwa3ZVL20X9vlqFfpi6KSteUsEecC9QpkY3V45sxVAmEQ5xeBBKSaCUyQejxrRbwE6wGw/exec'
      )
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const stockData: StockData = await res.json()
      setStocks(stockData.data)
      setLastUpdated(new Date())
      setLoading(false)
      setError(null)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message) // Ensure the error is an instance of Error
      } else {
        setError('An unknown error occurred')
      }
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialData) {
      fetchStocks() // Initial fetch only if no initial data is provided
    }

    const intervalId = setInterval(() => {
      fetchStocks()
    }, pollingInterval)

    return () => clearInterval(intervalId)
  }, [fetchStocks, pollingInterval, initialData])

  const contextValue: StockContextType = {
    stocks,
    loading,
    error,
    setPollingInterval,
    lastUpdated,
  }

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  )
}
