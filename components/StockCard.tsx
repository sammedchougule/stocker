// "use client";

// import React from 'react';
// import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
// import { Flame } from 'lucide-react'
// import { Stock } from '@/types/Stock'
// import StockSymbolBgColor from './StockSymbolBgColor';

// interface StockCardProps {
//   stock: Stock;
//   onClick: (stock: Stock) => void;
// }

// const StockCard: React.FC<StockCardProps> = ({ 
//   stock, 
//   onClick 
// }) => (
//   <Card 
//     className={`relative flex flex-col cursor-pointer transition-transform duration-300 transform hover:scale-105 shadow-md ${
//       stock.changepct >= 0 ? 'shadow-green-500' : 'shadow-red-500'
//     }`} 
//     onClick={() => onClick(stock)}
//   > 
//     <CardHeader>
//       <div className="flex justify-between items-center">
//         <StockSymbolBgColor symbol={stock.symbol} className="custom-class" />
//       </div>
//     </CardHeader>
//     <CardContent className="flex-grow">
//       <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
//         {stock.companyname}
//       </h3>
//     </CardContent>
//     <CardFooter className="flex flex-col">
//       <div className="text-xl font-semibold mb-1 w-full">
//         <span>
//           ₹{Number(stock.price).toFixed(2)}
//         </span>
//       </div>
//       <div className="flex justify-between items-center w-full">
//         <div className={`flex items-center px-1 py-1 rounded-md text-[15px] font-medium ${
//           stock.changepct >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
//         }`}>
//           {stock.changepct >= 0 ? '↑' : '↓'}{' '}
//           <span>
//             {Number(stock.changepct).toFixed(2) + '%'}
//           </span>
//         </div>
//         <div className={`flex items-center px-1 py-1 rounded-md text-[15px] font-medium ${
//           (stock.volumespike ?? 0) >= 0 ? 'text-orange-700 bg-orange-100' : 'text-yellow-700 bg-yellow-100'
//         }`}>
//           <Flame className="w-4 h-4"/><span>{Number(stock.volumespike).toFixed(2) + 'X'}</span>
//         </div>
//       </div>
//     </CardFooter>
//   </Card>
// )

// export default StockCard;

"use client";

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Flame } from 'lucide-react'
import { Stock } from '@/types/Stock'
import StockSymbolBgColor from './StockSymbolBgColor';

interface StockCardProps {
  stock: Stock;
  onClick: (stock: Stock) => void;
}

const StockCard: React.FC<StockCardProps> = ({ 
  stock, 
  onClick 
}) => (
  <Card 
    className={`relative flex flex-col cursor-pointer transition-transform duration-300 transform hover:scale-105 shadow-md ${
      stock.changepct >= 0 ? 'shadow-green-500' : 'shadow-red-500'
    }`} 
    onClick={() => onClick(stock)}
  > 
    <CardHeader>
      <div className="flex justify-between items-center">
        <StockSymbolBgColor symbol={stock.symbol} />
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
        {stock.companyname}
      </h3>
    </CardContent>
    <CardFooter className="flex flex-col">
      <div className="text-xl font-semibold mb-1 w-full">
        <span>
          ₹{Number(stock.price).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className={`flex items-center px-1 py-1 rounded-md text-[15px] font-medium ${
          stock.changepct >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
        }`}>
          {stock.changepct >= 0 ? '↑' : '↓'}{' '}
          <span>
            {Number(stock.changepct).toFixed(2) + '%'}
          </span>
        </div>
        <div className={`flex items-center px-1 py-1 rounded-md text-[15px] font-medium ${
          (stock.volumespike ?? 0) >= 0 ? 'text-orange-700 bg-orange-100' : 'text-yellow-700 bg-yellow-100'
        }`}>
          <Flame className="w-4 h-4"/><span>{Number(stock.volumespike).toFixed(2) + 'X'}</span>
        </div>
      </div>
    </CardFooter>
  </Card>
)

export default StockCard;