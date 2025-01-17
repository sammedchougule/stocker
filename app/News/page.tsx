"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"

export default function NewsPage() {


  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Newspaper className="mr-2 h-6 w-6 text-orange-500" />
            News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg text-gray-600">
          Soon will be able to see the latest news here!
          </p>
          <div className="mt-6 text-center text-3xl font-bold text-orange-500">
          Our News will be live soon!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}