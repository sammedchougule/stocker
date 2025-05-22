"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, DollarSign, Percent, TrendingUp } from "lucide-react"

export default function JournalDashboard() {
  // Sample data - in a real app, this would come from an API or database
  const dashboardData = {
    totalProfit: 12580,
    winRate: 68,
    monthlyPerformance: 4250,
    weeklyPerformance: 1850,
    profitFactor: 2.3,
    averageTrade: 420,
    largestWin: 2800,
    largestLoss: -1200,
    recentTrades: [
      { id: 1, symbol: "RELIANCE", type: "LONG", entry: 2450, exit: 2520, pnl: 1400, date: "2025-05-17" },
      { id: 2, symbol: "HDFCBANK", type: "SHORT", entry: 1680, exit: 1640, pnl: 800, date: "2025-05-16" },
      { id: 3, symbol: "INFY", type: "LONG", entry: 1450, exit: 1420, pnl: -600, date: "2025-05-15" },
      { id: 4, symbol: "TATASTEEL", type: "SHORT", entry: 145, exit: 152, pnl: -350, date: "2025-05-14" },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime trading profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.winRate}%</div>
            <p className="text-xs text-muted-foreground">Percentage of winning trades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ₹{dashboardData.monthlyPerformance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Current month P&L</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">₹{dashboardData.weeklyPerformance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current week P&L</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profit Factor</CardTitle>
            <CardDescription>Ratio of gross profits to gross losses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.profitFactor}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {dashboardData.profitFactor > 2
                ? "Excellent performance"
                : dashboardData.profitFactor > 1.5
                  ? "Good performance"
                  : "Needs improvement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Trade</CardTitle>
            <CardDescription>Average profit/loss per trade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">₹{dashboardData.averageTrade}</div>
            <div className="flex items-center mt-2">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">12% higher than last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Largest Trades</CardTitle>
            <CardDescription>Biggest win and loss</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Largest Win</span>
              <span className="text-lg font-bold text-green-500">₹{dashboardData.largestWin.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Largest Loss</span>
              <span className="text-lg font-bold text-red-500">₹{dashboardData.largestLoss.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Your last 4 trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">Symbol</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-right py-2 font-medium">Entry</th>
                  <th className="text-right py-2 font-medium">Exit</th>
                  <th className="text-right py-2 font-medium">P&L</th>
                  <th className="text-right py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-border">
                    <td className="py-2">{trade.symbol}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${trade.type === "LONG" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                      >
                        {trade.type}
                      </span>
                    </td>
                    <td className="text-right py-2">₹{trade.entry}</td>
                    <td className="text-right py-2">₹{trade.exit}</td>
                    <td className={`text-right py-2 font-medium ${trade.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl}
                    </td>
                    <td className="text-right py-2 text-muted-foreground">{trade.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
