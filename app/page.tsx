
import './globals.css'
import { StockProvider } from '@/context/StockContext'
import Indices from '@/components/Indices'
import TodayNews from '@/components/TodayNews'
import TodaysStocks from '@/components/TodayStocks'
import { SubscriptionPlans } from '@/components/SubscriptionPlans'

export default  function Home() {
  

  return (
    <StockProvider>
        <Indices />
        <TodaysStocks />
        <TodayNews />
        <SubscriptionPlans />
    </StockProvider>
  )
}
