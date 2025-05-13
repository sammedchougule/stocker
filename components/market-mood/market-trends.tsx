"use client"

import { useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

type Period = "1m" | "3m" | "6m" | "1y" | "all"

const generateData = (period: Period) => {
  const data = []
  let days = 30

  switch (period) {
    case "1m":
      days = 30
      break
    case "3m":
      days = 90
      break
    case "6m":
      days = 180
      break
    case "1y":
      days = 365
      break
    case "all":
      days = 1095
      break // ~3 years
  }

  const now = new Date()
  let value = 50

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Add some randomness to the value but keep it between 0-100
    value = Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 10))

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value),
      marketReturn: ((value - 50) / 10).toFixed(2),
    })
  }

  return data
}

export function MarketTrends({ period }: { period: Period }) {
  const data = useMemo(() => generateData(period), [period])

  return (
    <div className="w-full h-[400px] mb-8">
      <ChartContainer
        config={{
          mood: {
            label: "Market Mood",
            color: "hsl(var(--chart-1))",
          },
          marketReturn: {
            label: "Market Return %",
            color: "hsl(var(--chart-2))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
              tick={{ fontSize: 12 }}
              tickMargin={15}
              axisLine={false}
              tickLine={false}
              height={50}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Mood Index",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: 12 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[-5, 5]}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Market Return %",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle", fontSize: 12 },
              }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="value"
              name="mood"
              stroke="var(--color-mood)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="marketReturn"
              name="marketReturn"
              stroke="var(--color-marketReturn)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
