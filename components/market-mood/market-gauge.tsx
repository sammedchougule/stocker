"use client"

import { useEffect, useState } from "react"

export function MarketGauge({ value = 72 }: { value?: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-[300px] flex items-center justify-center">Loading gauge...</div>
  }

  // This is a placeholder component - you will add your own gauge design here
  return (
    <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full">
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className="text-4xl font-bold">{value}</div>
        <div className="text-lg font-medium text-emerald-500">
          {value > 70 ? "Bullish" : value > 30 ? "Neutral" : "Bearish"}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">Add your custom gauge design here</div>
      </div>
    </div>
  )
}
