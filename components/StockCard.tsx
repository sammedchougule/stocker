"use client";

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/buttons'
import { CandlestickChartIcon as ChartCandlestick, Flame } from 'lucide-react'
import Link from 'next/link';
import { Stock } from '@/types/Stock'
import { AnimatedValue } from '@/components/AnimatedValue'

interface StockCardProps {
  stock: Stock;
  index: number;
  sortBy: string;
  stockAnimations: {
    priceDirection: 'up' | 'down' | null;
    changeDirection: 'up' | 'down' | null;
    volumespikeDirection: 'up' | 'down' | null;
  };
  onClick: (stock: Stock) => void;
}

const StockCard: React.FC<StockCardProps> = ({ 
  stock, 
  sortBy, 
  stockAnimations, 
  onClick 
}) => (
  <Card className="relative flex flex-col cursor-pointer" onClick={() => onClick(stock)}> 
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center" >
        <div className="w-28 px-3 py-1 rounded-md text-gray-800 font-medium text-sm flex items-center justify-center bg-gray-200">
          <span className="text-center whitespace-nowrap text-[13px] leading-none">
            {stock.symbol}
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pb-2 flex-grow">
      <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
        {stock.companyname}
      </h3>
    </CardContent>
    <CardFooter className="flex flex-col items-start pt-2">
    <div className="text-xl font-semibold mb-2 w-full">
        <AnimatedValue
          value={`₹${Number(stock.price).toFixed(2)}`}
          direction={stockAnimations.priceDirection}
        />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className={`flex items-center px-2 py-1 rounded-md text-sm font-medium ${
          (sortBy === 'changepct_asc' || sortBy === 'changepct_desc')
            ? (stock.changepct >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100')
            : ((stock.volumespike ?? 0) >= 0 ? 'text-orange-700 bg-orange-100' : 'text-yellow-700 bg-yellow-100')
        }`}>
          {(sortBy === 'changepct_asc' || sortBy === 'changepct_desc') ? (
            <>
              {stock.changepct >= 0 ? '↑' : '↓'}{' '}
              <AnimatedValue
                value={Number(stock.changepct).toFixed(2) + '%'}
                direction={stockAnimations.changeDirection}
              />
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 mr-1" />
              <AnimatedValue
                value={Number(stock.volumespike).toFixed(2) + 'X'}
                direction={stockAnimations.volumespikeDirection}
              />
            </>
          )}
        </div>

        <Link
          href={`https://in.tradingview.com/chart/0Xx4mWye/?symbol=NSE%3A${stock.symbol}`}
          target="_blank"
          rel="noopener noreferrer"
          passHref
          legacyBehavior
        >
          <a>
            <Button size="icon" className="hover:bg-gray-200">
              <ChartCandlestick className="h-6 w-6 text-gray-500"/>
            </Button>
          </a>
        </Link>
      </div>
    </CardFooter>
  </Card>
)

export default StockCard;

