"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getStocks } from "@/lib/getStocks";
import type { Stock } from "@/types/Stock";
import CustomizedProgressBars from "@/components/CustomizedProgressBars";
import { getStockBgColor } from "@/lib/getstockBgColor"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"


export default function ScreenerDetail() {
  const { screener } = useParams();
  const [showHigh, setShowHigh] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

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


  const renderSortIcon = (column: string, sortColumn: string, sortOrder: "asc" | "desc") => {
    if (column === sortColumn) {
      return sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
    }
    return <ArrowUpDown className="w-4 h-4" />
  }

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (!sortColumn) return 0;
  
    let aValue: string | number;
    let bValue: string | number;
  
    if (sortColumn === "nearPct") {
      aValue = calculateNearPercentage(a);
      bValue = calculateNearPercentage(b);
    } else {
      const valueA = a[sortColumn as keyof Stock];
      const valueB = b[sortColumn as keyof Stock];
  
      // Determine if the field should be treated as a number
      const numericFields: (keyof Stock | "nearPct")[] = [
        "price",
        "closeyest",
        "high52",
        "low52",
      ];
  
      const isNumeric = numericFields.includes(sortColumn as "nearPct" | keyof Stock);
  
      // Use Number for numeric fields, else default to string or fallback
      aValue = isNumeric ? Number(valueA ?? 0) : String(valueA ?? "");
      bValue = isNumeric ? Number(valueB ?? 0) : String(valueB ?? "");
    }
  
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });  


  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortOrder("asc")
    }
  }
  

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
                  <div className="flex items-center gap-2">
                    <span>Symbol</span>
                    {sortColumn === "symbol" ? (
                      sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>

                <TableHead
                  className="p-4 text-left font-medium cursor-pointer"
                  onClick={() => handleSort("companyname")}
                >
                  <div className="flex items-center gap-2">
                    <span>Company Name</span>
                    {sortColumn === "companyname" ? (
                      sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>

                <TableHead
                  className="p-4 text-right font-medium cursor-pointer"
                  onClick={() => handleSort("closeyest")}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span>Yest Close</span>
                    {sortColumn === "closeyest" ? (
                      sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                  <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                    <div className="flex items-center justify-end gap-2">
                      <span>Price</span>
                      {renderSortIcon("price", sortColumn || "", sortOrder)}
                    </div>
                  </TableHead>

                  {showHigh ? (
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer"
                    onClick={() => handleSort("high52")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>High 52W</span>
                      {sortColumn === "high52" ? (
                        sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                ) : (
                  <TableHead
                    className="p-4 text-right font-medium cursor-pointer"
                    onClick={() => handleSort("low52")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Low 52W</span>
                      {sortColumn === "low52" ? (
                        sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                )}

                <TableHead
                  className="p-4 text-right font-medium cursor-pointer"
                  onClick={() => handleSort("nearPct")}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span>Near %</span>
                    {sortColumn === "nearPct" ? (
                      sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStocks.map((stock) => (
                  <TableRow key={stock.symbol} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <TableCell className="sticky left-0 z-10  p-4 border-t dark:border-gray-800">                
                        <div
                            className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
                            style={{ backgroundColor: getStockBgColor(stock.symbol), width: "6rem" }}
                        >
                            <span
                            className="whitespace-nowrap text-[12px] leading-none text-center block overflow-hidden text-ellipsis"
                            style={{
                                paddingLeft: "2px",
                                paddingRight: "2px",
                                maxWidth: "100%",
                                fontSize: stock.symbol.length > 10 ? "10px" : "12px",
                            }}
                            >
                            {stock.symbol}
                            </span>
                        </div>
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
