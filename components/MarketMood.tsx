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
  const [showModal, setShowModal] = useState(false); // State for modal visibility

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
    const moodPercentage = (nifty50Data.green / nifty50Data.total) * 100;
    setMarketMood(moodPercentage);
  }, [nifty50Data]);

  const calculateRotation = (value: number) => {
    return -135 + (value * 270) / 100;
  };

  const getMoodInfo = (value: number) => {
    if (value <= 20) return { text: 'Extreme Fear', color: '#22c55e', explanation: 'Extreme fear (<30) suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards.' };
    if (value <= 40) return { text: 'Fear', color: '#f97316', explanation: 'Investors are fearful in the market; action depends on the MMI trajectory.' };
    if (value <= 60) return { text: 'Neutral', color: '#eab308', explanation: 'Markets are balanced; actions depend on further trends.' };
    if (value <= 80) return { text: 'Greed', color: '#f97316', explanation: 'Investors are acting greedy; action depends on the MMI trajectory.' };
    return { text: 'Extreme Greed', color: '#ef4444', explanation: 'Extreme greed (>70) suggests avoiding fresh positions as markets are overbought.' };
  };

  const moodInfo = getMoodInfo(marketMood);

  return (
    <Card className="h-full">
      <CardContent className="pt-6 px-2 sm:px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Market Mood Index</h3>
          {/* <p className="text-sm text-gray-500 mb-4">
            Based on Nifty 50 Stocks: {totalGreen} advancing, {totalRed} declining
          </p> */}
          <p className="text-md text-gray-500 mb-2">Know what’s the sentiment on the street today</p>
          
          <div className="relative w-full max-w-[400px] mx-auto mb-6">
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
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              <path
                d="M30 170 A120 120 0 0 1 270 170"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="18"
                strokeLinecap="round"
              />

              <circle cx="150" cy="170" r="130" fill="none" stroke="#e5e7eb" strokeWidth="5" />
              <circle cx="150" cy="170" r="110" fill="none" stroke="#e5e7eb" strokeWidth="5" />

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
                <circle r="8" fill="currentColor" />
              </g>

              <text
                x="150"
                y="170"
                textAnchor="middle"
                className="text-5xl font-bold"
                fill="currentColor"
              >
                {marketMood.toFixed(2)}
              </text>
            </svg>
          </div>

          <p className="text-md text-gray-500 mx-10">
            MMI is in the <span 
              style={{ color: moodInfo.color, fontWeight: 'bold', fontSize: '1.1rem' }}>
               {moodInfo.text} Zone.
            </span> {moodInfo.explanation}
          </p>

          <button 
            className="text-blue-600 mt-4"
            onClick={() => setShowModal(true)}
          >
            See All Zones
          </button>
        </div>
      </CardContent>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowModal(false)} // Close modal on clicking the background
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(event) => event.stopPropagation()} // Prevent click from closing when interacting with modal content
          >
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">See How to Read All Zones</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)} // Close modal on clicking the close button
              >
                ✖
              </button>
            </div>

            <ul>
              <li className="mb-4">
                <span className="font-bold text-green-600">Extreme Fear (&lt;20):</span>
                <span className="font-light"> Extreme fear suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards.</span>
              </li>
              <li className="mb-4">
                <span className="font-bold text-orange-500">Fear (20-40):</span>
                <span className="font-light"> It suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory.</span>
              </li>
              <li className="mb-4">
                <span className="font-bold text-yellow-500">Neutral (40-60):</span>
                <span className="font-light"> It suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory.</span>
              </li>
              <li className="mb-4">
                <span className="font-bold text-orange-500">Greed (60-80):</span>
                <span className="font-light"> It suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory.</span>
              </li>
              <li className="mb-4">
                <span className="font-bold text-red-500">Extreme Greed ({'>'}80):</span>
                <span className="font-light"> It suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  )
}