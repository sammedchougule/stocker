import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid } from 'lucide-react'

export default function Heatmap() {
  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Grid className="mr-2 h-6 w-6 text-orange-500" />
            Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
          "Get Ready to See the Market in Full Color"
          </p>
          <div className="mt-6 text-center text-3xl font-bold text-orange-500">
          Our Heatmap Feature is Almost Here!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

