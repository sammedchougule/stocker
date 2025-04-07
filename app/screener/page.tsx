"use client"


import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ScreenerCard {
  title: string;
  description: string;
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
];

const technicalScreeners: ScreenerCard[] = [
  {
    title: "Near Breakout",
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
];

function ScreenerCardComponent({ screener }: { screener: ScreenerCard }) {
  const href = `/screener/${encodeURIComponent(screener.title)}`;

  return (
    <Link href={href} passHref>
      <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-[#151719] cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{screener.title}</CardTitle>
          <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">{screener.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
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
  );
}
