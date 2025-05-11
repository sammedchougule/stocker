"use client"

import { useMemo, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import type { Payload } from "recharts/types/component/DefaultTooltipContent"
import {
  format,
  parseISO,
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isWithinInterval,
  getMonth,
  getYear,
  getDate,
  getDay,
} from "date-fns"
import type { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface PerformanceChartProps {
  trades: Trade[]
}

type TimeFilter = "all" | "daily" | "weekly" | "monthly"

// Standardized colors for profit and loss
const PROFIT_COLOR = "#10b981" // Standard green for profits
const LOSS_COLOR = "#ef4444" // Standard red for losses

export default function PerformanceChart({ trades }: PerformanceChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("weekly")
  const [offset, setOffset] = useState(0)

  // Reset offset when time filter changes
  const changeTimeFilter = (filter: TimeFilter) => {
    setOffset(0)
    setTimeFilter(filter)
  }

  // Calculate date range based on time filter and offset
  const dateRange = useMemo(() => {
    const today = new Date()
    let start: Date
    let end: Date
    let periodLabel: string

    switch (timeFilter) {
      case "daily": {
        const targetDay = offset === 0 ? today : addDays(today, offset)
        start = startOfDay(targetDay)
        end = endOfDay(targetDay)
        periodLabel = format(targetDay, "MMMM d, yyyy")
        break
      }
      case "weekly": {
        const targetWeek = offset === 0 ? today : addWeeks(today, offset)
        start = startOfWeek(targetWeek, { weekStartsOn: 0 })
        end = endOfWeek(targetWeek, { weekStartsOn: 0 })
        periodLabel = `Week of ${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
        break
      }
      case "monthly": {
        const targetMonth = offset === 0 ? today : addMonths(today, offset)
        start = startOfMonth(targetMonth)
        end = endOfMonth(targetMonth)
        periodLabel = format(targetMonth, "MMMM yyyy")
        break
      }
      default: {
        start = startOfMonth(addMonths(today, -11))
        end = endOfMonth(today)
        periodLabel = `${format(start, "MMM yyyy")} - ${format(end, "MMM yyyy")}`
      }
    }

    return { start, end, periodLabel }
  }, [timeFilter, offset])

  // Navigate to previous/next period
  const goToPrevious = () => setOffset(offset - 1)
  const goToNext = () => {
    // Don't allow navigating to future dates beyond today
    const today = new Date()
    let canNavigate = true

    switch (timeFilter) {
      case "daily":
        canNavigate = !isSameDay(dateRange.end, today) && dateRange.end < today
        break
      case "weekly":
        canNavigate = !isSameWeek(dateRange.end, today, { weekStartsOn: 0 }) && dateRange.end < today
        break
      case "monthly":
        canNavigate = !isSameMonth(dateRange.end, today) && dateRange.end < today
        break
    }

    if (canNavigate) {
      setOffset(offset + 1)
    }
  }

  // Filter trades based on selected date range
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const tradeDate = parseISO(trade.date)
      return isWithinInterval(tradeDate, { start: dateRange.start, end: dateRange.end })
    })
  }, [trades, dateRange])

  // Prepare chart data based on time filter
  const chartData = useMemo(() => {
    if (timeFilter === "daily") {
      // For daily view, group trades by hour
      const hourlyData: Record<number, { profitLoss: number; tradeCount: number }> = {}

      // Initialize all hours with 0
      for (let i = 0; i < 24; i++) {
        hourlyData[i] = { profitLoss: 0, tradeCount: 0 }
      }

      // Sum profit/loss by hour and count trades
      filteredTrades.forEach((trade) => {
        const tradeDate = parseISO(trade.date)
        const hour = tradeDate.getHours()
        hourlyData[hour].profitLoss += trade.profit_loss || 0
        hourlyData[hour].tradeCount++
      })

      // Convert to chart data format
      return Object.entries(hourlyData)
        .map(([hour, data]) => {
          return {
            name: `${hour.toString().padStart(2, "0")}:00`,
            value: data.profitLoss,
            positiveValue: data.profitLoss >= 0 ? data.profitLoss : 0,
            negativeValue: data.profitLoss < 0 ? data.profitLoss : 0,
            tradeCount: data.tradeCount,
            hour: Number.parseInt(hour),
          }
        })
        .sort((a, b) => a.hour - b.hour)
    } else if (timeFilter === "weekly") {
      // For weekly view, group trades by day of week
      const dayData: Record<number, { profitLoss: number; tradeCount: number }> = {}
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

      // Initialize all days with 0
      for (let i = 0; i < 7; i++) {
        dayData[i] = { profitLoss: 0, tradeCount: 0 }
      }

      // Sum profit/loss by day and count trades
      filteredTrades.forEach((trade) => {
        const tradeDate = parseISO(trade.date)
        const day = getDay(tradeDate) // 0 = Sunday, 1 = Monday, etc.
        dayData[day].profitLoss += trade.profit_loss || 0
        dayData[day].tradeCount++
      })

      // Convert to chart data format
      return Object.entries(dayData)
        .map(([day, data]) => {
          return {
            name: dayNames[Number.parseInt(day)],
            value: data.profitLoss,
            positiveValue: data.profitLoss >= 0 ? data.profitLoss : 0,
            negativeValue: data.profitLoss < 0 ? data.profitLoss : 0,
            tradeCount: data.tradeCount,
            day: Number.parseInt(day),
          }
        })
        .sort((a, b) => a.day - b.day)
    } else if (timeFilter === "monthly") {
      // For monthly view, group trades by day of month
      const daysInMonth = getDate(endOfMonth(dateRange.start))
      const dayData: Record<number, { profitLoss: number; tradeCount: number }> = {}

      // Initialize all days with 0
      for (let i = 1; i <= daysInMonth; i++) {
        dayData[i] = { profitLoss: 0, tradeCount: 0 }
      }

      // Sum profit/loss by day and count trades
      filteredTrades.forEach((trade) => {
        const tradeDate = parseISO(trade.date)
        const day = getDate(tradeDate)
        dayData[day].profitLoss += trade.profit_loss || 0
        dayData[day].tradeCount++
      })

      // Convert to chart data format
      return Object.entries(dayData)
        .map(([day, data]) => {
          return {
            name: `${day}`,
            value: data.profitLoss,
            positiveValue: data.profitLoss >= 0 ? data.profitLoss : 0,
            negativeValue: data.profitLoss < 0 ? data.profitLoss : 0,
            tradeCount: data.tradeCount,
            day: Number.parseInt(day),
          }
        })
        .sort((a, b) => a.day - b.day)
    } else {
      // For all time view, group by month
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const monthData: Record<string, { profitLoss: number; tradeCount: number }> = {}

      // Get all months in the range
      const startYear = getYear(dateRange.start)
      const startMonth = getMonth(dateRange.start)
      const endYear = getYear(dateRange.end)
      const endMonth = getMonth(dateRange.end)

      // Initialize all months with 0
      for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? startMonth : 0
        const monthEnd = year === endYear ? endMonth : 11

        for (let month = monthStart; month <= monthEnd; month++) {
          const key = `${year}-${month}`
          monthData[key] = { profitLoss: 0, tradeCount: 0 }
        }
      }

      // Sum profit/loss by month and count trades
      filteredTrades.forEach((trade) => {
        const tradeDate = parseISO(trade.date)
        const year = getYear(tradeDate)
        const month = getMonth(tradeDate)
        const key = `${year}-${month}`

        if (monthData[key] !== undefined) {
          monthData[key].profitLoss += trade.profit_loss || 0
          monthData[key].tradeCount++
        }
      })

      // Convert to chart data format
      return Object.entries(monthData)
        .map(([key, data]) => {
          const [year, month] = key.split("-").map(Number)
          return {
            name: `${monthNames[month]} ${year}`,
            value: data.profitLoss,
            positiveValue: data.profitLoss >= 0 ? data.profitLoss : 0,
            negativeValue: data.profitLoss < 0 ? data.profitLoss : 0,
            tradeCount: data.tradeCount,
            sortKey: year * 100 + month,
          }
        })
        .sort((a, b) => a.sortKey - b.sortKey)
    }
  }, [filteredTrades, timeFilter, dateRange])

  // Check if we can navigate forward (not beyond today)
  const canNavigateForward = useMemo(() => {
    const today = new Date()

    switch (timeFilter) {
      case "daily":
        return !isSameDay(dateRange.start, today)
      case "weekly":
        return !isSameWeek(dateRange.start, today, { weekStartsOn: 0 })
      case "monthly":
        return !isSameMonth(dateRange.start, today)
      default:
        return false
    }
  }, [dateRange, timeFilter])

  // Format the tooltip label based on time filter
  const formatTooltipLabel = (label: string) => {
    switch (timeFilter) {
      case "daily":
        return `Time: ${label}`
      case "weekly":
        return `Day: ${label}`
      case "monthly":
        return `Date: ${format(dateRange.start, "MMM")} ${label}`
      default:
        return label
    }
  }

  // Get min and max values for y-axis domain
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return ["auto", "auto"]

    const values = chartData.map((item) => item.value)
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Add some padding to the min/max values
    const padding = Math.max(Math.abs(min), Math.abs(max)) * 0.1
    return [Math.floor(min - padding), Math.ceil(max + padding)]
  }, [chartData])

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="text-sm font-medium">{dateRange.periodLabel}</div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center">
            {timeFilter === "weekly" && (
              <Button variant="outline" size="icon" onClick={goToPrevious} className="h-8 w-8 mr-1">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant={timeFilter === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => changeTimeFilter("weekly")}
              className="h-8"
            >
              Weekly
            </Button>
            {timeFilter === "weekly" && (
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="h-8 w-8 ml-1"
                disabled={!canNavigateForward}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center">
            {timeFilter === "monthly" && (
              <Button variant="outline" size="icon" onClick={goToPrevious} className="h-8 w-8 mr-1">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant={timeFilter === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => changeTimeFilter("monthly")}
              className="h-8"
            >
              Monthly
            </Button>
            {timeFilter === "monthly" && (
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="h-8 w-8 ml-1"
                disabled={!canNavigateForward}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant={timeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => changeTimeFilter("all")}
            className="h-8"
          >
            All Time
          </Button>
        </div>
      </div>

      {filteredTrades.length === 0 ? (
        <div className="flex items-center justify-center h-[90%] border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">
            {timeFilter === "daily"
              ? "No trades for this day"
              : timeFilter === "weekly"
                ? "No trades for this week"
                : timeFilter === "monthly"
                  ? "No trades for this month"
                  : "No trade data available"}
          </p>
        </div>
      ) : (
        <div className="h-[90%] w-full overflow-x-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 5, left: 5, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              />
              <YAxis
                tickFormatter={(value) => `₹${Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                width={60}
                domain={yAxisDomain}
              />
              <Tooltip
                formatter={(
                  value: number,
                  name: string,
                  props?: Payload<number, string>
                ) => {
                  if (name === "Positive" || name === "Negative") return null
                  const tradeCount = props?.payload?.tradeCount ?? 0
                  return [
                    <div key="profit-loss">₹{value.toFixed(2)}</div>,
                    <div key="trade-count">
                      {tradeCount} trade{tradeCount !== 1 ? "s" : ""}
                    </div>,
                    "Profit/Loss",
                  ]
                }}
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  minWidth: "180px",
                  padding: "8px 12px",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const positiveValue = payload[0]?.payload.positiveValue || 0
                    const negativeValue = payload[0]?.payload.negativeValue || 0
                    const totalValue = payload[0]?.payload.value || 0
                    const tradeCount = payload[0]?.payload.tradeCount || 0

                    return (
                      <div className="bg-white p-2 border rounded shadow-sm min-w-[200px]">
                        <p className="font-medium mb-1">{formatTooltipLabel(label)}</p>
                        <div className="flex justify-between mb-1">
                          <span className="text-green-500">Positive:</span>
                          <span className="text-green-500">₹{positiveValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-red-500">Negative:</span>
                          <span className="text-red-500">₹{negativeValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-1 border-t">
                          <span>Total:</span>
                          <span>₹{totalValue.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tradeCount} trade{tradeCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <ReferenceLine y={0} stroke="#000" strokeWidth={1} />

              {/* Positive area (above zero) */}
              <Area
                type="monotone"
                dataKey="positiveValue"
                stroke="none"
                fill={PROFIT_COLOR}
                fillOpacity={1}
                name="Positive"
                stackId="1"
              />

              {/* Negative area (below zero) */}
              <Area
                type="monotone"
                dataKey="negativeValue"
                stroke="none"
                fill={LOSS_COLOR}
                fillOpacity={1}
                name="Negative"
                stackId="1"
              />

              {/* Main line on top of both areas */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#000"
                strokeWidth={2}
                fill="none"
                name="Value"
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#000", fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
