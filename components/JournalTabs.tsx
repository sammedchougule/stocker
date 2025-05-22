"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, BookText, ClipboardList, LineChart, PieChart } from "lucide-react"
import JournalDashboard from "@/components/JournalDashboard"

export default function JournalTabs() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <Tabs
      defaultValue="dashboard"
      className="w-full"
      onValueChange={(value) => {
        setActiveTab(value)
      }}
    >
      <div className="sticky top-0 mt-2 md:top-16 z-40 bg-background border-b border-border py-4">
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl bg-[#121212] border border-white/10 p-1 rounded-full">
            <TabsTrigger
              value="dashboard"
              className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-green-600 data-[state=active]:shadow-md"
            >
              <PieChart className={`h-4 w-4 ${activeTab === "dashboard" ? "text-green-500" : ""}`} />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900 data-[state=active]:to-blue-600 data-[state=active]:shadow-md"
            >
              <BarChart3 className={`h-4 w-4 ${activeTab === "analytics" ? "text-blue-500" : ""}`} />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="trades"
              className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-purple-600 data-[state=active]:shadow-md"
            >
              <LineChart className={`h-4 w-4 ${activeTab === "trades" ? "text-purple-500" : ""}`} />
              <span className="hidden sm:inline">Trades</span>
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-900 data-[state=active]:to-yellow-600 data-[state=active]:shadow-md"
            >
              <BookText className={`h-4 w-4 ${activeTab === "notes" ? "text-yellow-500" : ""}`} />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger
              value="tradelog"
              className="rounded-full flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-900 data-[state=active]:to-orange-600 data-[state=active]:shadow-md"
            >
              <ClipboardList className={`h-4 w-4 ${activeTab === "tradelog" ? "text-orange-500" : ""}`} />
              <span className="hidden sm:inline">Trade Log</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="dashboard">
        <JournalDashboard />
      </TabsContent>

      <TabsContent value="analytics">
        <div className="text-center py-12 text-muted-foreground">
          <p>Analytics component will be implemented next.</p>
        </div>
      </TabsContent>

      <TabsContent value="trades">
        <div className="text-center py-12 text-muted-foreground">
          <p>Trades component will be implemented next.</p>
        </div>
      </TabsContent>

      <TabsContent value="notes">
        <div className="text-center py-12 text-muted-foreground">
          <p>Notes component will be implemented next.</p>
        </div>
      </TabsContent>

      <TabsContent value="tradelog">
        <div className="text-center py-12 text-muted-foreground">
          <p>Trade Log component will be implemented next.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
