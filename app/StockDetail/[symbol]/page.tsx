"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Stock } from "@/types/Stock";
import { useStockContext } from "@/context/StockContext";
import { StockChart } from "@/components/StockChart";
import StockCard from "@/components/StockCard";
import { format } from "date-fns";
import FinancialTables from "@/components/FinancialTables";

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { stocks } = useStockContext();
  const [stockData, setStockData] = useState<Stock | null>(null);
  const [similarStocks, setSimilarStocks] = useState<Stock[]>([]);

  useEffect(() => {
    if (stocks && stocks.length > 0) {
      const stock = stocks.find((s) => s.symbol === symbol);
      if (stock) {
        setStockData(stock);
        // Find similar stocks in the same sector
        const similar = stocks
          .filter(s => s.sector === stock.sector && s.symbol !== stock.symbol)
          .slice(0, 4);
        setSimilarStocks(similar);
      }
    }
  }, [stocks, symbol]);

  if (!stockData) {
    return (
      <div className="container mx-auto">
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b ml-4">
        <div>
          <div className="flex items-center gap-2">
            <a href="/" className="text-md text-gray-600">Home</a>
            <span className="text-md text-gray-800"> &gt; {stockData.symbol} • {stockData.exchange}</span>
          </div>
          <h1 className="text-2xl font-semibold mt-2">{stockData.companyname}</h1>
          <p className="text-md text-gray-600 mt-1">{stockData.sector}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-semibold">₹{Number(stockData.price).toFixed(2)}</span>
                  <div className={`flex items-center ${stockData.changepct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="text-lg font-semibold">
                      {stockData.changepct >= 0 ? '+' : ''}{Number(stockData.changepct).toFixed(2)}%
                    </span>
                    <span className="text-md ml-1 font-semibold">
                      ({stockData.change >= 0 ? '+' : ''}{Number(stockData.change).toFixed(2)} Today)
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(), "d MMM, HH:mm:ss")} IST {stockData.currency} • {stockData.exchange}
                </p>
              </div>

              {/* Chart */}
              <StockChart stock={stockData} />
            </CardContent>
          </Card>
        </div>

        {/* Stats Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="h-full">
              <div className="divide-y border-b">
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Previous Close</span>
                  <span className="font-medium">₹{Number(stockData.closeyest).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Day Range</span>
                  <span className="font-medium">₹{Number(stockData.low).toFixed(2)} - ₹{Number(stockData.high).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Year Range</span>
                  <span className="font-medium">₹{Number(stockData.low52).toFixed(2)} - ₹{Number(stockData.high52).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Market Cap</span>
                  <span className="font-medium">{Number(stockData.marketcap).toFixed(2)}T INR</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium">{(Number(stockData.volume) / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Avg. Volume</span>
                  <span className="font-medium">{(Number(stockData.volumeavg) / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">P/E Ratio</span>
                  <span className="font-medium">{Number(stockData.pe).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Dividend Yield</span>
                  <span className="font-medium">0.38%</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-gray-600">Primary Exchange</span>
                  <span className="font-medium">{stockData.exchange}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Stocks */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Compare To</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {similarStocks.map((stock, index) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              index={index}
              sortBy="changepct_desc"
              onClick={() => {
                window.location.href = `/StockDetail/${stock.symbol}`;
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-xl font-semibold">Financials</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
          <FinancialTables stockName={symbol} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

