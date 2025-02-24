
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import StockNewsCard from "./StockNewsCard"

// Mock data for earnings calendar
const earningsData = [
  { date: "24 Feb 2025", company: "Dev Information Technology Ltd." },
  { date: "25 Feb 2025", company: "Tempus AI" },
  { date: "25 Feb 2025", company: "Rain Commodities" },
  { date: "25 Feb 2025", company: "Home Depot" },
  { date: "27 Feb 2025", company: "Schaeffler India" },
  { date: "28 Feb 2025", company: "Rana Sugars Ltd." }
]

interface NewsItem {
  source: { name: string }
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
}

interface TodayNewsProps {
  stockNews: NewsItem[]
}

export default function TodayNews({ stockNews }: TodayNewsProps) {
  return (
    <div className="container mt-4 mx-auto sm:px-6 lg:px-8 items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* News Section */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-200px)] max-h-[620px]">
            <CardHeader className="sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <CardTitle>Market News</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto h-[calc(100%-80px)] pr-4 scrollbar-hide">
              <div className="space-y-4">
                {stockNews.map((news, index) => (
                  <StockNewsCard key={index} article={news} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-200px)] max-h-[620px]">
            <CardHeader>
              <CardTitle>Earnings Calendar</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-[calc(100%-80px)] pr-4 scrollbar-hide">
              <div className="space-y-2">
                {earningsData.map((earning, index) => (
                  <div key={index} className="flex items-start gap-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div className="flex flex-col items-center gap-1 min-w-[100px]">
                      <CalendarDays className="h-7 w-7 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-md">{earning.company}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span className="text-sm font-medium">{earning.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

