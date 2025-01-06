"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useStockContext } from "@/context/StockContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Stock } from "@/types/Stock";
import { ArrowUp, ArrowDown, Flame } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StockDataTable from '@/components/StockDataTable';

// Define available sectors
const SECTORS = [
  "NIFTY_50",
  "NIFTY_AUTO",
  "NIFTY_BANK",
  "NIFTY_ENERGY",
  "NIFTY_FIN_SERVICE",
  "NIFTY_FMCG",
  "NIFTY_IT",
  "NIFTY_MEDIA",
  "NIFTY_METAL",
  "NIFTY_PHARMA",
  "NIFTY_PSU_BANK",
  "NIFTY_REALTY",
  "NIFTY_PVT_BANK",
];

export default function Sectors() {
  const { stocks } = useStockContext();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const sectorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Prepare sector data
  const sectorData = useMemo(() => {
    return SECTORS.map((sector) => {
      const stock = stocks.find((s) => s.symbol === sector);
      return {
        sector: sector,
        name: sector.replace("NIFTY_", "").replace("_", " "),
        changepct: stock ? stock.changepct : 0,
      };
    }).sort((a, b) => b.changepct - a.changepct);
  }, [stocks]);

  // Calculate min and max values for Y-axis
  const { minValue, maxValue } = useMemo(() => {
    const values = sectorData.map((d) => d.changepct);
    return {
      minValue: Math.min(...values, 0),
      maxValue: Math.max(...values, 0),
    };
  }, [sectorData]);

  // Prepare stocks for each sector
  const sectorStocks = useMemo(() => {
    const indicesMap: { [key: string]: string } = {
      NIFTY_50: "Nifty 50",
      NIFTY_AUTO: "Nifty Auto",
      NIFTY_BANK: "Nifty Bank",
      NIFTY_ENERGY: "Nifty Energy",
      NIFTY_FIN_SERVICE: "Nifty Financial Services",
      NIFTY_FMCG: "Nifty FMCG",
      NIFTY_IT: "Nifty IT",
      NIFTY_MEDIA: "Nifty Media",
      NIFTY_METAL: "Nifty Metal",
      NIFTY_PHARMA: "Nifty Pharma",
      NIFTY_PVT_BANK: "Nifty PVT Bank",
      NIFTY_PSU_BANK: "Nifty PSU Bank",
      NIFTY_REALTY: "Nifty Realty",
    };

    return Object.fromEntries(
      SECTORS.map((sector) => {
        const indicesKey = indicesMap[sector] as keyof typeof stocks[0]['indices'];
        const sectorStocks = stocks
          .filter((stock) => stock.indices && stock.indices[indicesKey])
          .sort((a, b) => b.changepct - a.changepct);
        return [sector, sectorStocks];
      })
    );
  }, [stocks]);

  interface SectorData {
    sector: string;
  }

  // Handle bar click event
  const handleBarClick = (data: SectorData) => {
    setSelectedSector(data.sector);
  };

  useEffect(() => {
    if (selectedSector) {
        const element = sectorRefs.current[selectedSector];
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }
}, [selectedSector]);


  const IndexTable = ({ sector, stocks }: { sector: string; stocks: Stock[] }) => {
    const stockAnimations = stocks.map(() => ({
      priceDirection: null,
      changeDirection: null,
      volumespikeDirection: null
    }));

    return (
      <Card
        className={`mt-8 m-2 transition-all duration-300 ${
          selectedSector === sector ? "ring-2 ring-blue-500" : ""
        }`}
        ref={(el: HTMLDivElement | null) => {
          sectorRefs.current[sector] = el;
        }}
      >
        <CardHeader>
          <h3 className="text-xl font-semibold">
            {sector.replace("NIFTY_", "").replace("_", " ")} Stocks
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <StockDataTable
            stocks={stocks}
            stockAnimations={stockAnimations}
            onStockClick={() => {}}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto mt-6">
      {/* Sector Performance Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Sector Performance</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chart Section */}
            <div className="w-full lg:w-2/3">
              <div className="overflow-x-auto pb-4 lg:pb-0">
                {/* Responsive Chart Container */}
                <div className="w-full h-72 sm:h-96 lg:h-[600px]">
                  <ChartContainer
                    config={{
                      changepct: {
                        label: "Change %",
                        color: "currentColor",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sectorData}
                        margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                        barSize={30}
                        barGap={0} // Gap between bars
                      >
                        {/* Gradients for 3D Effect */}
                        <defs>
                          <linearGradient
                            id="positiveGradient3D"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#22c55e"
                              stopOpacity={1}
                            />
                            <stop
                              offset="50%"
                              stopColor="#16a34a"
                              stopOpacity={0.9}
                            />
                            <stop
                              offset="100%"
                              stopColor="#15803d"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                          <linearGradient
                            id="negativeGradient3D"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#ef4444"
                              stopOpacity={1}
                            />
                            <stop
                              offset="50%"
                              stopColor="#dc2626"
                              stopOpacity={0.9}
                            />
                            <stop
                              offset="100%"
                              stopColor="#b91c1c"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>

                        {/* Chart Axes */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-90}
                          textAnchor="end"
                          height={80}
                          interval={0}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          label={{
                            angle: -90,
                            position: "insideLeft",
                            offset: -20,
                          }}
                          tick={{ fontSize: 12 }}
                          domain={[minValue - 0.1, maxValue + 0.1]}
                          tickFormatter={(value) => `${value.toFixed(2)}%`}
                        />
                        <ReferenceLine y={0} stroke="#666" strokeWidth={1} />

                        {/* Tooltip */}
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const value = payload[0].value as number;
                              return (
                                <div className="bg-white p-2 border border-gray-200 rounded shadow">
                                  <p className="font-semibold">Nifty {label}</p>
                                  <p> Change <span
                                    className={
                                      value >= 0
                                        ? "font-semibold text-[#22c55e]"
                                        : "font-semibold text-[#ef4444]"
                                    }>{Number(value).toFixed(2)}%
                                    </span>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />

                        {/* Bars with 3D Effect */}
                        <Bar
                          dataKey="changepct"
                          cursor="pointer"
                          onClick={(data) => handleBarClick(data)}
                          radius={[2.5, 2.5, 0, 0]} // Rounded corners for the 3D look
                        >
                          {sectorData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#${
                                entry.changepct >= 0
                                  ? "positiveGradient3D"
                                  : "negativeGradient3D"
                              })`}
                              style={{
                                filter:
                                  "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))", // Shadow for depth
                              }}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>

            {/* Sector Table */}
            <div className="w-full lg:w-1/3">
                <div className="h-[600px] overflow-hidden flex flex-col">
                <div className="flex-none">
                    <Table>
                        <TableHeader className="bg-blue-200">
                        <TableRow>
                            <TableHead className="sticky top-0">Sector</TableHead>
                            <TableHead className="sticky top-0 z-10 text-right">
                            Change %
                            </TableHead>
                        </TableRow>
                        </TableHeader>
                    </Table>
                </div>
                  <div className="flex-grow overflow-auto">
                      <Table>
                      <TableBody>
                          {sectorData.map((sector) => (
                            <TableRow
                              key={sector.sector}
                              className={`cursor-pointer hover:bg-gray-100 ${selectedSector === sector.sector ? 'bg-gray-100' : ''}`}
                                onClick={() => setSelectedSector(sector.sector)}
                            >
                              <TableCell>{sector.name}</TableCell>
                              <TableCell
                                className="text-right font-medium">
                                <span
                                  className={`inline-flex items-center rounded px-1 py-1 ${
                                    sector.changepct >= 0
                                      ? 'text-green-500 bg-green-50 rounded-lg'
                                      : 'text-red-500 bg-red-50 rounded-lg'
                                  }`}
                                >
                                  {sector.changepct >= 0 ? (
                                    <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                                  ) : (
                                    <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                                  )}
                                  <span className="text-sm font-md">
                                    {sector.changepct}%
                                  </span>
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Index Tables */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {SECTORS.map((sector) => (
          <IndexTable
            key={sector}
            sector={sector}
            stocks={sectorStocks[sector]}
          />
        ))}
      </div>
    </div>
  );
}