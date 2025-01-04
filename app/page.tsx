import Indices from '@/components/Indices'
import TodaysStocks from '@/components/TodayStocks'
import FinancialTables from "@/components/FinancialTables"
// import { StockProvider } from '@/context/StockContext'

// export default function Home() {
//   return (
//     <main>
//       <StockProvider>    
//         <Indices />
//         <TodaysStocks />
//       </StockProvider>
//     </main>
//   )
// }


// app/stocks/page.tsx
import { StockProvider } from '@/context/StockContext'

export const revalidate = 60 // Revalidate every 60 seconds

async function fetchStockData() {
  const res = await fetch(
    'https://script.google.com/macros/s/AKfycbwa3ZVL20X9vlqFfpi6KSteUsEecC9QpkY3V45sxVAmEQ5xeBBKSaCUyQejxrRbwE6wGw/exec'
  )
  const stockData = await res.json()
  return {
    stocks: stockData.data,
    lastUpdated: new Date().toISOString(),
  }
}

export default async function Home() {
  const initialData = await fetchStockData()

  return (
    <StockProvider initialData={initialData}>
        <Indices />
        <TodaysStocks />
        <FinancialTables stockName="TATAMOTORS" />
    </StockProvider>
  )
}
