import React, { useState, useEffect } from "react";
import { useStockContext } from "@/context/StockContext";
import { Stock } from "@/types/Stock";

const StockInput: React.FC = () => {
  const { stocks } = useStockContext();
  const [query, setQuery] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      const results = stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.companyname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStocks(results);
    } else {
      setFilteredStocks([]);
    }
  }, [query, stocks]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by stock symbol or company name..."
        className="flex h-8 w-full md:w-[32rem] bg-gray-200 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {filteredStocks.length > 0 && (
        <ul className="absolute z-10 w-full md:w-[32rem] bg-white border border-gray-300 rounded-md mt-2 max-h-60 overflow-y-auto shadow-lg scrollbar-hide">
          {filteredStocks.map((stock) => (
            <li
              key={stock.symbol}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 flex justify-between items-center"
              onClick={() => {
                window.location.href = `/StockDetail/${stock.symbol}`;
              }}
            >
              <div>
                <div className="font-medium text-gray-800">{stock.companyname}</div>
                <div className="text-xs text-gray-600">{stock.symbol} • {stock.exchange} ({stock.type})</div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <div className="text-md text-gray-800">{stock.price}</div>
                <div className={`text-md ${stock.changepct >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-md px-2 py-1`}>
                  {stock.changepct}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { StockInput };
