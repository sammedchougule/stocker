import { useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { Stock } from "@/types/Stock";
import { Button } from "@/components/ui/buttons";
import { format } from "date-fns";

interface StockChartProps {
  stock: Stock;
}

type TimeFrame = '5D' | '15D' | '1M' | '6M' | '1Y';

export function StockChart({ stock }: StockChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('5D');

  // Function to filter data based on selected time frame
  const getFilteredData = useCallback(() => {
    const currentDate = new Date();
    const chartData = Object.entries(stock.closings)
      .map(([date, price]) => ({
        date,
        closingPrice: price
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    switch (timeFrame) {
      case '5D':
        return chartData.slice(-5);
      case '15D':
        return chartData.slice(-15);
      case '1M':
        const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        return chartData.filter(item => new Date(item.date) >= oneMonthAgo);
      case '6M':
        const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        return chartData.filter(item => new Date(item.date) >= sixMonthsAgo);
      case '1Y':
        const oneYearAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        return chartData.filter(item => new Date(item.date) >= oneYearAgo);
      default:
        return chartData;
    }
  }, [timeFrame, stock.closings]);
  
  
  const { filteredData, isPositive } = useMemo(() => {
    const data = getFilteredData();
    if (data.length < 2) return { filteredData: data, isPositive: true };
  
    const startPrice = data[0].closingPrice;
    const endPrice = data[data.length - 1].closingPrice;
  
    return {
      filteredData: data,
      isPositive: endPrice >= startPrice,
    };
  }, [getFilteredData]);  
  

  // Calculate Y-axis domain based on filtered data
  const yAxisDomain = useMemo(() => {
    if (filteredData.length === 0) return [0, 100];

    const prices = filteredData.map(item => item.closingPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const pricePadding = (maxPrice - minPrice) * 0.1;
    
    return [
      Math.max(0, minPrice - pricePadding),
      maxPrice + pricePadding
    ];
  }, [filteredData]);

  const timeFrameButtons: TimeFrame[] = ['5D', '15D', '1M', '6M', '1Y'];

  const chartColor = isPositive ? "#22c55e" : "#ef4444"; // green-500 : red-500

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {timeFrameButtons.map((frame) => (
          <Button
            key={frame}
            variant={timeFrame === frame ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame(frame)}
          >
            {frame}
          </Button>
        ))}
      </div>
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "MMM d")}
              minTickGap={30}
            />
            <YAxis 
              domain={yAxisDomain}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
            />
            <Tooltip 
              labelFormatter={(date) => format(new Date(date), "MMM d")}
              formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Price"]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="closingPrice"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="closingPrice"
              stroke="transparent"
              fill="url(#colorGradient)"
              fillOpacity={1}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 