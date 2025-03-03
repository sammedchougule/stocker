
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




//TODO: Price history checking code

// app/page.tsx

import './globals.css';
import { StockProvider } from '@/contexts/StockContext';
import Indices from '@/components/Indices';
import TodayNews from '@/components/TodayNews';
import TodaysStocks from '@/components/TodayStocks';
// import { SubscriptionPlans } from '@/components/SubscriptionPlans';

export default async function Home() {

  return (
    <StockProvider >
      <div className="bg-white dark:bg-black min-h-screen flex flex-col gap-y-4">
        <Indices />
        <TodaysStocks />
        <TodayNews />
        {/* <SubscriptionPlans /> */}
      </div>
    </StockProvider>
  );
}




