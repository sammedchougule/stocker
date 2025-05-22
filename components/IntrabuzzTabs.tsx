"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IntrabuzzClient from "@/components/IntrabuzzClient"
import SectorView from "@/components/SectorView"
import type { Stock } from "@/lib/utils/fetchStocks"
import { BarChart3, PieChart, TrendingUp } from "lucide-react"
import HeatmapTab from "@/components/HeatmapTab"

interface IntrabuzzTabsProps {
  initialStocks: Stock[]
}

export default function IntrabuzzTabs({ initialStocks }: IntrabuzzTabsProps) {
  const [activeTab, setActiveTab] = useState("intraday")

  return (
    <Tabs
      defaultValue="intraday"
      className="w-full"
      onValueChange={(value) => {
        setActiveTab(value)
        // Reset the SectorBars animation when switching to the sectors tab
        if (value === "sectors") {
          // Force a re-render of the SectorView component
          const sectorView = document.querySelector('[data-value="sectors"]')
          if (sectorView) {
            sectorView.classList.add("tab-activated")
            setTimeout(() => {
              sectorView.classList.remove("tab-activated")
            }, 50)
          }
        }
      }}
    >
      {/* Sticky tabs container */}
      <div className="sticky top-24 md:top-24 z-40 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-full max-w-md bg-[#121212] border border-white/10 p-1 rounded-full">
              <TabsTrigger
                value="intraday"
                className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-green-600 data-[state=active]:shadow-md"
              >
                <TrendingUp className={`h-4 w-4 ${activeTab === "intraday" ? "text-green-500" : ""}`} />
                <span>Intrabuzz</span>
              </TabsTrigger>
              <TabsTrigger
                value="sectors"
                className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900 data-[state=active]:to-blue-600 data-[state=active]:shadow-md"
              >
                <BarChart3 className={`h-4 w-4 ${activeTab === "sectors" ? "text-blue-500" : ""}`} />
                <span>Sectors</span>
              </TabsTrigger>
              <TabsTrigger
                value="heatmap"
                className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-purple-600 data-[state=active]:shadow-md"
              >
                <PieChart className={`h-4 w-4 ${activeTab === "heatmap" ? "text-purple-500" : ""}`} />
                <span>Heatmap</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </div>

      <TabsContent value="intraday">
        <IntrabuzzClient initialStocks={initialStocks} />
      </TabsContent>

      <TabsContent value="sectors">
        <SectorView stocks={initialStocks} />
      </TabsContent>

      <TabsContent value="heatmap">
        <HeatmapTab stocks={initialStocks} />
      </TabsContent>
    </Tabs>
  )
}
