// // app/stocks/page.tsx
// import { StockProvider } from '@/context/StockContext'
// import { Stock } from '@/types/Stock'

// export const revalidate = 60 // Revalidate every 60 seconds

// async function fetchStockData() {
//   const res = await fetch(
//     'https://script.google.com/macros/s/AKfycbwiEg6IZArG2gqeW0B_m_WxYhXYon4XEqqA1Cz7ssgZ52u3b_uTC9RMQJ9UsC9yJhr-kQ/exec'
//   )
//   const stockData = await res.json()
//   return {
//     stocks: stockData.data,
//     lastUpdated: new Date().toISOString(),
//   }
// }

// export default async function StocksPage() {
//   const initialData = await fetchStockData()

//   return (
//     <StockProvider initialData={initialData}>

//     </StockProvider>
//   )
// }
