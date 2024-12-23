import Indices from '@/components/Indices'
import TodaysStocks from '@/components/TodayStocks'
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
    'https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec'
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
    </StockProvider>
  )
}
