import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

const plans = [
  {
    name: "Monthly",
    price: "₹99",
    period: "/month",
    description: "Perfect for short-term traders",
    features: [
      "Real-time stock data updates",
      "Basic stock screening tools",
      "Limited historical data access",
      "Email support"
    ]
  },
  {
    name: "Yearly",
    price: "₹999",
    period: "/year",
    description: "Ideal for active investors",
    features: [
      "All Monthly plan features",
      "Advanced stock screening",
      "Full historical data access",
      "Priority email support",
      "Customizable watchlists"
    ]
  },
  {
    name: "Lifetime",
    price: "₹9,999",
    period: "one-time",
    description: "For dedicated market enthusiasts",
    features: [
      "All Yearly plan features",
      "API access for custom integrations",
      "Exclusive webinars and market insights",
      "Personal portfolio consultation",
      "Early access to new features"
    ]
  }
]

export function SubscriptionPlans() {
  return (
    <div className="mt-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-4xl font-bold mb-2">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full hover:bg-gray-400 transition-colors duration-300">Subscribe Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

