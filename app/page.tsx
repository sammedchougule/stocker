// app/page.tsx

import Brokers from "@/components/Brokers"
import "./globals.css"
import Indices from "@/components/Indices"
import TodayNews from "@/components/TodayNews"
import TodaysStocks from "@/components/TodayStocks"
//import { SubscriptionPlans } from "@/components/SubscriptionPlans"
import { getStocks } from "@/lib/getStocks"
import { Suspense } from "react"

export default async function Home() {
  const stocks = await getStocks()

  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col gap-y-4">
      <Suspense fallback={<div>Loading Indices...</div>}>
        <Indices stocks={stocks} />
      </Suspense>
      <Suspense fallback={<div>Loading Todays Stocks...</div>}>
        <TodaysStocks stocks={stocks} />
      </Suspense>
      <TodayNews />
      < Brokers />
      
      {/* <SubscriptionPlans /> */}
    </div>
  )
}






