'use client'

import { useMemo, useState } from 'react'
import { useStockContext } from '@/context/StockContext'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define available sectors
const SECTORS = [
  'NIFTY_50', 'NIFTY_AUTO', 'NIFTY_BANK', 'NIFTY_ENERGY',
  'NIFTY_FIN_SERVICE', 'NIFTY_FMCG', 'NIFTY_IT', 'NIFTY_MEDIA', 'NIFTY_METAL',
  'NIFTY_PHARMA', 'NIFTY_PSU_BANK', 'NIFTY_REALTY'
]

export default function Sectors() {
  const { stocks } = useStockContext()
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  // Prepare sector data
  const sectorData = useMemo(() => {
    return SECTORS.map(sector => {
      const stock = stocks.find(s => s.symbol === sector)
      return {
        sector: sector,
        name: sector.replace('NIFTY_', '').replace('_', ' '),
        changepct: stock ? stock.changepct : 0
      }
    }).sort((a, b) => b.changepct - a.changepct)
  }, [stocks])

  // Prepare stocks for selected sector
  const sectorStocks = useMemo(() => {
    if (!selectedSector) return []
    const indicesMap: { [key: string]: string } = {
      'NIFTY_50': 'Nifty50',
      'NIFTY_AUTO': 'NiftyAuto',
      'NIFTY_BANK': 'NiftyBank',
      'NIFTY_ENERGY': 'NiftyEnergy',
      'NIFTY_FIN_SERVICE': 'NiftyFinancialServices',
      'NIFTY_FMCG': 'NiftyFmcg',
      'NIFTY_IT': 'NiftyIt',
      'NIFTY_MEDIA': 'NiftyMedia',
      'NIFTY_METAL': 'NiftyMetal',
      'NIFTY_PHARMA': 'NiftyPharma',
      'NIFTY_PSU_BANK': 'NiftyPsuBank',
      'NIFTY_REALTY': 'NiftyRealty'
    }
    const indicesKey = indicesMap[selectedSector] as keyof typeof stocks[0]['indices']
    return stocks.filter(stock => 
      stock.indices && stock.indices[indicesKey]
    ).sort((a, b) => b.changepct - a.changepct)
  }, [selectedSector, stocks])

  // Calculate min width based on number of sectors
  const minChartWidth = Math.max(sectorData.length * 100, 800)

  // Handle bar click event
  const handleBarClick = (data: any) => {
    setSelectedSector(data.sector)
  }

  return (
    <div className="container mx-auto mt-28 px-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Sector Performance</h2>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div style={{ width: `${minChartWidth}px`, height: "500px" }}>
              <ChartContainer 
                config={{
                  changepct: {
                    label: "Change %",
                    color: "currentColor",
                  },
                }}
                className="h-full"
              >
                <BarChart
                  data={sectorData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Change %', 
                      angle: -90, 
                      position: 'insideLeft',
                      offset: -20
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <ReferenceLine y={0} stroke="#666" strokeWidth={1} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value as number;
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded shadow">
                            <p className="font-semibold">{label}</p>
                            <p className={value >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>{value.toFixed(2)}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="changepct"
                    cursor="pointer"
                    onClick={(data) => handleBarClick(data)}
                  >
                    {sectorData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.changepct >= 0 ? "#22c55e" : "#ef4444"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {selectedSector && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                {selectedSector.replace('NIFTY_', '').replace('_', ' ')} Stocks
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Change %</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectorStocks.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell className="text-right">
                          ₹{stock.price.toFixed(2)}
                        </TableCell>
                        <TableCell className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change.toFixed(2)}
                        </TableCell>
                        <TableCell className={`text-right ${stock.changepct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.changepct.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {stock.volume?.toLocaleString() ?? 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

