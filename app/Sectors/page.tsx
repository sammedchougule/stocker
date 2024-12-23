'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useStockContext } from '@/context/StockContext'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
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
  'NIFTY_PHARMA', 'NIFTY_PSU_BANK', 'NIFTY_REALTY', 'NIFTY_PVT_BANK'
]

export default function Sectors() {
  const { stocks } = useStockContext()
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const sectorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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

  // Prepare stocks for each sector
  const sectorStocks = useMemo(() => {
    const indicesMap: { [key: string]: string } = {
      'NIFTY_50': 'Nifty 50',
      'NIFTY_AUTO': 'Nifty Auto',
      'NIFTY_BANK': 'Nifty Bank',
      'NIFTY_ENERGY': 'Nifty Energy',
      'NIFTY_FIN_SERVICE': 'Nifty Financial Services',
      'NIFTY_FMCG': 'Nifty FMCG',
      'NIFTY_IT': 'Nifty IT',
      'NIFTY_MEDIA': 'Nifty Media',
      'NIFTY_METAL': 'Nifty Metal',
      'NIFTY_PHARMA': 'Nifty Pharma',
      'NIFTY_PVT_BANK': 'Nifty PVT Bank',
      'NIFTY_PSU_BANK': 'Nifty PSU Bank',
      'NIFTY_REALTY': 'Nifty Realty'
    }

    return Object.fromEntries(
      SECTORS.map(sector => {
        const indicesKey = indicesMap[sector] as keyof typeof stocks[0]['indices']
        const sectorStocks = stocks.filter(stock => 
          stock.indices && stock.indices[indicesKey]
        ).sort((a, b) => b.changepct - a.changepct)
        return [sector, sectorStocks]
      })
    )
  }, [stocks])

  // Handle bar click event
  const handleBarClick = (data: any) => {
    setSelectedSector(data.sector)
    const element = sectorRefs.current[data.sector]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (selectedSector) {
      const element = sectorRefs.current[selectedSector]
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [selectedSector])

  const IndexTable = ({ sector, stocks }: { sector: string, stocks: any[] }) => (
    <Card
      ref={(el: HTMLDivElement | null) => {
        sectorRefs.current[sector] = el;
      }}>
      <CardHeader>
        <h3 className="text-xl font-semibold">{sector.replace('NIFTY_', '').replace('_', ' ')} Stocks</h3>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] overflow-hidden flex flex-col">
          <div className="flex-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 bg-white z-10">Symbol</TableHead>
                  <TableHead className="sticky top-0 bg-white z-10 text-right">Price</TableHead>
                  <TableHead className="sticky top-0 bg-white z-10 text-right">Change</TableHead>
                  <TableHead className="sticky top-0 bg-white z-10 text-right">Change %</TableHead>
                  <TableHead className="sticky top-0 bg-white z-10 text-right">Vol_Spike</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="flex-grow overflow-auto">
            <Table>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell className="text-right">₹{Number(stock.price).toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(stock.change).toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right ${stock.changepct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(stock.changepct).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(stock.volumespike)?.toLocaleString() ?? 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto mt-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Sector Performance</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="overflow-x-auto pb-4 lg:pb-0">
                <div className="h-[600px] w-[800px] lg:w-full">
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
                                  <p className={value >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>{Number(value).toFixed(2)}%</p>
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
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <div className="h-[600px] overflow-hidden flex flex-col">
                <div className="flex-none">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky top-0 bg-white z-10">Sector</TableHead>
                        <TableHead className="sticky top-0 bg-white z-10 text-right">Change %</TableHead>
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
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedSector(sector.sector)}
                        >
                          <TableCell>{sector.name}</TableCell>
                          <TableCell 
                            className={`text-right font-medium ${
                              sector.changepct >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {sector.changepct >= 0 ? '+' : ''}{Number(sector.changepct).toFixed(2)}%
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
        {SECTORS.map(sector => (
          <IndexTable key={sector} sector={sector} stocks={sectorStocks[sector]} />
        ))}
      </div>
    </div>
  )
}