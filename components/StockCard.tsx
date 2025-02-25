// "use client"

// import type React from "react"
// import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
// import { Flame, ArrowUp, ArrowDown } from "lucide-react"
// import type { Stock } from "@/types/Stock"
// import { getStockBgColor } from "@/lib/getstockBgColor"

// interface StockCardProps {
//   stock: Stock
//   onClick?: (stock: Stock) => void
//   spikeFilterOn: boolean
//   highLowFilterOn: boolean
//   showChangePctOnly?: boolean
// }

// const StockCard: React.FC<StockCardProps> = ({
//   stock,
//   onClick,
//   spikeFilterOn,
//   highLowFilterOn,
//   showChangePctOnly = false,
// }) => {
//   // Don't render the card if highLowFilterOn is true and all HL values are "-"
//   if (
//     highLowFilterOn &&
//     (!stock.today_hlCross || stock.today_hlCross === "-") &&
//     (!stock.month_hlCross || stock.month_hlCross === "-") &&
//     (!stock.year_hlCross || stock.year_hlCross === "-")
//   ) {
//     return null
//   }

//   const renderHLValue = (value: string | null | undefined, type: string) => {
//     if (!value || value === "-") return null
//     const isHigh = value.includes("H")
//     return (
//       <div
//         key={type}
//         className={`flex items-center text-[15px] rounded px-1 py-1 font-medium ${
//           isHigh ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
//         }`}
//       >
//         {isHigh ? <ArrowUp className="w-3.5 h-3.5 mr-1" /> : <ArrowDown className="w-3.5 h-3.5 mr-1" />}
//         <span>{value}</span>
//       </div>
//     )
//   }

//   const renderHLValues = () => {
//     const hlValues = [
//       renderHLValue(stock.today_hlCross, "today"),
//       renderHLValue(stock.month_hlCross, "month"),
//       renderHLValue(stock.year_hlCross, "year"),
//     ].filter(Boolean)

//     return <div className="flex flex-col space-y-1">{hlValues}</div>
//   }

//   return (
//     <Card
//       className="relative flex flex-col cursor-pointer transition-transform duration-300 transform hover:scale-105"
//       onClick={() => onClick?.(stock)}
//       style={{
//         boxShadow: stock.changepct >= 0 ? "4px 4px 8px rgba(34, 197, 94, 0.5)" : "4px 4px 8px rgba(239, 68, 68, 0.5)",
//       }}
//     >
//       <CardHeader>
//         <div
//           className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
//           style={{ backgroundColor: getStockBgColor(stock.symbol), width: "7rem" }}
//         >
//           <span
//             className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
//             style={{
//               paddingLeft: "4px",
//               paddingRight: "4px",
//               maxWidth: "100%",
//               fontSize: stock.symbol.length > 10 ? "12px" : "14px",
//             }}
//           >
//             {stock.symbol}
//           </span>
//         </div>
//       </CardHeader>
//       <CardContent className="flex-grow">
//         <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">{stock.companyname}</h3>
//       </CardContent>
//       <CardFooter className="flex flex-col">
//         <div className="text-xl font-semibold mb-1 w-full">
//           <span>₹{Number(stock.price).toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between items-center w-full">
//           {showChangePctOnly ? (
//             <div
//               className={`flex items-center text-[15px] rounded px-1 py-1 font-medium ${
//                 stock.changepct >= 0 ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
//               }`}
//             >
//               {stock.changepct >= 0 ? (
//                 <ArrowUp className="w-3.5 h-3.5 mr-1" />
//               ) : (
//                 <ArrowDown className="w-3.5 h-3.5 mr-1" />
//               )}
//               {Number(stock.changepct).toFixed(2)}%
//             </div>
//           ) : highLowFilterOn ? (
//             renderHLValues()
//           ) : spikeFilterOn ? (
//             <div
//               className={`flex items-center px-1 py-1 rounded-md text-[15px] font-medium ${
//                 (stock.volumespike ?? 0) >= 0 ? "text-orange-700 bg-orange-100" : "text-yellow-700 bg-yellow-100"
//               }`}
//             >
//               <Flame className="w-4 h-4 mr-1" />
//               <span>{Number(stock.volumespike).toFixed(2)}X</span>
//             </div>
//           ) : (
//             <div
//               className={`flex items-center text-[15px] rounded px-1 py-1 font-medium ${
//                 stock.changepct >= 0 ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
//               }`}
//             >
//               {stock.changepct >= 0 ? (
//                 <ArrowUp className="w-3.5 h-3.5 mr-1" />
//               ) : (
//                 <ArrowDown className="w-3.5 h-3.5 mr-1" />
//               )}
//               {Number(stock.changepct).toFixed(2)}%
//             </div>
//           )}
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

// export default StockCard



"use client"

import type React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Flame, ArrowUp, ArrowDown } from "lucide-react"
import type { Stock } from "@/types/Stock"
import { getStockBgColor } from "@/lib/getstockBgColor"

interface StockCardProps {
  stock: Stock
  onClick?: (stock: Stock) => void
  spikeFilterOn: boolean
  highLowFilterOn: boolean
  showChangePctOnly?: boolean
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  onClick,
  spikeFilterOn,
  highLowFilterOn,
  showChangePctOnly = false,
}) => {
  // Don't render the card if highLowFilterOn is true and all HL values are "-"
  if (
    highLowFilterOn &&
    (!stock.today_hlCross || stock.today_hlCross === "-") &&
    (!stock.month_hlCross || stock.month_hlCross === "-") &&
    (!stock.year_hlCross || stock.year_hlCross === "-")
  ) {
    return null
  }

  const renderHLValue = (value: string | null | undefined, type: string) => {
    if (!value || value === "-") return null
    const isHigh = value.includes("H")
    return (
      <div
        key={type}
        className={`flex items-center text-[15px] rounded px-1 py-1 font-medium ${
          isHigh ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
        }`}
      >
        {isHigh ? <ArrowUp className="w-3.5 h-3.5 mr-1" /> : <ArrowDown className="w-3.5 h-3.5 mr-1" />}
        <span>{value}</span>
      </div>
    )
  }

  const renderHLValues = () => {
    const hlValues = [
      renderHLValue(stock.today_hlCross, "today"),
      renderHLValue(stock.month_hlCross, "month"),
      renderHLValue(stock.year_hlCross, "year"),
    ].filter(Boolean)

    return <div className="flex flex-col space-y-1">{hlValues}</div>
  }

  return (
    <Card
      className="relative flex flex-col cursor-pointer transition-transform duration-300 transform hover:scale-105 bg-white dark:bg-[#151719]"
      onClick={() => onClick?.(stock)}
      style={{
        boxShadow: stock.changepct >= 0 ? "4px 4px 8px rgba(34, 197, 94, 0.5)" : "4px 4px 8px rgba(239, 68, 68, 0.5)",
      }}
    >
      <CardHeader>
        <div
          className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
          style={{ backgroundColor: getStockBgColor(stock.symbol), width: "7rem" }}
        >
          <span
            className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
            style={{
              paddingLeft: "4px",
              paddingRight: "4px",
              maxWidth: "100%",
              fontSize: stock.symbol.length > 10 ? "12px" : "14px",
            }}
          >
            {stock.symbol}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
          {stock.companyname}
        </h3>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-xl font-semibold mb-1 w-full text-gray-900 dark:text-gray-100">
          <span>₹{Number(stock.price).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center w-full">
          {showChangePctOnly ? (
            <div
              className={`flex items-center text-[15px] rounded px-1 py-1 font-medium ${
                stock.changepct >= 0
                  ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50"
                  : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50"
              }`}
            >
              {stock.changepct >= 0 ? (
                <ArrowUp className="w-3.5 h-3.5 mr-1" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 mr-1" />
              )}
              {Number(stock.changepct).toFixed(2)}%
            </div>
          ) : highLowFilterOn ? (
            renderHLValues()
          ) : spikeFilterOn ? (
            <div
              className={`flex items-center px-1 py-1 rounded-md text-[15px] font-medium ${
                (stock.volumespike ?? 0) >= 0
                  ? "text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50"
                  : "text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50"
              }`}
            >
              <Flame className="w-4 h-4 mr-1" />
              <span>{Number(stock.volumespike).toFixed(2)}X</span>
            </div>
          ) : (
            <div
              className={`flex items-center text-[15px] rounded px-1 py-1 font-medium ${
                stock.changepct >= 0
                  ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50"
                  : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50"
              }`}
            >
              {stock.changepct >= 0 ? (
                <ArrowUp className="w-3.5 h-3.5 mr-1" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 mr-1" />
              )}
              {Number(stock.changepct).toFixed(2)}%
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default StockCard

