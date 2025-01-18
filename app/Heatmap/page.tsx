"use client";

import { useEffect, useState } from "react";
import { useStockContext } from "@/context/StockContext";
import { Stock } from "@/types/Stock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/buttons";
import { StockModal } from "@/components/StockModal";
import { Treemap, ResponsiveContainer, TreemapProps } from "recharts";

type FilterOption =
  | "Nifty FnO"
  | "Nifty 50"
  | "Nifty Auto"
  | "Nifty Bank"
  | "Nifty Energy"
  | "Nifty Financial Services"
  | "Nifty FMCG"
  | "Nifty IT"
  | "Nifty Metal"
  | "Nifty Pharma";

interface TreemapData {
  name: string;
  value: number;
  color: string;
  stock: Stock;
}

const filterOptions: FilterOption[] = [
  "Nifty FnO",
  "Nifty 50",
  "Nifty Auto",
  "Nifty Bank",
  "Nifty Energy",
  "Nifty Financial Services",
  "Nifty FMCG",
  "Nifty IT",
  "Nifty Metal",
  "Nifty Pharma",
];

export default function Heatmap() {
  const { stocks } = useStockContext();
  const [heatmapData, setHeatmapData] = useState<Stock[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<FilterOption>("Nifty FnO");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let filtered = stocks.filter((stock) => stock.type === "EQ");

    if (selectedIndex === "Nifty FnO") {
      filtered = filtered.filter(
        (stock) => stock.indices && stock.indices["Nifty FnO"]
      );
    } else {
      filtered = filtered.filter(
        (stock) =>
          stock.indices && stock.indices[selectedIndex as keyof typeof stock.indices]
      );
    }

    if (filtered.length > 0) {
      const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct);
      setHeatmapData(sortedStocks);
    }
  }, [stocks, selectedIndex]);

  const getColor = (changepct: number, maxChange: number = 10): string => {
    const clampedChange = Math.max(-maxChange, Math.min(changepct, maxChange));
    const normalizedChange = clampedChange / maxChange;
    const green = [20, 180, 20];
    const yellow = [220, 230, 100];
    const red = [220, 10, 10];
    let startColor, endColor, t;

    if (normalizedChange > 0) {
      startColor = yellow;
      endColor = green;
      t = Math.sqrt(normalizedChange);
    } else {
      startColor = yellow;
      endColor = red;
      t = Math.sqrt(Math.abs(normalizedChange));
    }

    const interpolatedColor = startColor.map((start, i) =>
      Math.round(start + (endColor[i] - start) * t)
    );

    return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
  };

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const formatTreemapData = (): TreemapData[] =>
    heatmapData.map((stock) => ({
      name: stock.symbol,
      value: Math.abs(stock.changepct), // Treemap requires positive values
      color: getColor(stock.changepct),
      stock, // Store stock object for click handling
    }));

  const renderTreemapCell = (cell: {
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    payload: TreemapData;
  }) => {
    const { name, x, y, width, height, payload } = cell;
    const { color, stock } = payload;

    return (
      <g key={`cell-${name}`} transform={`translate(${x},${y})`}>
        <rect
          width={width}
          height={height}
          fill={color}
          stroke="#fff"
          onClick={() => handleStockClick(stock)}
          style={{ cursor: "pointer" }}
        />
        {width > 50 && height > 30 && (
          <>
            <text x={5} y={20} fill="#fff" fontSize="12px">
              {name}
            </text>
            <text x={5} y={40} fill="#fff" fontSize="10px">
              {stock.changepct.toFixed(2)}%
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className="container mx-auto mt-4 sm:mt-0">
      <Card>
        <CardHeader className="sticky top-0 bg-white z-10">
          <CardTitle className="flex gap-2 items-center justify-center">
            <LayoutGrid /> Heatmap
          </CardTitle>
          <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4">
            <div className="inline-flex gap-2 mt-4">
              {filterOptions.map((option) => (
                <Button
                  key={option}
                  variant={selectedIndex === option ? "default" : "outline"}
                  onClick={() => setSelectedIndex(option)}
                  className={`flex-shrink-0 ${
                    selectedIndex === option ? "bg-gray-600 text-white" : "bg-white"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent style={{ height: "calc(100vh - 180px)", overflowY: "auto" }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={formatTreemapData()}
              dataKey="value"
              stroke="#fff"
              content={renderTreemapCell}
            />
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <StockModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}