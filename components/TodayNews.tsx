'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CalendarClock } from 'lucide-react'
import Image from 'next/image'

// Mock data for news
const newsData = {
  "topStories": [
    {
      "id": 1,
      "source": "Associated Press",
      "time": "Today",
      "title": "Fossilized dinosaur feces and vomit help scientists reconstruct the creatures rise",
      "image": "https://via.placeholder.com/120x80?text=Top+Story+1",
      "url": "https://apnews.com/article/fossilized-dinosaur-feces-vomit-scientists-reconstruct-2025-01-17"
    },
    {
      "id": 2,
      "source": "Financial Times",
      "time": "Today",
      "title": "Israeli cabinet set to vote on Gaza ceasefire deal",
      "image": "https://via.placeholder.com/120x80?text=Top+Story+2",
      "url": "https://www.ft.com/content/46705db3-ffcd-4b40-b87d-116d04833e6a"
    },
    {
      "id": 3,
      "source": "Reuters",
      "time": "Today",
      "title": "Suzuki Motor president says India to be global production hub for EVs",
      "image": "https://via.placeholder.com/120x80?text=Top+Story+3",
      "url": "https://www.reuters.com/business/autos-transportation/suzuki-motor-president-says-india-be-global-production-hub-evs-2025-01-16/"
    },
    {
      "id": 4,
      "source": "Vogue Business",
      "time": "Today",
      "title": "Richemont sales rise 10% in Q3",
      "image": "https://via.placeholder.com/120x80?text=Top+Story+4",
      "url": "https://www.voguebusiness.com/story/companies/richemont-sales-rise-10-per-cent-in-q3"
    }
  ],
  "localMarket": [
    {
      "id": 5,
      "source": "Hindustan Times",
      "time": "Today",
      "title": "Drumstick prices soar above ₹400/kg in Pune markets due to unseasonal rains",
      "image": "https://via.placeholder.com/120x80?text=Local+Market+1",
      "url": "https://www.hindustantimes.com/cities/pune-news/drumstick-prices-soar-above-400-kg-in-pune-markets-due-to-unseasonal-rains-101733509630045.html"
    },
    {
      "id": 6,
      "source": "Punekar News",
      "time": "Today",
      "title": "Increased Demand On Bhogi Causes Fruit And Vegetable Prices To Rise In Pune's Market Yard",
      "image": "https://via.placeholder.com/120x80?text=Local+Market+2",
      "url": "https://www.punekarnews.in/increased-demand-on-bhogi-causes-fruit-and-vegetable-prices-to-rise-in-punes-market-yard/"
    },
    {
      "id": 7,
      "source": "Pune Mirror",
      "time": "Today",
      "title": "Pune News: Fruit and Vegetable Prices Drop Due to Increased Arrivals at Wholesale Market in Shree Chhatrapati Shivaji Market Yard",
      "image": "https://via.placeholder.com/120x80?text=Local+Market+3",
      "url": "https://punemirror.com/pune/others/pune-news-fruit-and-vegetable-prices-drop-due-to-increased-arrivals-at-wholesale-market-in-shree-chhatrapati-shivaji/cid1736086821.htm"
    },
    {
      "id": 8,
      "source": "Indian Express",
      "time": "Today",
      "title": "Pune firm CEO lured by 'Facebook friend', loses Rs 42 lakh in share trading fraud",
      "image": "https://via.placeholder.com/120x80?text=Local+Market+4",
      "url": "https://indianexpress.com/article/cities/pune/pune-firm-ceo-lured-by-facebook-friend-loses-rs-42-lakh-in-share-trading-fraud-2025-01-17/"
    }
  ],
  "worldMarkets": [
    {
      "id": 9,
      "source": "Reuters",
      "time": "Today",
      "title": "Global markets await US inflation data",
      "image": "https://via.placeholder.com/120x80?text=World+Market+1",
      "url": "https://www.reuters.com/markets/"
    },
    {
      "id": 10,
      "source": "BBC News",
      "time": "Today",
      "title": "European stocks rise as investors eye economic recovery",
      "image": "https://via.placeholder.com/120x80?text=World+Market+2",
      "url": "https://www.bbc.com/news/topics/cgdzpg5yvdvt"
    },
    {
      "id": 11,
      "source": "CNBC",
      "time": "Today",
      "title": "Asian markets mixed as investors digest economic data",
      "image": "https://via.placeholder.com/120x80?text=World+Market+3",
      "url": "https://www.cnbc.com/asia-markets/"
    },
    {
      "id": 12,
      "source": "Financial Times",
      "time": "Today",
      "title": "US dollar strengthens amid global market volatility",
      "image": "https://via.placeholder.com/120x80?text=World+Market+4",
      "url": "https://www.ft.com/content/us-dollar-strengthens"
    }
  ]
}



// Mock data for earnings calendar
const earningsData = [
  {
    date: "JAN 16",
    company: "Reliance Industries",
    time: "Jan 16, 2025, 12:08 PM"
  },
  {
    date: "JAN 16",
    company: "Axis Bank",
    time: "Jan 16, 2025, 12:08 PM"
  },
  {
    date: "JAN 16",
    company: "Infosys",
    time: "Jan 16, 2025, 12:08 PM"
  },
  {
    date: "JAN 18",
    company: "Kotak Mahindra Bank",
    time: "Jan 18, 2025, 09:15 AM"
  },
  {
    date: "JAN 22",
    company: "Persistent",
    time: "Jan 22, 2025, 12:08 PM"
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
                  <div className="space-y-4 ">
                    {newsData.topStories.map((news) => (
                      <a key={news.id} href={news.url} target="_blank" rel="noreferrer">
                        <div  className="flex gap-4 items-start border-b pb-2 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
                        <div className="flex-1 min-w-0 ">
                          <h3 className="font-medium leading-snug">
                            {news.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span >{news.time}</span>
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
                      </a>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="local-market">
                  <div className="space-y-4">
                    {newsData.localMarket.map((news) => (
                      <a key={news.id} href={news.url} target="_blank" rel="noreferrer">
                        <div  className="flex gap-4 items-start border-b pb-2 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
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
                      </a>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="world-markets">
                  <div className="space-y-4">
                    {newsData.worldMarkets.map((news) => (
                      <a  key={news.id} href={news.url} target="_blank" rel="noreferrer">
                        <div className="flex gap-4 items-start border-b pb-2 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
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
                      </a>
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

