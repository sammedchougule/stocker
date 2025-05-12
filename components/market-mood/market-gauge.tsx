
"use client"

import { useEffect, useState } from "react"
import Gauge from "@/components/Gauge"
import type { Stock } from "@/types/Stock"
import CustomizedProgressBars from "../CustomizedProgressBars"

interface MarketMoodProps {
  stocks: Stock[]
}

export function MarketGauge({ stocks }: MarketMoodProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  console.log("Stocks received in Gauge:", stocks)


  if (!mounted) {
    return <div className="w-full h-[300px] flex items-center justify-center"><CustomizedProgressBars /></div>
  }

  return (
    <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
      <Gauge stocks={stocks} />
    </div>
  )
}
