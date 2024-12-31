"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Stock } from "@/types/Stock";
import { useStockContext } from "@/context/StockContext";
import { StockChart } from "@/components/StockChart";

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { stocks, loading, error } = useStockContext();
  const [stockData, setStockData] = useState<Stock | null>(null);

  useEffect(() => {
    if (stocks && stocks.length > 0) {
      const stock = stocks.find((s) => s.symbol === symbol);
      setStockData(stock || null);
    }
  }, [stocks, symbol]);

  if (loading) {
    return (
      <div className="container mx-auto mt-28">
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-28 p-4 text-center">
        <p className="text-lg">Error fetching stock data: {error}</p>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="container mx-auto mt-28 p-4 text-center">
        <p className="text-lg">Stock data not found for symbol: {symbol}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {stockData.symbol} - {stockData.exchange}
          </CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-2xl font-semibold">
              ₹{Number(stockData.price).toFixed(2)}
            </div>
            <div
              className={`flex items-center gap-1 ${
                stockData.changepct >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stockData.changepct >= 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="font-medium">
                {Number(stockData.changepct).toFixed(2)}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StockChart stock={stockData} />
        </CardContent>
      </Card>
    </div>
  );
}
