
// import './globals.css'
// import { StockProvider } from '@/contexts/StockContext'
// import Indices from '@/components/Indices'
// import TodayNews from '@/components/TodayNews'
// import TodaysStocks from '@/components/TodayStocks'
// import TodayNewsData from '@/components/TodayNewsData'
// // import { SubscriptionPlans } from '@/components/SubscriptionPlans'


// export const revalidate = 60 // Revalidate every 60 seconds

// async function fetchStockData() {
//   const res = await fetch(
//     'https://script.google.com/macros/s/AKfycbwa3ZVL20X9vlqFfpi6KSteUsEecC9QpkY3V45sxVAmEQ5xeBBKSaCUyQejxrRbwE6wGw/exec'
//   )
//   const stockData = await res.json()
//   return {
//     stocks: stockData.data,
//     lastUpdated: new Date().toISOString(),
//   }
// }

// export default async function Home() {
//   const initialData = await fetchStockData()

//   return (
//     <StockProvider initialData={initialData}>
//         <Indices />
//         <TodaysStocks />
//         <TodayNewsData>{({ newsData }) => <TodayNews newsData={newsData} />}</TodayNewsData>
//         {/* <SubscriptionPlans /> */}
//     </StockProvider>
//   )
// }



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
      {/* <TodayNewsData>{({ newsData }) => <TodayNews newsData={newsData} />}</TodayNewsData> */}
      {/* <SubscriptionPlans /> */}
    </div>
  )
}






