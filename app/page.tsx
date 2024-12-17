import Indices from '@/components/Indices'
import TodaysStocks from '@/components/TodayStocks'
import { StockProvider } from '@/context/StockContext'

export default function Home() {
  return (
    <main>
      <StockProvider>    
        <Indices />
        <TodaysStocks />
      </StockProvider>
    </main>
  )
}

