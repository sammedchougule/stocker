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
import { useStockContext } from "@/contexts/StockContext";
import { StockChart } from "@/components/StockChart";
import StockCard from "@/components/StockCard";
import { format } from "date-fns";
import FinancialTables from "@/components/FinancialTables";
import Link from "next/link";
import CustomizedProgressBars from "@/components/CustomizedProgressBars";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { stocks } = useStockContext();
  const [stockData, setStockData] = useState<Stock | null>(null);
  const [similarStocks, setSimilarStocks] = useState<Stock[]>([]);

  useEffect(() => {
    if (stocks?.length) {
      const stock = stocks.find((s) => s.symbol === symbol);
      if (stock) {
        setStockData(stock);
        setSimilarStocks(
          stocks.filter(s => s.sector === stock.sector && s.symbol !== stock.symbol).slice(0, 6)
        );
      }
    }
  }, [stocks, symbol]);

  if (!stockData) return <div className="container mx-auto"><CustomizedProgressBars /></div>;

  return (
    <div className="container mx-auto space-y-4 mt-4 sm:mt-2">
      {/* Header */}
      <Card className="flex justify-between items-center border-b bg-white dark:bg-[#151719] p-3">
        <CardContent className="w-full flex justify-between items-center p-0">
          {/* Left Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Link href="/" className="text-md text-gray-900 dark:text-gray-100 hover:text-blue-500">
                Home
              </Link>
              <span className="text-sm text-gray-900 dark:text-gray-300">
                &gt; {stockData.symbol} • {stockData.exchange}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Image
                className="w-8 h-8 rounded-full"
                src={`/images/${stockData.symbol}.svg`}
                alt={stockData.companyname}
                width={32}
                height={32}
              />
              <p className="text-lg font-semibold">{stockData.companyname}</p>
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: stockData.companyname,
                  url: window.location.href,
                });
              } else {
                alert("Sharing is not supported in this browser.");
              }
            }}
            className="flex items-center gap-2 px-3 py-2 text-md rounded-md transition"
          >
            <Share2 />
          </Button>
        </CardContent>
      </Card>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#151719]">
          <CardContent>
            <div className="mb-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold">₹{Number(stockData.price).toFixed(2)}</span>
                <div className={`flex items-center ${stockData.changepct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="text-md font-semibold">{stockData.changepct >= 0 ? '+' : ''}{Number(stockData.changepct).toFixed(2)}%</span>
                  <span className="text-md ml-1 font-semibold">({stockData.change >= 0 ? '+' : ''}{Number(stockData.change).toFixed(2)} Today)</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{format(new Date(), "d MMM, HH:mm:ss")} IST {stockData.currency} • {stockData.exchange}</p>
            </div>
            <StockChart stock={stockData} />
          </CardContent>
        </Card>

        {/* Stats Panel */}
        <Card className="bg-white dark:bg-[#151719]">
          <CardContent>
            <div className="divide-y border-b">
              {[
                ['Previous Close', stockData.closeyest],
                ['Day Range', `${stockData.low} - ${stockData.high}`],
                ['Year Range', `${stockData.low52} - ${stockData.high52}`],
                ['Market Cap', `${Number(stockData.marketcap).toFixed(2)}T INR`],
                ['Volume', `${(Number(stockData.volume) / 1_000_000).toFixed(2)}M`],
                ['Avg. Volume', `${(Number(stockData.volumeavg) / 1_000_000).toFixed(2)}M`],
                ['P/E Ratio', stockData.pe],
                ['Dividend Yield', '0.38%'],
                ['Primary Exchange', stockData.exchange]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between p-4">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium">
                    {/* Check if value is a number before formatting */}
                    {typeof value === 'number' ? `₹${Number(value).toFixed(2)}` : value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Similar Stocks */}
      <Card className="bg-white dark:bg-[#151719]">
        <CardHeader>
          <h2 className="text-xl font-semibold">Compare To</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarStocks.length ? similarStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} highLowFilterOn={false} spikeFilterOn={true} showChangePctOnly={true} onClick={() => window.location.href = `/stockdetail/${stock.symbol}`} />
            )) : Array(4).fill(<Skeleton className="h-24 w-full" />)}
          </div>
        </CardContent>
      </Card>

      {/* Financials */}
      <Card className="bg-white dark:bg-[#151719]">
        <CardHeader>
          <CardTitle>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Financials of {stockData.companyname}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialTables stockName={symbol} />
        </CardContent>
      </Card>
    </div>
  );
}

