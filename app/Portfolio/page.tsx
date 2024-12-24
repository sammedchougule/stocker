import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from 'lucide-react'

export default function Portfolio() {
  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Briefcase className="mr-2 h-6 w-6 text-green-500" />
            Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
          "The Road to Smart Investments Begins with Your Portfolio"
          </p>
          <div className="mt-6 text-center text-3xl font-bold text-green-500">
          Portfolio Page in Development!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

