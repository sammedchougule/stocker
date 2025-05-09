

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import StockNewsCard from "./StockNewsCard"
import { unstable_noStore as noStore } from "next/cache"

// Mock data for earnings calendar
const earningsData = [
  { date: "21 Apr 2025", company: "Alok Industries Ltd" },
  { date: "22 Apr 2025", company: "AU Small Finance Bank Ltd" },
  { date: "22 Apr 2025", company: "Delta Corp Ltd" },
  { date: "22 Apr 2025", company: "HCL Technologies Ltd" },
  { date: "23 Apr 2025", company: "Havells India Ltd" },
  { date: "23 Apr2025", company: "Bajaj Housing Finance Ltd" },
]

interface NewsItem {
  source: { name: string }
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
}

async function fetchStockNews(): Promise<NewsItem[]> {
  noStore()
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const url = `https://newsapi.org/v2/everything?q=stock+market+india&from=${twoWeeksAgo}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) throw new Error("Failed to fetch stock news")
    const data = await response.json()
    return data.articles as NewsItem[]
  } catch (error) {
    console.error("Error fetching stock news:", error)
    return [] // Return empty array instead of throwing
  }
}

export default async function TodayNews() {
  let stockNews: NewsItem[] = []
  try {
    stockNews = await fetchStockNews()
  } catch (error) {
    console.error("Error in TodayNews component:", error)
  }

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* News Section */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] max-h-[620px] bg-white dark:bg-[#151719]">
              <CardHeader className="sticky top-0 bg-white dark:bg-[#151719] z-10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900 dark:text-white">Today&apos;s News</CardTitle>
                  {/* Removed the "See All" link */}
                </div>
              </CardHeader>
              <CardContent className="overflow-y-auto h-[calc(100%-80px)] pr-4 scrollbar-hide">
                <div className="space-y-4">
                  {stockNews.length > 0 ? (
                    stockNews.map((news, index) => <StockNewsCard key={index} article={news} />)
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No news articles available at the moment.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Calendar Section */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-200px)] max-h-[620px] bg-white dark:bg-[#151719]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Earnings Calendar</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto h-[calc(100%-80px)] pr-4 scrollbar-hide">
                <div className="space-y-2">
                  {earningsData.map((earning, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-1 min-w-[100px]">
                        <CalendarDays className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-md text-gray-900 dark:text-white">{earning.company}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  )
}
