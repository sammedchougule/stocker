"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStockContext } from "@/context/StockContext";
import { Stock } from "@/types/Stock";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERCENTAGE_FILTERS = [-3, -2, -1, 1, 2, 3];

type FilterOption =
  | "all"
  | "Nifty 50"
  | "Nifty Bank"
  | "Nifty IT"
  | "Nifty Auto"
  | "Nifty FnO"
  | "Nifty Financial Services"
  | "Nifty FMCG"
  | "Nifty Healthcare"
  | "Nifty Media"
  | "Nifty Metal"
  | "Nifty Pharma"
  | "Nifty PVT Bank"
  | "Nifty PSU Bank"
  | "Nifty Realty";

export default function Heatmap() {
  const { stocks } = useStockContext();
  const [heatmapData, setHeatmapData] = useState<Stock[]>([]);
  const [maxChange, setMaxChange] = useState(0);
  const [minChange, setMinChange] = useState(0);
  const [activeFilters, setActiveFilters] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOption>("Nifty FnO");

  useEffect(() => {
    let filtered = stocks.filter((stock) => stock.type === "EQ");

     if (filterBy === "all") {
      filtered = filtered.filter(
          (stock) => stock.indices && stock.indices["Nifty FnO"]
      );
    }else  {
      filtered = filtered.filter(
           (stock) => stock.indices && stock.indices[filterBy as keyof typeof stock.indices]
       );
   }


    if (filtered.length > 0) {
      const max = Math.max(...filtered.map((s) => s.changepct));
      const min = Math.min(...filtered.map((s) => s.changepct));
      setMaxChange(max);
      setMinChange(min);

      const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct);
      setHeatmapData(sortedStocks);
    }
  }, [stocks, filterBy]);

  const getColor = (changepct: number) => {
    const maxAbsChange = Math.max(Math.abs(maxChange), Math.abs(minChange));
    if (changepct === 0) return "#E5E7EB";

    const normalizedChange = changepct / maxAbsChange;

    const greenStart = [88, 214, 141]; // #a7f3d0
    const greenEnd = [29, 131, 72]; // #34d399
    const redStart = [236, 112, 99]; // #fca5a5
    const redEnd = [148, 49, 38]; // #f87171

    let startColor, endColor;
    if (normalizedChange > 0) {
      startColor = greenStart;
      endColor = greenEnd;
    } else {
      startColor = redStart;
      endColor = redEnd;
    }

    const color = startColor.map((start, i) => {
      const end = endColor[i];
      return Math.round(start + (end - start) * Math.abs(normalizedChange));
    });

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  const getButtonColor = (filterValue: number) => {
    if (activeFilters.includes(filterValue)) {
      return "#4a5568";
    }
    if (filterValue > 0) {
      return "#166534";
    } else {
      return "#7f1d1d";
    }
  };

  const handleFilterClick = (filterValue: number) => {
    if (activeFilters.includes(filterValue)) {
      setActiveFilters(activeFilters.filter((f) => f !== filterValue));
    } else {
      setActiveFilters([...activeFilters, filterValue]);
    }
  };

  const isStockVisible = (stock: Stock) => {
    if (activeFilters.length === 0) return true;

    return !activeFilters.some((filter) => {
      const filterIndex = PERCENTAGE_FILTERS.indexOf(filter);
      const nextFilter = PERCENTAGE_FILTERS[filterIndex + 1];
      if (nextFilter === undefined) {
        return false;
      }

      if (filter > 0) {
        return stock.changepct > filter && stock.changepct <= nextFilter;
      } else {
        return stock.changepct < filter && stock.changepct >= nextFilter;
      }
    });
  };

  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">Stock Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-evenly mb-4">
            <Select
              value={filterBy}
              onValueChange={(value: FilterOption) => setFilterBy(value)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by Index" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nifty FnO">All</SelectItem>
                  <SelectItem value="Nifty 50">Nifty 50</SelectItem>
                <SelectItem value="Nifty Auto">Nifty Auto</SelectItem>
                <SelectItem value="Nifty Bank">Nifty Bank</SelectItem>
                  <SelectItem value="Nifty Financial Services">
                    Nifty Financial Services
                  </SelectItem>
                  <SelectItem value="Nifty FMCG">Nifty FMCG</SelectItem>
                  <SelectItem value="Nifty Healthcare">
                    Nifty Healthcare
                  </SelectItem>
                  <SelectItem value="Nifty IT">Nifty IT</SelectItem>
                  <SelectItem value="Nifty Media">Nifty Media</SelectItem>
                  <SelectItem value="Nifty Metal">Nifty Metal</SelectItem>
                  <SelectItem value="Nifty Pharma">Nifty Pharma</SelectItem>
                  <SelectItem value="Nifty PVT Bank">Nifty PVT Bank</SelectItem>
                  <SelectItem value="Nifty PSU Bank">Nifty PSU Bank</SelectItem>
                  <SelectItem value="Nifty Realty">Nifty Realty</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-center">
              {PERCENTAGE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  className={`rounded-md px-3 py-1 mx-1 text-white hover:opacity-80`}
                  style={{ backgroundColor: getButtonColor(filter) }}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter}%
                </button>
              ))}
            </div>
          </div>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
          >
            {heatmapData.filter(isStockVisible).map((stock) => (
              <div
                key={stock.symbol}
                className="group rounded-sm relative flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer p-2"
                style={{
                  background: getColor(stock.changepct),
                  minWidth: "140px",
                  minHeight: "140px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  src={`/images/${stock.symbol}.svg`}
                  alt={stock.symbol}
                  width={30}
                  height={30}
                  className="rounded-full bg-white"
                />
                <div className="text-white font-medium text-lg truncate w-full text-center mt-1">
                  {stock.symbol}
                </div>
                <div className="text-white font-medium text-md truncate w-full text-center">
                  {stock.price}
                </div>
                <div className="text-white text-md font-medium truncate w-full text-center">
                  {stock.changepct >= 0 ? "+" : ""}{Number(stock.changepct).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}