"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Payload } from "recharts/types/component/DefaultTooltipContent"
import type { Database } from "@/types/supabase"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface WinLossChartProps {
  trades: Trade[]
}

export default function WinLossChart({ trades }: WinLossChartProps) {
  const chartData = useMemo(() => {
    // Group trades by type (Long/Short) and outcome (Win/Loss)
    const tradeTypes = ["Long", "Short"]
    const data = tradeTypes.map((type) => {
      const typeTrades = trades.filter((trade) => trade.type === type)
      const wins = typeTrades.filter((trade) => (trade.profit_loss || 0) > 0).length
      const losses = typeTrades.filter((trade) => (trade.profit_loss || 0) < 0).length
      const breakeven = typeTrades.filter((trade) => (trade.profit_loss || 0) === 0).length

      return {
        type,
        wins,
        losses,
        breakeven,
        total: typeTrades.length,
        winRate: typeTrades.length > 0 ? (wins / typeTrades.length) * 100 : 0,
      }
    })

    return data
  }, [trades])

  if (chartData.every((item) => item.total === 0)) {
    return (
      <div className="flex items-center justify-center h-full border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No trade data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
          <XAxis type="number" tickFormatter={(value) => `${value}`} />
          <YAxis type="category" dataKey="type" width={60} />
          <Tooltip
            formatter={(value: number, name: string, props: Payload<number, string>) => {
              const entry = chartData.find((item) => item.type === props.payload?.type)
              if (name === "wins") return [`${value} trades (${entry?.winRate.toFixed(1)}%)`, "Wins"]
              if (name === "losses") return [`${value} trades`, "Losses"]
              if (name === "breakeven") return [`${value} trades`, "Breakeven"]
              return [value, name]
            }}
          />
          <Legend />
          <Bar dataKey="wins" stackId="a" fill="#10b981" name="Wins" />
          <Bar dataKey="losses" stackId="a" fill="#ef4444" name="Losses" />
          <Bar dataKey="breakeven" stackId="a" fill="#9ca3af" name="Breakeven" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
