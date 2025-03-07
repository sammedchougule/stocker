import { Metadata } from "next";
import { metadataConfig } from "@/lib/metadataConfig";

export const metadata: Metadata = {
  title: metadataConfig.screener.title,
  description: metadataConfig.screener.description,
  keywords: metadataConfig.screener.keywords.join(", "),
  openGraph: {
    ...metadataConfig.default.openGraph,
    title: metadataConfig.screener.title,
    description: metadataConfig.screener.description,
  },
};


"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


interface ScreenerCard {
  title: string
  description: string
}

const fundamentalScreeners: ScreenerCard[] = [
  {
    title: "Dividend Gems",
    description: "High dividend yield companies with a track record of not cutting dividends",
  },
  {
    title: "Cash Rich Smallcaps",
    description: "Profitable Smallcap companies with growing cash flow and earnings",
  },
  {
    title: "Money Minters",
    description:
      "Companies good at quickly turning around cash to generate profits due to low/negative cash conversion cycles",
  },
]

const technicalScreeners: ScreenerCard[] = [
  {
    title: "Nearing Breakout",
    description: "A technical screen to identify stocks in high momentum that are nearing breakout",
  },
  {
    title: "Investing In A New Me!",
    description: "Stocks with low expense ratios and gold ETFs uncovering the Pro-life",
  },
  {
    title: "Limited Variability",
    description: "Low risk, large cap stocks to achieve market beating returns",
  },
]

function ScreenerCardComponent({ screener }: { screener: ScreenerCard }) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-[#151719]">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{screener.title}</CardTitle>
        <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">{screener.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex dark:bg-gray-800"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Screeners() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-black">
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Fundamental Screens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundamentalScreeners.map((screener) => (
            <ScreenerCardComponent key={screener.title} screener={screener} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Technical & Momentum Screens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalScreeners.map((screener) => (
            <ScreenerCardComponent key={screener.title} screener={screener} />
          ))}
        </div>
      </section>
    </div>
  )
}

