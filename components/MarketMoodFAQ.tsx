"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

export default function MarketMoodFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: "What is the Market Mood Index?",
      answer:
        "The Market Mood Index (MMI) is a tool designed to gauge market sentiment by analyzing various market indicators. It helps investors understand whether the market is driven by fear or greed, providing insights for better investment decisions.",
    },
    {
      question: "How should I use the Market Mood Index?",
      answer:
        "The MMI should be used as one of several tools in your investment decision-making process. When the index shows extreme fear, it may indicate a potential buying opportunity as markets might be oversold. Conversely, when it shows extreme greed, it may be time to be cautious as markets might be overbought.",
    },
    {
      question: "How often is the Market Mood Index updated?",
      answer:
        "The Market Mood Index is updated daily after market hours, reflecting the sentiment based on that day's market activity. This ensures you have the most current information for your investment decisions.",
    },
    {
      question: "Is the Market Mood Index a predictor of market movements?",
      answer:
        "While the MMI provides valuable insights into market sentiment, it should not be used as a standalone predictor of market movements. It's best used in conjunction with fundamental analysis, technical indicators, and your own investment strategy.",
    },
    {
      question: "Why does the Market Mood Index sometimes contradict market movements?",
      answer:
        "Market sentiment can sometimes diverge from actual market movements due to various factors such as sector-specific developments, global events, or institutional trading patterns. This divergence can actually provide valuable contrarian signals for investors.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="mb-16 px-4 md:px-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

      <div className="space-y-4 max-w-4xl mx-auto px-4">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className={`transition-all duration-300 ${openIndex === index ? "border-blue-500/50" : ""}`}
          >
            <CardContent className="p-0">
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
