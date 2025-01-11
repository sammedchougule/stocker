"use client";

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Flame, ArrowUp, ArrowDown } from 'lucide-react'
import { Stock } from '@/types/Stock'
import { getStockBgColor } from '@/utils/getstockBgColor';

interface StockCardProps {
  stock: Stock;
  onClick?: (stock: Stock) => void; // Make it optional if not always needed
}

const StockCard: React.FC<StockCardProps> = ({ 
  stock, 
  onClick 
}) => (
  <Card
    className="relative flex flex-col cursor-pointer transition-transform duration-300 transform hover:scale-105"
    onClick={() => onClick?.(stock)} // Optional chaining
    style={{
      boxShadow: stock.changepct >= 0
        ? '4px 4px 8px rgba(34, 197, 94, 0.5)' // green shadow
        : '4px 4px 8px rgba(239, 68, 68, 0.5)' // red shadow
    }}
  >
    <CardHeader>
      <div 
        className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
        style={{ backgroundColor: getStockBgColor(stock.symbol), width: '7rem' }}
        >
        <span 
          className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
          style={{
            paddingLeft: '4px',
            paddingRight: '4px',
            maxWidth: '100%',
            fontSize: (stock.symbol).length > 10 ? '12px' : '14px'
            }}
          >
          {stock.symbol}
        </span>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
        {stock.companyname}
      </h3>
    </CardContent>
    <CardFooter className="flex flex-col">
      <div className="text-xl font-semibold mb-1 w-full">
        <span>₹{Number(stock.price).toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center w-full">
        <div
          className={`flex items-center text-[15px] rounded px-1 py-1 font-medium ${
            stock.changepct >= 0
              ? 'text-green-500 bg-green-100 rounded-lg'
              : 'text-red-500 bg-red-100 rounded-lg'
          }`}
        >
          {stock.changepct >= 0 ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5" />
          )}
          {Number(stock.changepct).toFixed(2)}%
        </div> 
        <div
          className={`flex items-center px-1 py-1 rounded-md text-[15px] font-medium ${
            (stock.volumespike ?? 0) >= 0 ? 'text-orange-700 bg-orange-100' : 'text-yellow-700 bg-yellow-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{Number(stock.volumespike).toFixed(2) + 'X'}</span>
        </div>
      </div>
    </CardFooter>
  </Card>
);

export default StockCard;
