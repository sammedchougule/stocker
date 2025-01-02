'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStockContext } from "@/context/StockContext";
import { Stock } from "@/types/Stock";
import Image from "next/image";
import { useEffect, useState } from "react";

const NIFTY50_SECTORS = {
  'Financial': ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK', 'BAJFINANCE', 'BAJAJFINSV', 'SBILIFE', 'HDFCLIFE', 'INDUSINDBK'],
  'IT': ['TCS', 'INFY', 'HCLTECH', 'TECHM', 'WIPRO'],
  'Consumer': ['HINDUNILVR', 'ITC', 'BRITANNIA', 'NESTLEIND', 'TATACONSUM'],
  'Oil & Gas': ['RELIANCE', 'ONGC', 'BPCL', 'COALINDIA'],
  'Metals': ['HINDALCO', 'JSWSTEEL', 'TATASTEEL'],
  'Auto': ['TATAMOTORS', 'M&M', 'MARUTI', 'BAJAJ-AUTO', 'EICHERMOT', 'HEROMOTOCO'],
  'Health Services': ['DIVISLAB', 'APOLLOHOSP'],
  'Health Technology':['CIPLA', 'DRREDDY', 'SUNPHARMA'],
  'Infra': ['LT', 'ULTRACEMCO', 'ADANIENT', 'ADANIPORTS'],
  'Communication': [ 'BHARTIARTL'],
  'Retail Trade': [ 'TRENT'],
  'Electronic Technology': ['BEL'],
  'Utilities': ['NTPC', 'POWERGRID'],
  'Process Industries': ['ASIANPAINT'],
  'Non-Energy Materials': ['ULTRACEMCO', 'GRASIM']
};

const NIFTY50_SYMBOLS = Object.values(NIFTY50_SECTORS).flat();

export default function Heatmap() {
  const { stocks } = useStockContext();
  const [heatmapData, setHeatmapData] = useState<Stock[]>([]);
  const [maxChange, setMaxChange] = useState(0);

  useEffect(() => {
    const nifty50Stocks = stocks.filter(
      (stock) => stock.type === "EQ" && NIFTY50_SYMBOLS.includes(stock.symbol)
    );
    const maxAbsChange = Math.max(...nifty50Stocks.map((s) => Math.abs(s.changepct)));
    setMaxChange(maxAbsChange);
    setHeatmapData(nifty50Stocks);
  }, [stocks]);

  const getCellSize = (changepct: number) => {
    const minSize = 70; // Reduced size to prevent overlapping
    const maxSize = 100; // Reduced max size
    const sizePercentage = Math.abs(changepct) / maxChange;
    return minSize + (maxSize - minSize) * sizePercentage;
  };

  // Sort heatmapData by changepct in descending order
  heatmapData.sort((a, b) => b.changepct - a.changepct);

  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">Stock Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(NIFTY50_SECTORS).map(([sector, symbols]) => (
              <div key={sector} className="bg-gray-50 p-3 rounded-lg hover:shadow-lg transition-all duration-300 border border-gray-200">
                <h3 className="font-semibold text-sm mb-3 text-gray-800">{sector}</h3>
                <div className="flex flex-wrap gap-1">
                  {heatmapData
                    .filter(stock => symbols.includes(stock.symbol))
                    .map((stock) => {
                      const size = getCellSize(stock.changepct);
                      return (
                        <div
                          key={stock.symbol}
                          className="group relative flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer p-2"
                          style={{
                            background: `linear-gradient(145deg, ${stock.changepct > 0 ? "#22c55e" : stock.changepct < 0 ? "#ef4444" : "#E5E7EB"}, ${stock.changepct > 0 ? "#16a34a" : stock.changepct < 0 ? "#dc2626" : "#D1D5DB"})`,
                            width: `${size}px`,
                            height: `${size}px`,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                          }}
                        >
                          <Image
                            src={`/images/${stock.symbol}.svg`}
                            alt={stock.symbol}
                            width={20}
                            height={20}
                            className="rounded-full bg-white p-1"
                          />
                          <div className="text-white font-medium text-[10px] truncate w-full text-center mt-1">
                            {stock.symbol}
                          </div>
                          <div className="text-white text-[10px] font-bold truncate w-full text-center">
                            {stock.changepct >= 0 ? "+" : ""}{Number(stock.changepct).toFixed(1)}%
                          </div>

                          {/* Tooltip */}
                          <div className="absolute invisible group-hover:visible bg-white text-gray-900 p-2 rounded-sm shadow-lg z-50 w-48 left-1/2 transform -translate-x-1/2 border border-gray-200"
                            style={{
                              top: 'auto',
                              bottom: '100%',
                              marginBottom: '10px'
                            }}>
                            <div className="text-sm font-semibold mb-1">{stock.companyname}</div>
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Price:</span>
                                <span>₹{Number(stock.price).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Change:</span>
                                <span className={stock.changepct >= 0 ? "text-green-600" : "text-red-600"}>
                                  {stock.changepct >= 0 ? "+" : ""}{Number(stock.changepct).toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Volume:</span>
                                <span>{Number(stock.volumespike).toFixed(2)}X</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
