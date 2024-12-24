'use client'

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState, useMemo } from 'react'
import { Stock } from '@/types/Stock'

// Nifty 50 stocks array
const NIFTY50_STOCKS = [
  "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK",
  "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BPCL", "BHARTIARTL",
  "BRITANNIA", "CIPLA", "COALINDIA", "DIVISLAB", "DRREDDY",
  "EICHERMOT", "GRASIM", "HCLTECH", "HDFCBANK", "HDFCLIFE",
  "HEROMOTOCO", "HINDALCO", "HINDUNILVR", "ICICIBANK", "INDUSINDBK",
  "INFY", "ITC", "JSWSTEEL", "KOTAKBANK", "LT",
  "M&M", "MARUTI", "NESTLEIND", "NTPC", "ONGC",
  "POWERGRID", "RELIANCE", "SBILIFE", "SBIN", "SUNPHARMA",
  "TCS", "TATACONSUM", "TATAMOTORS", "TATASTEEL", "TECHM",
  "TITAN", "ULTRACEMCO", "UPL", "WIPRO"
];

interface MarketMoodProps {
  stocks: Stock[];
}

export default function MarketMood({ stocks }: MarketMoodProps) {
  const [marketMood, setMarketMood] = useState(50)
  const [totalGreen, setTotalGreen] = useState(0)
  const [totalRed, setTotalRed] = useState(0)

  const nifty50Data = useMemo(() => {
    if (!stocks) return { green: 0, red: 0, total: 0 };
    
    const niftyStocks = stocks.filter(stock => 
      NIFTY50_STOCKS.includes(stock.symbol)
    );

    const green = niftyStocks.filter(stock => stock.changepct > 0).length;
    const red = niftyStocks.filter(stock => stock.changepct < 0).length;
    
    return {
      green,
      red,
      total: niftyStocks.length
    };
  }, [stocks]);

  useEffect(() => {
    // Calculate market mood based on the percentage of stocks in green
    const { green, total } = nifty50Data;
    const moodPercentage = (green / total) * 100;
    setMarketMood(moodPercentage);
    setTotalGreen(nifty50Data.green);
    setTotalRed(nifty50Data.red);
  }, [nifty50Data]);

    // Calculate the angle for the needle based on market mood value
    const calculateRotation = (value: number) => {
      // Map 0-100 to -135 to 135 degrees
      return -135 + (value * 270) / 100;
    };

  // Get mood text and color based on value
  const getMoodInfo = (value: number) => {
    if (value <= 20) return { text: 'Extreme Fear', color: '#22c55e' };
    if (value <= 40) return { text: 'Fear', color: '#f97316' };
    if (value <= 60) return { text: 'Neutral', color: '#eab308' };
    if (value <= 80) return { text: 'Greed', color: '#f97316' };
    return { text: 'Extreme Greed', color: '#ef4444' };
  };

  const moodInfo = getMoodInfo(marketMood);

  return (
    <Card className="h-full">
      <CardContent className="pt-6 px-2 sm:px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Market Mood Index</h3>
          <p className="text-sm text-gray-500 mb-4">
            Based on Nifty 50 stocks: {totalGreen} advancing, {totalRed} declining
          </p>
          
          <div className="relative w-full max-w-[350px] mx-auto mb-6">
            <svg viewBox="0 0 300 200" className="w-full">
              {/* Mood labels */}
              <text x="0" y="30" className="text-xs font-medium fill-green-600">Extreme Fear</text>
              <text x="90" y="30" className="text-xs font-medium fill-orange-500">Fear</text>
              <text x="140" y="30" className="text-xs font-medium fill-yellow-500">Neutral</text>
              <text x="200" y="30" className="text-xs font-medium fill-orange-500">Greed</text>
              <text x="260" y="30" className="text-xs font-medium fill-red-500">Extreme Greed</text>

              {/* Background arc */}
              <path
                d="M30 170 A120 120 0 0 1 270 170"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                strokeLinecap="round"
                className="opacity-30"
              />
              
             {/* Colored segments */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e">
                    <animate attributeName="stop-color" 
                      values="#22c55e;#15803d;#22c55e" 
                      dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444">
                    <animate attributeName="stop-color" 
                      values="#ef4444;#b91c1c;#ef4444" 
                      dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>

              {/* Main colored arc */}
              <path
                d="M30 170 A120 120 0 0 1 270 170"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Decorative elements */}
              <circle cx="150" cy="170" r="130" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="150" cy="170" r="110" fill="none" stroke="#e5e7eb" strokeWidth="1" />

               {/* Needle with animation */}
              <g transform={`translate(150, 170) rotate(${calculateRotation(marketMood)})`}
                className="transition-transform duration-1000">
                <line
                  x1="0"
                  y1="5"
                  x2="0"
                  y2="-95"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="origin-bottom"
                />
                <circle r="8" fill="currentColor">
                  <animate
                    attributeName="r"
                    values="8;9;8"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>

              {/* Center value */}
              <text
                x="150"
                y="130"
                textAnchor="middle"
                className="text-4xl font-bold"
                fill="currentColor"
              >
                {marketMood.toFixed(2)}
              </text>
            </svg>
          </div>

          {/* Mood text */}
          <div 
            className="text-2xl font-bold mb-2"
            style={{ color: moodInfo.color }}
          >
            {moodInfo.text}
          </div>
          
          <p className="text-sm text-gray-500">
            Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}