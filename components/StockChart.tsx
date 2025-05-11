// import { useState, useMemo, useCallback } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Stock } from "@/types/Stock";
// import { Button } from "@/components/ui/button";
// import { format } from "date-fns";

// interface StockChartProps {
//   stock: Stock;
// }

// type TimeFrame = "5D" | "15D" | "1M" | "6M" | "1Y" | "5Y" | "MAX";

// export function StockChart({ stock }: StockChartProps) {
//   const [timeFrame, setTimeFrame] = useState<TimeFrame>("5D");

//   const getFilteredData = useCallback(() => {
//     const currentDate = new Date();
//     const chartData = Object.entries(stock.closings)
//       .map(([date, price]) => ({
//         date,
//         closingPrice: price,
//       }))
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//     switch (timeFrame) {
//       case "5D":
//         return chartData.slice(-5);
//       case "15D":
//         return chartData.slice(-15);
//       case "1M": {
//         const oneMonthAgo = new Date(
//           currentDate.setMonth(currentDate.getMonth() - 1)
//         );
//         return chartData.filter((item) => new Date(item.date) >= oneMonthAgo);
//       }
//       case "6M": {
//         const sixMonthsAgo = new Date(
//           currentDate.setMonth(currentDate.getMonth() - 6)
//         );
//         return chartData.filter((item) => new Date(item.date) >= sixMonthsAgo);
//       }
//       case "1Y": {
//         const oneYearAgo = new Date(
//           currentDate.setFullYear(currentDate.getFullYear() - 1)
//         );
//         return chartData.filter((item) => new Date(item.date) >= oneYearAgo);
//       }
//       case "5Y": {
//         const fiveYearsAgo = new Date(
//           currentDate.setFullYear(currentDate.getFullYear() - 5)
//         );
//         return chartData.filter((item) => new Date(item.date) >= fiveYearsAgo);
//       }
//       case "MAX":
//         return chartData; // No slicing or filtering for MAX, show all data
//       default:
//         return chartData;
//     }
//   }, [timeFrame, stock.closings]);

//   const { filteredData, isPositive } = useMemo(() => {
//     const data = getFilteredData();
//     if (data.length < 2) return { filteredData: data, isPositive: true };

//     const startPrice = data[0].closingPrice;
//     const endPrice = data[data.length - 1].closingPrice;

//     return {
//       filteredData: data,
//       isPositive: endPrice >= startPrice,
//     };
//   }, [getFilteredData, timeFrame, stock.closings]);

//   const yAxisDomain = useMemo(() => {
//     if (filteredData.length === 0) return [0, 100];

//     const prices = filteredData.map((item) => item.closingPrice);
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);

//     const pricePadding = (maxPrice - minPrice) * 0.1;

//     return [Math.max(0, minPrice - pricePadding), maxPrice + pricePadding];
//   }, [filteredData]);

//   const timeFrameButtons: TimeFrame[] = ["5D", "15D", "1M", "6M", "1Y", "5Y", "MAX"];

//   const chartColor = isPositive ? "#22c55e" : "#ef4444"; // green-500 : red-500

//   return (
//     <div className="space-y-4 bg-white dark:bg-[#151719]">
//       <div className="flex gap-2 mt-2">
//         {timeFrameButtons.map((frame) => (
//           <Button
//             key={frame}
//             variant={timeFrame === frame ? "default" : "outline"}
//             size="sm"
//             onClick={() => setTimeFrame(frame)}
//           >
//             {frame}
//           </Button>
//         ))}
//       </div>
//       <div className="w-full h-[400px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={filteredData}>
//             <XAxis
//               dataKey="date"
//               tickFormatter={(date) => format(new Date(date), "MMM d")}
//               minTickGap={30}
//             />
//             <YAxis
//               domain={yAxisDomain}
//               tickFormatter={(value) => `₹${value.toFixed(0)}`}
//             />
//             <Tooltip
//               labelFormatter={(date) => {
//                 const dateObj = new Date(date);
//                 const year = dateObj.getFullYear();
//                 const currentYear = new Date().getFullYear();
//                 return year !== currentYear
//                   ? format(dateObj, "MMM d, yy")
//                   : format(dateObj, "MMM d");
//               }}
//               formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Price"]}
//             />
//             <defs>
//               <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor={chartColor} stopOpacity={25} />
//                 <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <Area
//               type="monotone"
//               dataKey="closingPrice"
//               stroke={chartColor}
//               fill="url(#colorGradient)"
//               strokeWidth={2}
//               isAnimationActive={true} // Enable animation
//               animationDuration={1000} // Animation duration in milliseconds
//               animationEasing="ease-out" // Smooth easing
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }



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
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

interface HistoricalDataPoint {
  date: string;
  close: number;
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
      const { data, error } = await supabase
        .from("historical")
        .select("date, close")
        .eq("symbol", symbol)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
        return;
      }

      setData(data.map((d) => ({ date: d.date, close: d.close })));
      setLoading(false);
    }

    fetchData();
  }, [symbol]);

  const getFilteredData = useCallback(() => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    let startDate: Date | null = null;

    switch (timeFrame) {
      case "5D":
        startDate = new Date(now.setDate(now.getDate() - 5));
        break;
      case "15D":
        startDate = new Date(now.setDate(now.getDate() - 15));
        break;
      case "1M":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "6M":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "1Y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "5Y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 5));
        break;
      case "MAX":
      default:
        return data;
    }

    return data.filter((item) => new Date(item.date) >= startDate!);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4 bg-white dark:bg-[#151719]">
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
          <AreaChart data={filteredData}>
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(new Date(d), "MMM d")}
            />
            <YAxis
              domain={yAxisDomain}
              tickFormatter={(v) => `₹${v.toFixed(0)}`}
            />
            <Tooltip
              labelFormatter={(d) => format(new Date(d), "MMM d, yyyy")}
              formatter={(v) => [`₹${(v as number).toFixed(2)}`, "Close"]}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
