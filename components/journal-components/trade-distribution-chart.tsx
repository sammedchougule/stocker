"use client"

import { useState, useCallback } from "react"
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/types/supabase"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface TradeDistributionChartProps {
  trades: Trade[]
}

// Color palette for the pie chart
const COLORS = [
  "#10b981", // green (standard profit color)
  "#ef4444", // red (standard loss color)
  "#3b82f6", // blue
  "#f97316", // orange
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f43f5e", // rose
  "#6366f1", // indigo
  "#84cc16", // lime
]

// Custom active shape component for the pie chart
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    profitLoss,
    tradeCount,
  } = props

  // Calculate profit/loss color - using standardized colors
  const plColor = profitLoss > 0 ? "#10b981" : profitLoss < 0 ? "#ef4444" : "#9ca3af"

  // Calculate position for the external label
  const RADIAN = Math.PI / 180
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)

  // Adjust for mobile - reduce the distance of labels from the chart
  const isMobile = window.innerWidth < 768
  const labelDistance = isMobile ? 20 : 30
  const textOffset = isMobile ? 8 : 12

  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + labelDistance) * cos
  const my = cy + (outerRadius + labelDistance) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * textOffset
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  // Adjust font sizes for mobile
  const symbolFontSize = isMobile ? 11 : 20
  const labelFontSize = isMobile ? 12 : 14

  // Calculate symbol text to display
  let displaySymbol = payload.symbol
  if (isMobile) {
    // For mobile, limit the length based on the symbol length
    const maxLength = displaySymbol.length > 8 ? 6 : 8
    displaySymbol = displaySymbol.length > maxLength ? displaySymbol.slice(0, maxLength) + "..." : displaySymbol
  }

  return (
    <g>
      {/* Background circle for text */}
      <circle cx={cx} cy={cy} r={innerRadius - 5} fill="white" stroke="#e5e7eb" strokeWidth={1} />

      {/* Symbol name in center - ensure it's on top and properly sized */}
      <text
        x={cx}
        y={cy}
        dy={0}
        textAnchor="middle"
        fill="#333333"
        fontSize={symbolFontSize}
        fontWeight="bold"
        dominantBaseline="middle"
      >
        {displaySymbol}
      </text>

      {/* Active sector with highlight */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />

      {/* Only show connector lines and external labels on larger screens */}
      {!isMobile && (
        <>
          {/* Connector line to external label */}
          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

          {/* External labels */}
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill="#333333"
            fontSize={labelFontSize}
            fontWeight="bold"
          >
            {`${tradeCount} Trades`}
          </text>
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={20}
            textAnchor={textAnchor}
            fill={plColor}
            fontSize={labelFontSize}
            fontWeight="bold"
          >
            {`₹${profitLoss.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          </text>
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={40}
            textAnchor={textAnchor}
            fill="#666666"
            fontSize={labelFontSize}
            fontWeight="medium"
          >
            {`(Rate ${(percent * 100).toFixed(1)}%)`}
          </text>
        </>
      )}

      {/* For mobile, show compact info near the sector */}
      {isMobile && (
        <g>
          <rect
            x={cx - 100}
            y={cy + outerRadius + 25}
            width={200}
            height={50}
            rx={4}
            fill="#f8f9fa"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          <text
            x={cx}
            y={cy + outerRadius + 45}
            textAnchor="middle"
            fill="#333333"
            fontSize={labelFontSize}
            fontWeight="bold"
          >
            {`${tradeCount} Trades • ${(percent * 100).toFixed(1)}%`}
          </text>
          <text
            x={cx}
            y={cy + outerRadius + 65}
            textAnchor="middle"
            fill={plColor}
            fontSize={labelFontSize}
            fontWeight="bold"
          >
            {`₹${profitLoss.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          </text>
        </g>
      )}
    </g>
  )
}

export default function TradeDistributionChart({ trades }: TradeDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  // Update window width on resize
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  // Add resize listener
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize)
  }

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index)
  }, [])

  // Process trade data for the pie chart
  const chartData = trades.reduce(
    (acc, trade) => {
      const symbol = trade.symbol
      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          count: 0,
          profitLoss: 0,
        }
      }
      acc[symbol].count += 1
      acc[symbol].profitLoss += trade.profit_loss || 0
      return acc
    },
    {} as Record<string, { symbol: string; count: number; profitLoss: number }>,
  )

  // Convert to array and sort by count
  const pieData = Object.values(chartData)
    .map((item) => ({
      symbol: item.symbol,
      value: item.count,
      profitLoss: item.profitLoss,
      tradeCount: item.count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Top 8 symbols to avoid overcrowding

  // Calculate chart dimensions based on screen size
  const isMobile = windowWidth < 768
  // Increased chart dimensions for mobile
  const chartHeight = isMobile ? 450 : 500
  const outerRadius = isMobile ? 100 : 120
  const innerRadius = isMobile ? 45 : 90

  if (pieData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade Distribution</CardTitle>
          <CardDescription>Breakdown of trades by symbol</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">No trade data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-[#1b1d20]">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">Trade Distribution</CardTitle>
        <CardDescription>Breakdown of trades by symbol</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] md:h-[500px]">
        <div className="w-full h-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="40%" // Adjusted to move chart up slightly on mobile
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={2}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile legend - moved inside the card content */}
        {isMobile && (
          <div className="-mt-10 text-center text-xs text-muted-foreground">Tap on segments to view details</div>
        )}
      </CardContent>
    </Card>
  )
}
