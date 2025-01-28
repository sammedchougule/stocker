'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CalendarClock } from 'lucide-react'
import Image from 'next/image'
import Link from "next/link"
import type { NewsData, NewsItem } from "./TodayNewsData"

// Mock data for earnings calendar
const earningsData = [
  {
    date: "28 Jan 2025",
    company: "Technichem Organics Ltd"
  },
  {
    date: "	28 Jan 2025",
    company: "JSW Infrastructure Ltd"
  },
  {
    date: "28 Jan 2025",
    company: "Piramal Pharma Ltd"
  },
  {
    date: "28 Jan 2025",
    company: "UTI Asset Management Company Ltd"
  },
  {
    date: "	28 Jan 2025",
    company: "SBI Cards & Payment Services Ltd"
  },
  {
    date: "	28 Jan 2025",
    company: "IIFL Capital Services Ltd"
  },
  {
    date: "	28 Jan 2025",
    company: "Rites Ltd"
  },
  {
    date: "	28 Jan 2025",
    company: "Mahanagar Gas Ltd"
  },
  {
    date: "	28 Jan 2025",
    company: "Suzlon Energy Ltd"
  }
]

interface TodayNewsProps {
  newsData: NewsData
}

export default function TodayNews({ newsData }: TodayNewsProps) {
  const renderNewsItems = (items: NewsItem[]) => (
    <div className="space-y-4">
      {items.map((news) => (
        <Link key={news.id} href={`/news/${news.id}`}>
          <div className="flex flex-row gap-4 items-start border-b pb-2 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
            {/* News Section */}
            <div className="flex-1 min-w-0">
            <p className="font-medium text-[16px] md:text-[18px] leading-snug line-clamp-2">{news.title}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2 hidden sm:block md:line-clamp-2">{news.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>{news.sub_category}</span>
                <span>•</span>
                <span>{new Date(news.date).toLocaleDateString()}</span>
              </div>
            </div>
            {/* Image Section */}
            <div className="flex-none w-1/5">
              <Image
                src={news.image_path || "/placeholder.svg"}
                alt={news.title}
                width={140}
                height={80}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )

  return (
    <div className="container mt-4 mx-auto sm:px-6 lg:px-8 items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* News Section */}
        <div className="lg:col-span-2">
          <Card className="h-[700px]">
          <CardHeader className="sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              {/* Left side: Title */}
              <CardTitle>Today&apos;s News</CardTitle>

              {/* Right side: Link */}
              <Link href="/news" className="text-blue-500 hover:underline text-md">
                See All
              </Link>
            </div>
          </CardHeader>

            <Tabs defaultValue="top-stories" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 sticky top-[50px] bg-white z-10">
                <TabsTrigger value="top-stories">Top stories</TabsTrigger>
                <TabsTrigger value="india">India</TabsTrigger>
                <TabsTrigger value="world">World markets</TabsTrigger>
              </TabsList>
              <CardContent className="overflow-y-auto h-[400px] scrollbar-hide">
                <TabsContent value="top-stories">{renderNewsItems(newsData.topStories)}</TabsContent>
                <TabsContent value="india">{renderNewsItems(newsData.india)}</TabsContent>
                <TabsContent value="world">{renderNewsItems(newsData.world)}</TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Earnings Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="h-[700px]">
            <CardHeader>
              <CardTitle>Earnings Calendar</CardTitle>
              {/* <p className="text-sm text-gray-500">Based on popular stocks</p> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {earningsData.map((earning, index) => (
                  <div
                  key={index}
                  className="flex items-start gap-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-1 min-w-[100px]">
                      <CalendarDays className="h-7 w-7 text-blue-500" /> {/* Larger icon */}
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

