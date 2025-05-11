"use client"

import { useState, useEffect, useCallback } from "react"
import AddTradeForm from "@/components/journal-components/add-trade-form"
import SimpleCalendar from "@/components/journal-components/simple-calendar"
import TradeTable from "@/components/journal-components/trade-table"
import DailyTradesChart from "@/components/journal-components/daily-trades-chart"
import PerformanceChart from "@/components/journal-components/performance-chart"
import TradeDistributionChart from "@/components/journal-components/trade-distribution-chart"
import WinLossChart from "@/components/journal-components/win-loss-chart"
import TradeSizePLChart from "@/components/journal-components/trade-size-pl-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { startOfWeek, endOfWeek, subWeeks } from "date-fns"
import { mockTrades } from "@/lib/data"
import { AlertCircle } from "lucide-react"
import CustomizedProgressBars from "@/components/CustomizedProgressBars"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

export default function Journal() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrades = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        throw new Error("Failed to initialize Supabase client")
      }

      const { data, error } = await supabase.from("journal").select("*").order("date", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message)
      }

      setTrades(data || [])
    } catch (error) {
      console.error("Error fetching trades:", error)

      // Use mock data as fallback
      setTrades(mockTrades as unknown as Trade[])

      // Still set the error for display purposes
      setError(error instanceof Error ? error.message : "Failed to fetch trades")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrades()
  }, [fetchTrades])

  // Calculate total profit/loss
  const getTotalProfitLoss = (trades: Trade[]) => {
    return trades.reduce((total, trade) => total + (trade.profit_loss || 0), 0)
  }

  // Calculate win rate
  const getWinRate = (trades: Trade[]) => {
    if (trades.length === 0) return 0
    const winningTrades = trades.filter((trade) => (trade.profit_loss || 0) > 0)
    return winningTrades.length / trades.length
  }

  const totalProfitLoss = getTotalProfitLoss(trades)
  const winRate = getWinRate(trades)

  // Calculate today's trades and win ratio
  const today = new Date().toISOString().split("T")[0]
  const todayTrades = trades.filter((trade) => trade.date === today)
  const todayWinRate = getWinRate(todayTrades)
  const todayProfitLoss = getTotalProfitLoss(todayTrades)

  const tabStyle = "px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
  const activeTabStyle = `${tabStyle} text-primary border-b-2 border-primary`

  // Filter trades for the current week or last week if no current week trades
  const getCurrentWeekTrades = () => {
    const today = new Date()
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 })
    const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 })

    const currentWeekStartStr = currentWeekStart.toISOString().split("T")[0]
    const currentWeekEndStr = currentWeekEnd.toISOString().split("T")[0]

    // Filter trades for current week
    const currentWeekTrades = trades.filter(
      (trade) => trade.date >= currentWeekStartStr && trade.date <= currentWeekEndStr,
    )

    // If current week has trades, return them
    if (currentWeekTrades.length > 0) {
      return currentWeekTrades
    }

    // Otherwise, get last week's trades
    const lastWeekStart = subWeeks(currentWeekStart, 1)
    const lastWeekEnd = subWeeks(currentWeekEnd, 1)

    const lastWeekStartStr = lastWeekStart.toISOString().split("T")[0]
    const lastWeekEndStr = lastWeekEnd.toISOString().split("T")[0]

    return trades.filter((trade) => trade.date >= lastWeekStartStr && trade.date <= lastWeekEndStr)
  }

  const recentTrades = getCurrentWeekTrades()
  const isCurrentWeek =
    recentTrades.length > 0 &&
    recentTrades[0].date >= startOfWeek(new Date(), { weekStartsOn: 0 }).toISOString().split("T")[0]

  const handleTradeUpdated = () => {
    fetchTrades()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 flex items-center justify-center h-screen">
        <CustomizedProgressBars />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Journal</h1>
        <AddTradeForm onTradeAdded={handleTradeUpdated} />
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Error connecting to database: {error}</p>
            <p className="text-sm text-red-700">Please check your database connection or try again later.</p>
          </div>
        </div>
      )}

      {trades.length === 0 && !isLoading && !error && (
        <div className="mb-6 p-4 border border-blue-300 bg-blue-50 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">No trades found</p>
            <p className="text-sm text-blue-700">Add your first trade using the "Add Trade" button above.</p>
          </div>
        </div>
      )}

      <nav className="flex space-x-4 border-b mb-6 overflow-x-auto">
        <button
          className={activeTab === "dashboard" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={activeTab === "analytics" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={activeTab === "allTrades" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("allTrades")}
        >
          All Trades
        </button>
      </nav>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="bg-white text-black dark:bg-[#1b1d20] dark:text-white">
              <CardHeader>
                <CardTitle className="dark:text-white">Total Profit/Loss</CardTitle>
                <CardDescription>Overall performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ₹{totalProfitLoss.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-black dark:bg-[#1b1d20] dark:text-white">
              <CardHeader>
                <CardTitle className="dark:text-white">Win Rate</CardTitle>
                <CardDescription>Percentage of winning trades</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{(winRate * 100).toFixed(2)}%</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-black dark:bg-[#1b1d20] dark:text-white">
              <CardHeader>
                <CardTitle className="dark:text-white">Total Trades</CardTitle>
                <CardDescription>Number of trades recorded</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{trades.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-black dark:bg-[#1b1d20] dark:text-white">
              <CardHeader>
                <CardTitle className="dark:text-white">Today's Performance</CardTitle>
                <CardDescription>Today's trading activity</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${todayProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ₹{todayProfitLoss.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {todayTrades.length} trades • Win rate: {(todayWinRate * 100).toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </div>


          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="lg:col-span-1 overflow-hidden text-black dark:bg-[#1b1d20]">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Trading Calendar</CardTitle>
                <CardDescription>View your trading activity by date</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] sm:h-[450px] md:h-[500px] lg:h-[450px]">
                  <SimpleCalendar trades={trades} />
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1 overflow-hidden flex flex-col text-black dark:bg-[#1b1d20]">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Weekly Trading</CardTitle>
                <CardDescription>View daily and weekly trade details</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <div className="h-[400px] sm:h-[450px] md:h-[500px] lg:h-[450px]">
                  <DailyTradesChart trades={trades} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-[#1b1d20]">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">{isCurrentWeek ? "This Week's Trades" : "Last Week's Trades"}</CardTitle>
              <CardDescription>
                {recentTrades.length === 0
                  ? "No trades found for the last two weeks"
                  : `Showing ${recentTrades.length} trades`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradeTable trades={recentTrades} onTradeUpdated={handleTradeUpdated} />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1b1d20]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-black dark:text-white">Performance Over Time</CardTitle>
                <CardDescription>Cumulative profit/loss from all trades</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[450px]">
                <PerformanceChart trades={trades} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <TradeDistributionChart trades={trades} />
            <Card className="bg-white dark:bg-[#1b1d20]">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Win/Loss Ratio</CardTitle>
                <CardDescription>Comparison of winning vs losing trades by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <WinLossChart trades={trades} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-[#1b1d20]">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Trade Size vs. Profit/Loss</CardTitle>
              <CardDescription>Relationship between trade size and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[450px]">
                <TradeSizePLChart trades={trades} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "allTrades" && (
        <Card className="relative overflow-hidden bg-white dark:bg-[#1b1d20]">
          <CardHeader className="sticky top-0 z-30 bg-card border-b">
            <CardTitle className="text-black dark:text-white">All Trades</CardTitle>
            <CardDescription>Complete history of all your trades</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <TradeTable trades={trades} showAll={true} onTradeUpdated={handleTradeUpdated} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
