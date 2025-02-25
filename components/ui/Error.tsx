import type React from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  message: string
  type?: "fetch" | "stock" | "general"
}

const Error: React.FC<ErrorProps> = ({ message, type = "general" }) => {
  const handleRefresh = () => {
    window.location.reload()
  }

  const getErrorMessage = () => {
    switch (type) {
      case "fetch":
        return "Failed to fetch data. Please check your internet connection and try again."
      case "stock":
        return "Failed to fetch stock data. Our servers might be experiencing issues. Please try again later."
      default:
        return message || "An unexpected error occurred."
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-red-50 dark:bg-red-900">
        <CardContent className="flex flex-col items-center p-6">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
          <div className="text-red-800 dark:text-red-200 text-center">
            <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
            <p className="mb-4">{getErrorMessage()}</p>
          </div>
          <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700 text-white">
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Error

