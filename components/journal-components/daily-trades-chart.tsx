"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { format, subWeeks, startOfWeek, endOfWeek, addWeeks, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Database } from "@/types/supabase"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface DailyTradesChartProps {
  trades: Trade[]
}

export default function DailyTradesChart({ trades }: DailyTradesChartProps) {
  // Initialize with the current week
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return startOfWeek(new Date(), { weekStartsOn: 0 })
  })

  const getWeeklyData = (startDate: Date) => {
    // Create an array for each day of the week
    return Array.from({ length: 7 }, (_, index) => {
      const currentDate = addDays(startDate, index)
      const dateString = format(currentDate, "yyyy-MM-dd")
      const dayTrades = trades.filter((trade) => trade.date === dateString)
      const profitLoss = dayTrades.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0)

      return {
        date: format(currentDate, "EEE"),
        fullDate: dateString,
        profitLoss,
        trades: dayTrades.length,
      }
    })
  }

  const getWeeklyTrades = (startDate: Date): Trade[] => {
    const weekEnd = endOfWeek(startDate, { weekStartsOn: 0 })
    const startDateString = format(startDate, "yyyy-MM-dd")
    const endDateString = format(weekEnd, "yyyy-MM-dd")

    return trades
      .filter((trade) => trade.date >= startDateString && trade.date <= endDateString)
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const chartData = getWeeklyData(currentWeekStart)
  const weeklyTrades = getWeeklyTrades(currentWeekStart)
  const hasTradesInWeek = weeklyTrades.length > 0

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-2 py-1 mb-4">
        <Button onClick={goToPreviousWeek} variant="outline" size="sm" className="h-8">
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Prev</span>
        </Button>
        <span className="text-sm font-medium text-black dark:text-white">
          {format(currentWeekStart, "MMM d")} -{" "}
          {format(endOfWeek(currentWeekStart, { weekStartsOn: 0 }), "MMM d, yyyy")}
        </span>
        <Button onClick={goToNextWeek} variant="outline" size="sm" className="h-8">
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-grow px-4">
        {hasTradesInWeek ? (
          <div className="w-full h-full bg-white dark:bg-[#1b1d20] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tickFormatter={(value) => `₹${Math.abs(value)}`}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  width={40}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
                  labelStyle={{ color: "#111827" }}
                  formatter={(value: number) => [`₹${Math.abs(value).toFixed(2)}`, "Profit/Loss"]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `Date: ${payload[0].payload.fullDate}`
                    }
                    return `Date: ${label}`
                  }}
                />
                <ReferenceLine y={0} stroke="#6b7280" />
                <Bar dataKey="profitLoss" name="Profit/Loss" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.profitLoss >= 0 ? "#10b981" : "#ef4444"}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center border rounded-lg bg-muted/10 dark:bg-[#1a1b1e] border-gray-200 dark:border-gray-700 h-[300px]">
            <p className="text-muted-foreground dark:text-gray-400">No trades for this week</p>
          </div>
        )}
      </div>
    </div>

  )
}
