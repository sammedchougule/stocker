"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StockCard } from '@/components/StockCard';

const data = [
  { name: "00:00", uv: 400, pv: 2400, amt: 2400 },
  { name: "01:00", uv: 300, pv: 1398, amt: 2210 },
  { name: "02:00", uv: 200, pv: 9800, amt: 2290 },
  { name: "03:00", uv: 278, pv: 3908, amt: 2000 },
  { name: "04:00", uv: 189, pv: 4800, amt: 2181 },
  { name: "05:00", uv: 239, pv: 3800, amt: 2500 },
  { name: "06:00", uv: 349, pv: 4300, amt: 2100 },
  { name: "07:00", uv: 400, pv: 2400, amt: 2400 },
  { name: "08:00", uv: 300, pv: 1398, amt: 2210 },
  { name: "09:00", uv: 200, pv: 9800, amt: 2290 },
  { name: "10:00", uv: 278, pv: 3908, amt: 2000 },
  { name: "11:00", uv: 189, pv: 4800, amt: 2181 },
  { name: "12:00", uv: 239, pv: 3800, amt: 2500 },
  { name: "13:00", uv: 349, pv: 4300, amt: 2100 },
  { name: "14:00", uv: 400, pv: 2400, amt: 2400 },
  { name: "15:00", uv: 300, pv: 1398, amt: 2210 },
  { name: "16:00", uv: 200, pv: 9800, amt: 2290 },
  { name: "17:00", uv: 278, pv: 3908, amt: 2000 },
  { name: "19:00", uv: 189, pv: 4800, amt: 2181 },
  { name: "20:00", uv: 239, pv: 3800, amt: 2500 },
  { name: "21:00", uv: 349, pv: 4300, amt: 2100 },
];


export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol;
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
        <Skeleton className="h-full w-full" />
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
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-md">
            {stockData.symbol} - {stockData.exchange} 
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <div>
                <h4>{stockData.symbol}</h4>
            </div>
            <div
              className={`flex items-center gap-2 ${
                stockData.changepct >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <span className="font-medium text-xl">
                ₹{Number(stockData.price).toFixed(2)}
              </span>
              <span className="text-md font-semibold">
                {stockData.changepct >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-0.5" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-0.5" />
                )}
                {Number(stockData.changepct).toFixed(2)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex gap-8 flex-col md:flex-row">
          {/* Chart */}
          <div className="md:w-8/12">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Data */}
          <div className="md:w-4/12">
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Previous Close</TableCell>
                      <TableCell className="text-right">
                        ₹{Number(stockData.closeyest).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Day Range</TableCell>
                      <TableCell className="text-right">
                        ₹{Number(stockData.low).toFixed(2)} - ₹{Number(
                          stockData.high
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Year Range</TableCell>
                      <TableCell className="text-right">
                        ₹{Number(stockData.low52).toFixed(2)} - ₹{Number(
                          stockData.high52
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Market Cap</TableCell>
                      <TableCell className="text-right">
                        {Number(stockData.marketcap).toFixed(2)} INR
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        {/* Related Stocks Section */}
        <CardContent className="p-0">
          <CardHeader>
            <CardTitle>Related Stocks</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[200px]">
            <div className="flex gap-2 px-4">
                {stocks
                .filter((s) => s.indices && Array.isArray(s.indices) && Array.isArray(stockData.indices) && stockData.indices.length > 0 && s.indices.includes(stockData.indices[0]))
                .map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}