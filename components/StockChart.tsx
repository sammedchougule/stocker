"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { format, subDays, subMonths, subYears } from "date-fns";
import { supabase } from "@/lib/supabase";
import CustomizedProgressBars from "./CustomizedProgressBars";

interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volumeavg?: number | null;
}

interface StockChartProps {
  symbol: string;
}

type TimeFrame = "5D" | "15D" | "1M" | "6M" | "1Y" | "5Y" | "MAX";

export function StockChart({ symbol }: StockChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("5D");
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Always fetch all historical data to ensure we have complete data range
      const { data, error } = await supabase
        .from("historical")
        .select("date, open, high, low, close, volume, volumeavg")
        .eq("symbol", symbol)
        .order("date", { ascending: false }); // Get newest first to ensure we have latest data

      if (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
        return;
      }

      const processedData = data.map((d) => {
        const normalizedDate = new Date(d.date.trim().replace(/,/g, ""));
        return {
          date: format(normalizedDate, "yyyy-MM-dd"),
          normalizedDate, // Keep the date object for easier comparison
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume),
          volumeavg: d.volumeavg !== undefined ? Number(d.volumeavg) : null,
        };
      });

      setData(processedData);
      setLoading(false);
    }

    fetchData();
  }, [symbol]);

  const getFilteredData = useCallback(() => {
    if (!data || data.length === 0) return [];

    // Sort data by date in ascending order
    const sortedData = [...data].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Calculate start index based on timeframe (show last N available close prices)
    let sliceCount: number | undefined;
    switch (timeFrame) {
      case "5D":
        sliceCount = 5;
        break;
      case "15D":
        sliceCount = 15;
        break;
      case "1M":
        sliceCount = 22; // Approximate trading days in a month
        break;
      case "6M":
        sliceCount = 22 * 6;
        break;
      case "1Y":
        sliceCount = 252; // Approximate trading days in a year
        break;
      case "5Y":
        sliceCount = 252 * 5;
        break;
      case "MAX": {
        // For MAX, show all data from 1990-01-01 to latest
        const minDate = new Date("1990-01-01");
        return sortedData.filter(item => new Date(item.date) >= minDate);
      }
      default:
        return sortedData;
    }

    // If sliceCount is set, show only the last N available close prices
    return sortedData.slice(-sliceCount);
  }, [data, timeFrame]);

  const { filteredData, isPositive } = useMemo(() => {
    const filtered = getFilteredData();
    if (filtered.length < 2) return { filteredData: filtered, isPositive: true };

    const first = filtered[0].close;
    const last = filtered[filtered.length - 1].close;
    return { filteredData: filtered, isPositive: last >= first };
  }, [getFilteredData]);

  const yAxisDomain = useMemo(() => {
    const prices = filteredData.map((d) => d.close);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [filteredData]);

  const chartColor = isPositive ? "#22c55e" : "#ef4444";
  const timeFrames: TimeFrame[] = ["5D", "15D", "1M", "6M", "1Y", "5Y", "MAX"];

  if (loading) return <div><CustomizedProgressBars /></div>;

  return (
    <div className="space-y-4 bg-white dark:bg-[#151719] -ml-2">
      <div className="flex gap-2 mt-2">
        {timeFrames.map((frame) => (
          <Button
            key={frame}
            variant={frame === timeFrame ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame(frame)}
          >
            {frame}
          </Button>
        ))}
      </div>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(new Date(d), "MMM d")}
              tick={{ fontSize: window?.innerWidth < 768 ? 12 : 14 }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              domain={yAxisDomain}
              tickFormatter={(v) => `₹${v.toFixed(0)}`}
              tick={{ fontSize: window?.innerWidth < 768 ? 12 : 14 }}
              width={60}
            />
            <Tooltip
              labelFormatter={(d) => format(new Date(d), "MMM d, yyyy")}
              formatter={(v) => [`₹${(v as number).toFixed(2)}`, "Close"]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.5} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="close"
              stroke={chartColor}
              fill="url(#gradient)"
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={800}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
