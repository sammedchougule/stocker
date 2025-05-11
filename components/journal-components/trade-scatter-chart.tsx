"use client"

import { useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
  Cell,
} from "recharts"
import type { Database } from "@/types/supabase"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface TradeScatterChartProps {
  trades: Trade[]
}

export default function TradeScatterChart({ trades }: TradeScatterChartProps) {
  const chartData = useMemo(() => {
    return trades.map((trade) => {
      const tradeSize = trade.entry_price * trade.quantity
      return {
        symbol: trade.symbol,
        tradeSize,
        profitLoss: trade.profit_loss || 0,
        roi: trade.profit_loss ? (trade.profit_loss / tradeSize) * 100 : 0,
        date: trade.date,
      }
    })
  }, [trades])

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No trade data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            type="number"
            dataKey="tradeSize"
            name="Trade Size"
            tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}`}
            label={{ value: "Trade Size (₹)", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="profitLoss"
            name="Profit/Loss"
            tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}`}
            label={{ value: "Profit/Loss (₹)", angle: -90, position: "insideLeft" }}
          />
          <ZAxis type="number" dataKey="roi" range={[50, 400]} name="ROI %" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value: number, name: string) => {
              if (name === "Trade Size") return [`₹${value.toFixed(2)}`, name]
              if (name === "Profit/Loss") return [`₹${value.toFixed(2)}`, name]
              if (name === "ROI %") return [`${value.toFixed(2)}%`, name]
              return [value, name]
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-2 border rounded shadow-sm">
                    <p className="font-bold">{data.symbol}</p>
                    <p>Date: {data.date}</p>
                    <p>Trade Size: ₹{data.tradeSize.toFixed(2)}</p>
                    <p className={data.profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                      P&L: ₹{data.profitLoss.toFixed(2)}
                    </p>
                    <p>ROI: {data.roi.toFixed(2)}%</p>
                  </div>
                )
              }
              return null
            }}
          />
          <ReferenceLine y={0} stroke="#6b7280" />
          <Scatter name="Trades" data={chartData} fill="#10b981" fillOpacity={0.6}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.profitLoss >= 0 ? "#10b981" : "#ef4444"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
