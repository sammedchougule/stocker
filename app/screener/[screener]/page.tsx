"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getStocks } from "@/lib/getStocks";
import type { Stock } from "@/types/Stock";
import CustomizedProgressBars from "@/components/CustomizedProgressBars";
import { ArrowUpDown } from "lucide-react";

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

  const parseCurrency = (value: string | null) => (value ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : 0);
  const parsePercentage = (value: string | null) => (value ? parseFloat(value.replace(/%/g, "")) : 0);

  const handleSort = (column: keyof Stock) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    if (!sortColumn) return 0;
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    if (["price", "closeyest", "change"].includes(sortColumn)) {
      aValue = parseCurrency(aValue?.toString() ?? null);
      bValue = parseCurrency(bValue?.toString() ?? null);
    } else if (["changepct", "today_hlCross", "month_hlCross", "year_hlCross"].includes(sortColumn)) {
      aValue = parsePercentage(aValue?.toString() ?? null);
      bValue = parsePercentage(bValue?.toString() ?? null);
    } else {
      aValue = aValue ? Number.parseFloat(aValue.toString()) : 0;
      bValue = bValue ? Number.parseFloat(bValue.toString()) : 0;
    }

    if ((aValue ?? 0) < (bValue ?? 0)) return sortOrder === "asc" ? -1 : 1;
    if ((aValue ?? 0) > (bValue ?? 0)) return sortOrder === "asc" ? 1 : -1;
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
        ) : (
          <Table className="w-full border-collapse">
            <TableHeader className="bg-blue-200 dark:bg-blue-900 sticky top-0 z-10">
              <TableRow>
                {[
                  { key: "symbol", label: "Symbol" },
                  { key: "companyname", label: "Company Name" },
                  { key: "closeyest", label: "Previous Close" },
                  { key: "price", label: "Price" },
                  { key: showHigh ? "high52" : "low52", label: showHigh ? "High 52W" : "Low 52W" },
                  { key: "changepct", label: "Near %" },
                ].map(({ key, label }) => (
                  <TableHead
                    key={key}
                    className="p-4 text-left font-medium cursor-pointer"
                    onClick={() => handleSort(key as keyof Stock)}
                  >
                    {label} <ArrowUpDown className="inline w-4 h-4" />
                  </TableHead>
                ))}
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
                  <TableCell className="p-4 text-right">
                    ₹{Number(showHigh ? stock.high52 : stock.low52).toFixed(2)}
                  </TableCell>
                  <TableCell className="p-4 text-right">{Number(stock.changepct).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
