// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect, useCallback } from "react"
// import type { Stock } from "@/types/Stock"

// interface StockContextType {
//   stocks: Stock[]
//   loading: boolean
//   error: string | null
//   setPollingInterval: (interval: number) => void
//   isLoading: boolean // Add this line
// }

// interface StockProviderProps {
//   children: React.ReactNode
//   initialData?: {
//     stocks: Stock[]
//     lastUpdated: string
//   }
// }

// const StockContext = createContext<StockContextType | undefined>(undefined)

// export function useStockContext() {
//   const context = useContext(StockContext)
//   if (context === undefined) {
//     throw new Error("useStockContext must be used within a StockProvider")
//   }
//   return context
// }

// export function StockProvider({ children, initialData }: StockProviderProps) {
//   const [stocks, setStocks] = useState<Stock[]>(initialData?.stocks || [])
//   const [loading, setLoading] = useState(!initialData)
//   const [error, setError] = useState<string | null>(null)
//   const [pollingInterval, setPollingInterval] = useState(600000) // Default to 10 minutes
//   const [isLoading, setIsLoading] = useState(!initialData) // Add this line

//   const fetchStocks = useCallback(async () => {
//     setIsLoading(true) // Set isLoading to true when fetching starts
//     try {
//       const res = await fetch(
//         "https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec",
//       )

//       if (!res.ok) {
//         throw new Error("Failed to fetch data")
//       }

//       const data = await res.json()
//       setStocks(data.data)
//       setLoading(false)
//       setError(null)
//     } catch (error) {
//       setError("Failed to fetch stock data")
//       setLoading(false)
//     } finally {
//       setIsLoading(false) // Set isLoading to false when fetching ends
//     }
//   }, [])

//   useEffect(() => {
//     if (!initialData) {
//       fetchStocks() // Initial fetch only if no initialData
//     }

//     const intervalId = setInterval(() => {
//       fetchStocks()
//     }, pollingInterval)

//     // Cleanup function to clear the interval when the component unmounts
//     return () => clearInterval(intervalId)
//   }, [fetchStocks, pollingInterval, initialData])

//   const contextValue: StockContextType = {
//     stocks,
//     loading,
//     error,
//     setPollingInterval,
//     isLoading, // Add this line
//   }

//   return <StockContext.Provider value={contextValue}>{children}</StockContext.Provider>
// }




// contexts/StockContext.tsx

"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Stock } from "@/types/Stock"

interface StockContextType {
  stocks: Stock[]
  loading: boolean
  error: string | null
  setPollingInterval: (interval: number) => void
  isLoading: boolean
}

interface StockProviderProps {
  children: React.ReactNode
  initialData?: Stock[] // Simplified initial data
}

const StockContext = createContext<StockContextType | undefined>(undefined)

export function useStockContext() {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error("useStockContext must be used within a StockProvider")
  }
  return context
}

export function StockProvider({ children, initialData }: StockProviderProps) {
  const [stocks, setStocks] = useState<Stock[]>(initialData || [])
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState(600000)
  const [isLoading, setIsLoading] = useState(!initialData)

  const fetchStocks = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stocks') // Use internal API route
      if (!res.ok) throw new Error("Failed to fetch data")
      const data = await res.json()
      setStocks(data)
      setError(null)
    } catch (error) {
      setError("Failed to fetch stock data")
    } finally {
      setLoading(false)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialData) fetchStocks()
    
    const intervalId = setInterval(fetchStocks, pollingInterval)
    return () => clearInterval(intervalId)
  }, [fetchStocks, pollingInterval, initialData])

  return (
    <StockContext.Provider value={{
      stocks,
      loading,
      error,
      setPollingInterval,
      isLoading
    }}>
      {children}
    </StockContext.Provider>
  )
}