import { ArrowRightIcon, InfoIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketGauge } from "@/components/market-mood/market-gauge"
import { MarketTrends } from "@/components/market-mood/market-trends"
import { MarketMetrics } from "@/components/market-mood/market-metrics"
import { HowItWorks } from "@/components/market-mood/how-it-works"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 md:py-12">
        <section className="py-12 md:py-16 px-6 md:px-10 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background rounded-lg">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Market Mood Index</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A comprehensive sentiment analysis tool that gauges market psychology and investor emotions
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                  Explore Metrics
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* You will add your custom gauge design in the MarketGauge component */}
              <MarketGauge value={72} />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 mb-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Current Market Mood</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The Market Mood Index is currently at <span className="font-bold text-emerald-600">72</span>, indicating{" "}
                <span className="font-bold text-emerald-600">Optimistic</span> sentiment
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                  <InfoIcon className="mr-1 h-4 w-4" />
                  <span>Market Sentiment Analysis</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">What This Means</h3>
                <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed">
                  A reading of 72 suggests investors are optimistic but not euphoric. Markets typically perform well in
                  this range, though caution is advised as we approach extreme optimism levels.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button variant="outline" className="inline-flex h-10 items-center justify-center">
                  Historical Data
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Sentiment Breakdown</CardTitle>
                  <CardDescription>Key factors influencing the current mood</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Retail Sentiment</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2 w-full bg-emerald-100" indicatorClassName="bg-emerald-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Institutional Sentiment</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2 w-full bg-emerald-100" indicatorClassName="bg-emerald-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Technical Indicators</span>
                        <span className="font-medium">70%</span>
                      </div>
                      <Progress value={70} className="h-2 w-full bg-emerald-100" indicatorClassName="bg-emerald-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>News Sentiment</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2 w-full bg-emerald-100" indicatorClassName="bg-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 mb-8 bg-muted/50 rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Market Metrics</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Key market indicators that influence the Market Mood Index
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <MarketMetrics />
          </div>
        </section>

        <section className="py-12 md:py-16 mb-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Historical Trends</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Track how market sentiment has evolved over time
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12 mb-10">
            <Tabs defaultValue="6m" className="w-full">
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="1m">1M</TabsTrigger>
                  <TabsTrigger value="3m">3M</TabsTrigger>
                  <TabsTrigger value="6m">6M</TabsTrigger>
                  <TabsTrigger value="1y">1Y</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="1m" className="mt-6">
                <MarketTrends period="1m" />
              </TabsContent>
              <TabsContent value="3m" className="mt-6">
                <MarketTrends period="3m" />
              </TabsContent>
              <TabsContent value="6m" className="mt-6">
                <MarketTrends period="6m" />
              </TabsContent>
              <TabsContent value="1y" className="mt-6">
                <MarketTrends period="1y" />
              </TabsContent>
              <TabsContent value="all" className="mt-6">
                <MarketTrends period="all" />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 md:py-16 mb-8 bg-muted/50 rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Understanding the methodology behind the Market Mood Index
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <HowItWorks />
          </div>
        </section>
      </main>
      <footer className="border-t bg-background py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 rounded-full bg-emerald-500"></div>
            Market Mood Index
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 Market Mood Index. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
