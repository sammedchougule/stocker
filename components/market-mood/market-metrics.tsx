import { ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MarketMetrics() {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
          <CardDescription>Major Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">4,783.45</div>
            <div className="flex items-center text-emerald-500">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>1.2%</span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <TrendingUpIcon className="mr-1 h-3 w-3" />
            <span>Up 5.3% this month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">VIX</CardTitle>
          <CardDescription>Volatility Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">16.24</div>
            <div className="flex items-center text-red-500">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              <span>3.5%</span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <TrendingDownIcon className="mr-1 h-3 w-3" />
            <span>Down 12% this month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Put/Call Ratio</CardTitle>
          <CardDescription>Options Sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">0.82</div>
            <div className="flex items-center text-emerald-500">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>0.05</span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span>Neutral (0.7-0.9 is neutral range)</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">10Y Treasury Yield</CardTitle>
          <CardDescription>Bond Market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">3.85%</div>
            <div className="flex items-center text-red-500">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              <span>0.03%</span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <TrendingDownIcon className="mr-1 h-3 w-3" />
            <span>Down 0.2% this month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">AAII Bull-Bear Spread</CardTitle>
          <CardDescription>Investor Sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">+12.5%</div>
            <div className="flex items-center text-emerald-500">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>2.3%</span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span>Moderately bullish (historical avg: +7.5%)</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">CNN Fear & Greed</CardTitle>
          <CardDescription>Market Sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">68</div>
            <div className="flex items-center">
              <span className="text-emerald-500 font-medium">Greed</span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <TrendingUpIcon className="mr-1 h-3 w-3" />
            <span>Up from 55 (Neutral) last week</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
