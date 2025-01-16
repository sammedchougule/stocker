import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SlidersHorizontal } from 'lucide-react'

export default function Screener() {
  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <SlidersHorizontal className="mr-2 h-6 w-6 text-blue-500" />
            Screeners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg text-gray-600">
          Ready to Discover Hidden Gems.
          </p>
          <div className="mt-6 text-center text-3xl font-bold text-blue-500">
          Our Screener is in Development!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

