
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
// import StockPriceTracker from '@/components/StockPriceTracker'; // Import the StockPriceTracker

// Revalidate every 60 seconds
export const revalidate = 60;

// fetching stocks data
async function fetchStockData() {
  const res = await fetch(
    'https://script.google.com/macros/s/AKfycbwa3ZVL20X9vlqFfpi6KSteUsEecC9QpkY3V45sxVAmEQ5xeBBKSaCUyQejxrRbwE6wGw/exec'
  );
  const stockData = await res.json();
  return {
    stocks: stockData.data,
    lastUpdated: new Date().toISOString(),
  };
}

// fetching stocks data
async function fetchStockNews() {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const url = `https://newsapi.org/v2/everything?q=stock+market+india&from=${twoWeeksAgo}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch stock news")
  }

  const data = await response.json()
  return data.articles
}

export default async function Home() {
  const initialData = await fetchStockData();
  const stockNews = await fetchStockNews()

  return (
    <StockProvider initialData={initialData}>
      <Indices />
      <TodaysStocks />
      <TodayNews stockNews={stockNews} />

      {/* Add the StockPriceTracker Component and pass stock data */}
      {/* <StockPriceTracker newStockData={initialData.stocks} /> */}
    </StockProvider>
  );
}
