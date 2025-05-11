"use client"

import React from "react"
import { FileText } from "lucide-react"
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isToday } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Database } from "@/types/supabase"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface SimpleCalendarProps {
  trades: Trade[]
  onDateSelect?: (date: Date) => void
}

const SimpleCalendar = ({ trades }: SimpleCalendarProps) => {
  // Initialize with the current month
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const tradeDates = React.useMemo(() => {
    return trades.reduce(
      (acc, trade) => {
        if (!acc[trade.date]) {
          acc[trade.date] = {
            trades: [],
            totalProfitLoss: 0,
          }
        }
        acc[trade.date].trades.push(trade)
        acc[trade.date].totalProfitLoss += trade.profit_loss || 0
        return acc
      },
      {} as Record<string, { trades: Trade[]; totalProfitLoss: number }>,
    )
  }, [trades])

  // Format currency in K format (e.g., 2500 -> 2.5K, 2150 -> 2.1K, 2190 -> 2.2K)
  const formatCurrency = (amount: number): string => {
    const absAmount = Math.abs(amount)

    if (absAmount >= 1000) {
      // Convert to K format with one decimal place
      const inK = absAmount / 1000
      // Round to 1 decimal place
      const rounded = Math.round(inK * 10) / 10
      return `${rounded}K`
    }

    // For smaller amounts, just return the number
    return absAmount.toString()
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateString = format(day, "yyyy-MM-dd")
        const dayTrades = tradeDates[dateString]
        const isCurrentMonth = format(day, "M") === format(currentDate, "M")
        const isTodayDate = isToday(day)
        const hasTrades = !!dayTrades && isCurrentMonth

        // Determine background color based on conditions
        let bgColor = ""
        if (!isCurrentMonth) {
          bgColor = "bg-gray-50"
        } else if (isTodayDate) {
          bgColor = "bg-blue-100" // Light blue background for today
        } else if (dayTrades) {
          bgColor = dayTrades.totalProfitLoss >= 0 ? "bg-green-100" : "bg-red-100"
        }

        days.push(
          <div
            key={day.toString()}
            className={`relative p-1 sm:p-2 border min-h-[60px] 
              ${!isCurrentMonth ? "bg-gray-50 dark:bg-[#1b1d20]" : ""} 
              ${bgColor} border-gray-200 dark:border-gray-700`}
          >
            <span
              className={`text-xs sm:text-sm 
                ${!isCurrentMonth ? "text-gray-400 dark:text-gray-500" : "text-black dark:text-white"} 
                ${isTodayDate ? "font-bold" : ""}`}
            >
              {format(day, "d")}
            </span>
            {dayTrades && isCurrentMonth && (
              <div className="absolute bottom-1 left-1 right-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-0.5 text-[10px] sm:text-xs">
                  <span
                    className={`${dayTrades.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"} font-medium`}
                  >
                    ₹{formatCurrency(dayTrades.totalProfitLoss)}
                  </span>
                  <div className="flex items-center gap-0.5 text-black dark:text-black">
                    <FileText className="h-3 w-3 text-black" />
                    <span>{dayTrades.trades.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-px">
          {days}
        </div>,
      )
      days = []
    }
    return <div className="bg-white dark:bg-[#1b1d20] text-black dark:text-white ">{rows}</div>
  }

  return (
    <div className="w-full h-full flex flex-col p-2 bg-white dark:bg-[#1b1d20] text-black dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
          }
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Prev</span>
        </Button>
        <h2 className="text-sm sm:text-base font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
          }
        >
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-7 gap-px mb-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-medium p-1 sm:p-2 bg-gray-100 dark:bg-[#2a2d31] text-[10px] sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>
        {renderCalendar()}
      </div>
    </div>

  )
}

export default SimpleCalendar
