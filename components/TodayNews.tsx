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
    date: "JAN 27",
    company: "Bajaj Housing Finance Ltd",
    time: "Jan 16, 2025, 12:08 PM"
  },
  {
    date: "JAN 27",
    company: "Adani Wilmar Ltd",
    time: "Jan 16, 2025, 12:08 PM"
  },
  {
    date: "JAN 27",
    company: "Aditya Birla Sun Life AMC Ltd",
    time: "Jan 16, 2025, 12:08 PM"
  },
  {
    date: "JAN 27",
    company: "360 One Wam Ltd",
    time: "Jan 18, 2025, 09:15 AM"
  },
  {
    date: "JAN 27",
    company: "New India Assurance Company Ltd",
    time: "Jan 22, 2025, 12:08 PM"
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
          <div className="flex gap-4 items-start border-b pb-2 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-[16px] leading-snug line-clamp-2">{news.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{news.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>{news.sub_category}</span>
                <span>•</span>
                <span>{new Date(news.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex-none w-1/5">
              <Image
                src={news.image_path || "/placeholder.svg"}
                alt={news.title}
                width={140}
                height={80}
                className="rounded-lg "
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
          <Card className="h-[500px]">
            <CardHeader className="sticky top-0 bg-white z-10">
              <CardTitle>Today&apos;s financial news</CardTitle>
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
          <Card className="h-[500px]">
            <CardHeader>
              <CardTitle>Earnings calendar</CardTitle>
              {/* <p className="text-sm text-gray-500">Based on popular stocks</p> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.map((earning, index) => (
                  <div
                  key={index}
                  className="flex items-start gap-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-1 min-w-[100px]">
                      <CalendarDays className="h-7 w-7 text-blue-500" /> {/* Larger icon */}
                      <span className="text-sm font-medium">{earning.date}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-md">{earning.company}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CalendarClock className="h-4 w-4" />
                        <span>{earning.time}</span>
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

