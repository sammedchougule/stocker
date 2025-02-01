'use client'; // Add this line to specify it's a client-side component

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; // Ensure your Supabase client is correctly imported

interface Stock {
  symbol: string;
  price: number;
}

interface StockHistory {
  symbol: string;
  price: number;
  timestamp: string;
}

const StockPriceTracker = ({ newStockData }: { newStockData: Stock[] }) => {
  const [changedPrices, setChangedPrices] = useState<StockHistory[]>([]);
  const [historicalPrices, setHistoricalPrices] = useState<StockHistory[]>([]); // State to store historical data
  const previousPrices = useRef<Record<string, number>>({}); // Stores previous prices

  // Fetch historical price data from Supabase
  useEffect(() => {
    async function fetchHistoricalPrices() {
      const { data, error } = await supabase
        .from('price_history')
        .select('symbol, price, timestamp')
        .order('timestamp', { ascending: true }); // Order by timestamp

      if (error) {
        console.error('Error fetching historical prices:', error);
      } else {
        setHistoricalPrices(data || []);
      }
    }

    fetchHistoricalPrices();
  }, []); // This effect runs once when the component mounts

  // Track and store price changes when they occur
  useEffect(() => {
    const updatedPrices: StockHistory[] = [];

    newStockData.forEach((stock) => {
      const { symbol, price } = stock;

      // If price has changed, store it with timestamp
      if (previousPrices.current[symbol] !== price) {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        updatedPrices.push({ symbol, price, timestamp });

        // Store the price change in Supabase
        supabase
          .from('price_history')
          .insert([{ symbol, price, timestamp }])
          .then(response => {
            if (response.error) {
              console.error('Error inserting price change:', response.error);
            } else {
              console.log(`Price for ${symbol} inserted at ${timestamp}`);
            }
          });

        previousPrices.current[symbol] = price; // Update the reference
      }
    });

    // Append new changes to the existing history
    if (updatedPrices.length > 0) {
      setChangedPrices((prev) => [...prev, ...updatedPrices]);
    }
  }, [newStockData]); // Runs every time new stock data comes in

  return (
    <div>
      <h2>Stock Price History</h2>
      {historicalPrices.length > 0 ? (
        historicalPrices.map((stock, index) => (
          <p key={index}>
            {stock.symbol}: ₹{stock.price} (Updated at: {stock.timestamp})
          </p>
        ))
      ) : (
        <p>No historical price data available</p>
      )}

      <h3>Latest Price Changes</h3>
      {changedPrices.length > 0 ? (
        changedPrices.map((stock, index) => (
          <p key={index}>
            {stock.symbol}: ₹{stock.price} (Updated at: {stock.timestamp})
          </p>
        ))
      ) : (
        <p>No price changes yet</p>
      )}
    </div>
  );
};

export default StockPriceTracker;
