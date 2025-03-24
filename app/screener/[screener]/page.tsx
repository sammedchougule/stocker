"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getStocks } from "@/lib/getStocks";
import type { Stock } from "@/types/Stock";
import CustomizedProgressBars from "@/components/CustomizedProgressBars";

export default function ScreenerDetail() {
  const { screener } = useParams();
  const [showHigh, setShowHigh] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<keyof Stock | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchStocks() {
      setLoading(true);
      try {
        const data = await getStocks();
        setStocks(data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter((stock) =>
    showHigh ? stock.near52WHigh === "Yes" : stock.near52WLow === "Yes"
  );

  const calculateNearPercentage = (stock: Stock): number => {
    const { high52, low52, price } = stock;
    return showHigh
      ? ((high52 - price) / high52) * 100
      : ((price - low52) / low52) * 100;
  };

  const handleSort = (column: keyof Stock) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = sortColumn === "price" ? Number(a[sortColumn]) : a[sortColumn];
    const valueB = sortColumn === "price" ? Number(b[sortColumn]) : b[sortColumn];

    if ((valueA ?? 0) < (valueB ?? 0)) return sortOrder === "asc" ? -1 : 1;
    if ((valueA ?? 0) > (valueB ?? 0)) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {screener ? decodeURIComponent(screener as string) : "Unknown Screener"}
      </h1>

      <div className="flex gap-4 mt-4">
        <Button onClick={() => setShowHigh(true)} variant={showHigh ? "default" : "outline"}>
          Near 52W High
        </Button>
        <Button onClick={() => setShowHigh(false)} variant={!showHigh ? "default" : "outline"}>
          Near 52W Low
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            <CustomizedProgressBars />
          </p>
        ) : sortedStocks.length > 0 ? (
          <div className="max-h-[600px] overflow-auto border rounded-lg relative">
            <Table className="w-full border-collapse">
              {/* Sticky Header */}
              <TableHeader className="bg-blue-200 dark:bg-blue-900 sticky top-0 z-10">
                <TableRow>
                  <TableHead
                    className="p-4 text-left font-medium sticky left-0 bg-blue-200 dark:bg-blue-900 z-20 cursor-pointer"
                    onClick={() => handleSort("symbol")}
                  >
                    Symbol {sortColumn === "symbol" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                  </TableHead>
                  <TableHead
                    className="p-4 text-left font-medium cursor-pointer"
                    onClick={() => handleSort("companyname")}
                  >
                    Company Name {sortColumn === "companyname" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer"
                    onClick={() => handleSort("closeyest")}
                  >
                    Previous Close {sortColumn === "closeyest" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    Price {sortColumn === "price" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                  </TableHead>
                  {showHigh ? (
                    <TableHead
                      className="p-4 text-right font-medium cursor-pointer"
                      onClick={() => handleSort("high52")}
                    >
                      High 52W {sortColumn === "high52" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                    </TableHead>
                  ) : (
                    <TableHead
                      className="p-4 text-right font-medium cursor-pointer"
                      onClick={() => handleSort("low52")}
                    >
                      Low 52W {sortColumn === "low52" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                    </TableHead>
                  )}
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    Near % {sortColumn === "price" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStocks.map((stock) => (
                  <TableRow key={stock.symbol} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <TableCell className="p-4 sticky left-0 bg-white dark:bg-black z-10">
                      {stock.symbol}
                    </TableCell>
                    <TableCell className="p-4">{stock.companyname}</TableCell>
                    <TableCell className="p-4 text-right">₹{Number(stock.closeyest).toFixed(2)}</TableCell>
                    <TableCell className="p-4 text-right">₹{Number(stock.price).toFixed(2)}</TableCell>
                    {showHigh ? (
                      <TableCell className="p-4 text-right">₹{Number(stock.high52).toFixed(2)}</TableCell>
                    ) : (
                      <TableCell className="p-4 text-right">₹{Number(stock.low52).toFixed(2)}</TableCell>
                    )}
                    <TableCell className="p-4 text-right">
                      {Number(calculateNearPercentage(stock)).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">No stocks found</p>
        )}
      </div>
    </div>
  );
}
