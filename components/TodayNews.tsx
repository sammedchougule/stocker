'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CalendarClock } from 'lucide-react'
import Image from 'next/image'

// Mock data for news
const newsData = {
  topStories: [
    {
      id: 1,
      source: "Analytics India Magazine",
      time: "7 hours ago",
      title: "Junior Devs are Letting AI Do the Heavy ",
      image: "https://via.placeholder.com/120x80?text=Top+Story+1"
    },
    {
      id: 2,
      source: "Bar and Bench",
      time: "4 hours ago",
      title: "NCLAT approves merger between Equinox India and Embassy Group",
      image: "https://via.placeholder.com/120x80?text=Top+Story+2"
    },
    {
      id: 3,
      source: "MotorOctane",
      time: "5 hours ago",
      title: "Upcoming Hyundai Creta Is Now Safer!",
      image: "https://via.placeholder.com/120x80?text=Top+Story+3"
    },
    {
      id: 9,
      source: "TechCrunch",
      time: "3 hours ago",
      title: "New Tech Innovations in 2025",
      image: "https://via.placeholder.com/120x80?text=Top+Story+4"
    }
  ],
  localMarket: [
    {
      id: 4,
      source: "Business Today",
      time: "5 hours ago",
      title: "Electrosteel Castings, PN Gadgil: YES Securities sees over 20% upside",
      image: "https://via.placeholder.com/120x80?text=Local+Market+1"
    },
    {
      id: 5,
      source: "Economic Times",
      time: "6 hours ago",
      title: "Local businesses thrive amidst economic challenges",
      image: "https://via.placeholder.com/120x80?text=Local+Market+2"
    }
  ],
  worldMarkets: [
    {
      id: 6,
      source: "Reuters",
      time: "2 hours ago",
      title: "Global markets await US inflation data",
      image: "https://via.placeholder.com/120x80?text=World+Market+1"
    },
    {
      id: 7,
      source: "BBC News",
      time: "1 hour ago",
      title: "European stocks rise as investors eye economic recovery",
      image: "https://via.placeholder.com/120x80?text=World+Market+2"
    },
    {
      id: 8,
      source: "CNBC",
      time: "30 minutes ago",
      title: "Asian markets mixed as investors digest economic data",
      image: "https://via.placeholder.com/120x80?text=World+Market+3"
    }
  ]
}

// Mock data for earnings calendar
const earningsData = [
  {
    date: "JAN 7",
    company: "One MobiKwik Systems Ltd",
    time: "Jan 7, 2025"
  },
  {
    date: "JAN 9",
    company: "Indian Renewable Energy Development Agency",
    time: "Jan 9, 2025, 12:08 PM"
  },
  {
    date: "JAN 9",
    company: "Tata Consultancy Services",
    time: "Jan 9, 2025, 12:08 PM"
  },
  {
    date: "JAN 9",
    company: "Tata Elxsi",
    time: "Jan 9, 2025"
  },
  {
    date: "JAN 10",
    company: "PCBL Chemical Ltd",
    time: "Jan 10, 2025, 12:08 PM"
  }
]

export default function TodayNews() {
  return (
    <div className="container mt-4 mx-auto sm:px-6 lg:px-8 items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* News Section */}
        <div className="lg:col-span-2">
          <Card className="h-[500px] ">
            <CardHeader className="sticky top-0 bg-white z-10">
              <CardTitle>Today&apos;s financial news</CardTitle>
            </CardHeader>
            <Tabs defaultValue="top-stories" className="w-full ">
              <TabsList className="grid w-full grid-cols-3 mb-4 sticky top-[50px] bg-white z-10">
                <TabsTrigger value="top-stories" className="active">Top stories</TabsTrigger>
                <TabsTrigger value="local-market" className="inactive">Local market</TabsTrigger>
                <TabsTrigger value="world-markets" className="inactive">World markets</TabsTrigger>
              </TabsList>
              <CardContent className="overflow-y-auto h-[400px] scrollbar-hide ">
                <TabsContent value="top-stories">
                  <div className="space-y-4">
                    {newsData.topStories.map((news) => (
                      <div key={news.id} className="flex gap-4 items-start border-b pb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium leading-snug hover:text-blue-600 cursor-pointer">
                            {news.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                        <div className="flex-none w-1/5">
                          <Image
                            src={news.image}
                            alt={news.title}
                            width={120}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="local-market">
                  <div className="space-y-4">
                    {newsData.localMarket.map((news) => (
                      <div key={news.id} className="flex gap-4 items-start border-b pb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium leading-snug hover:text-blue-600 cursor-pointer">
                            {news.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                        <div className="flex-none w-1/5">
                          <Image
                            src={news.image}
                            alt={news.title}
                            width={120}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="world-markets">
                  <div className="space-y-4">
                    {newsData.worldMarkets.map((news) => (
                      <div key={news.id} className="flex gap-4 items-start border-b pb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium leading-snug hover:text-blue-600 cursor-pointer">
                            {news.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                        <div className="flex-none w-1/5">
                          <Image
                            src={news.image}
                            alt={news.title}
                            width={120}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Earnings Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="h-[500px]">
            <CardHeader>
              <CardTitle>Earnings calendar</CardTitle>
              <p className="text-sm text-gray-500">Based on popular stocks</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.map((earning, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <CalendarDays className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{earning.date}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{earning.company}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CalendarClock className="h-3 w-3" />
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

