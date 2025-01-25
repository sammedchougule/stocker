// "use client";

// import { useEffect, useState } from "react";
// import { useStockContext } from "@/context/StockContext";
// import { Stock } from "@/types/Stock";
// import { 
//     Card, 
//     CardContent, 
//     CardHeader, 
//     CardTitle 
// } from "@/components/ui/card";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { LayoutGrid } from 'lucide-react';
// import { Button } from '@/components/ui/buttons'
// import { StockModal } from '@/components/StockModal';

// type FilterOption =
//     | "Nifty FnO"
//     | "Nifty 50"
//     | "Nifty Auto"
//     | "Nifty Bank"
//     | "Nifty Energy"
//     | "Nifty Financial Services"
//     | "Nifty FMCG"
//     | "Nifty IT"
//     | "Nifty Metal"
//     | "Nifty Pharma";

// const filterOptions: FilterOption[] = [
//     "Nifty FnO",
//     "Nifty 50",
//     "Nifty Auto",
//     "Nifty Bank",
//     "Nifty Energy",
//     "Nifty Financial Services",
//     "Nifty FMCG",
//     "Nifty IT",
//     "Nifty Metal",
//     "Nifty Pharma"
// ];


// export default function Heatmap() {
//     const { stocks } = useStockContext();
//     const [heatmapData, setHeatmapData] = useState<Stock[]>([]);
//     const [selectedIndex, setSelectedIndex] = useState<FilterOption>("Nifty FnO");
//     const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
//    const [isModalOpen, setIsModalOpen] = useState(false)

//     useEffect(() => {
//         let filtered = stocks.filter((stock) => stock.type === "EQ");

//         if (selectedIndex === "Nifty FnO") {
//             filtered = filtered.filter((stock) => stock.indices && stock.indices["Nifty FnO"]);
//         } else {
//             filtered = filtered.filter(
//                 (stock) => stock.indices && stock.indices[selectedIndex as keyof typeof stock.indices]
//             );
//         }

//         if (filtered.length > 0) {
//             const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct);
//             setHeatmapData(sortedStocks);
//         }
//     }, [stocks, selectedIndex]);
    

//     const getColor = (changepct: number, maxChange: number = 10) => {
//         // Clamp changepct to the range [-maxChange, maxChange]
//         const clampedChange = Math.max(-maxChange, Math.min(changepct, maxChange));
    
//         // Normalize the changepct to the range [-1, 1]
//         const normalizedChange = clampedChange / maxChange;
    
//         // Define RGB values for green, yellow, and red
//         const green = [20, 180, 20];    //  green
//         const yellow = [220, 230, 100]; //  yellow
//         const red = [220, 10, 10];      //  red
    
//         let startColor, endColor, t;
    
//         if (normalizedChange > 0) {
//             // Transition from yellow to green for positive changes
//             startColor = yellow;
//             endColor = green;
//             t = Math.sqrt(normalizedChange); // Smooth scale
//         } else {
//             // Transition from yellow to red for negative changes
//             startColor = yellow;
//             endColor = red;
//             t = Math.sqrt(Math.abs(normalizedChange)); // Smooth scale
//         }
    
//         // Interpolate each color channel
//         const interpolatedColor = startColor.map((start, i) =>
//             Math.round(start + (endColor[i] - start) * t)
//         );
    
//         return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
//     };

    
//     const handleStockClick = (stock: Stock) => {
//         setSelectedStock(stock);
//         setIsModalOpen(true);
//       };


//     return (
//         <div className="container mx-auto mt-4 sm:mt-0">
//             <Card>
//                 <CardHeader className="sticky top-0 bg-white z-10">
//                     <CardTitle className="flex gap-2 items-center justify-center">
//                         <LayoutGrid />Heatmap
//                     </CardTitle>
//                     <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4">
//                         <div className="inline-flex gap-2 mt-4">
//                             {filterOptions.map((option) => (
//                                 <Button
//                                     key={option}
//                                     variant={selectedIndex === option ? "default" : "outline"}
//                                     onClick={() => setSelectedIndex(option)}
//                                     className={`flex-shrink-0 ${selectedIndex === option ? "bg-gray-600 text-white" : "bg-white"}`}
//                                 >
//                                     {option}
//                                 </Button>
//                             ))}
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent >
//                     <div className="mt-2 grid gap-2 grid-cols-3 sm:grid-cols-5 lg:grid-cols-7">
//                         {heatmapData.map((stock) => (
//                             <div
//                                 key={stock.symbol}
//                                 className={cn(
//                                     "flex flex-col items-center justify-center rounded-md h-28 md:h-32 cursor-pointer transition-transform duration-300 transform hover:scale-105"
//                                 )}
//                                 style={{ background: getColor(stock.changepct)}}
//                                 onClick={() => handleStockClick(stock)}
//                             >
//                                 <Image
//                                     src={`/images/${stock.symbol}.svg`}
//                                     alt={stock.symbol}
//                                     width={20}
//                                     height={20}
//                                     className="w-10 h-10 rounded-full"
//                                 />
//                                 <div className="text-gray-800 font-medium text-lg mt-1 truncate w-full text-center">
//                                     {stock.symbol}
//                                 </div>
//                                 <div className="text-gray-800 text-lg mt-1 truncate w-full text-center">
//                                     {Number(stock.changepct).toFixed(2)}%
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>

//             <StockModal
//                 stock={selectedStock}
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />

//         </div>
//     );
// }




"use client"

import { useEffect, useState } from "react"
import { useStockContext } from "@/contexts/StockContext"
import type { Stock } from "@/types/Stock"
import { Treemap, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { StockModal } from "@/components/StockModal"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { CustomTreemapContent } from "@/components/CustomTreemapContent"

type FilterOption =
  | "Nifty FnO"
  | "Nifty 50"
  | "Nifty Auto"
  | "Nifty Bank"
  | "Nifty Energy"
  | "Nifty Financial Services"
  | "Nifty FMCG"
  | "Nifty IT"
  | "Nifty Metal"
  | "Nifty Pharma"

const filterOptions: FilterOption[] = [
  "Nifty FnO",
  "Nifty 50",
  "Nifty Auto",
  "Nifty Bank",
  "Nifty Energy",
  "Nifty Financial Services",
  "Nifty FMCG",
  "Nifty IT",
  "Nifty Metal",
  "Nifty Pharma",
]

type SortOption = "changepct" | "marketcap" | "volumespike" | "pe" | "volume"

const sortOptions: SortOption[] = ["changepct", "marketcap", "volumespike", "pe", "volume"]

const sortOptionLabels = {
  pe: "PE",
  changepct: "Change %",
  marketcap: "Market Cap",
  volumespike: "1M Volume",
  volume: "1D Volume",
}

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded shadow">
        <div className="flex items-center gap-2">
          <Image
            src={data.image}
            alt={data.name}
            width={30}
            height={30}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-semibold">{data.name}</span>
        
        <p className="font-semibold text-lg">₹{Number(data.price).toFixed(2)}</p>
        <p>
          <span
            className={
              data.changepct >= 0
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          > {Number(data[data.selectedSort]).toFixed(2)}
            {data.selectedSort === "changepct" ? "%" : ""}
          </span>
        </p>
        </div>
      </div>
    )
  }
  return null
}

export default function Heatmap() {
  const { stocks } = useStockContext()
  const [heatmapData, setHeatmapData] = useState<Stock[]>([])
  const [selectedIndex, setSelectedIndex] = useState<FilterOption>("Nifty 50")
  const [selectedSort, setSelectedSort] = useState<SortOption>("changepct")
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let filtered = stocks.filter((stock) => stock.type === "EQ")

    if (selectedIndex === "Nifty FnO") {
      filtered = filtered.filter((stock) => stock.indices && stock.indices["Nifty FnO"])
    } else {
      filtered = filtered.filter((stock) => stock.indices && stock.indices[selectedIndex as keyof typeof stock.indices])
    }

    if (filtered.length > 0) {
      const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct)
      setHeatmapData(sortedStocks)
    }
  }, [stocks, selectedIndex])

  const getColor = (value: number, maxChange = 3) => {
    const clampedChange = Math.max(-maxChange, Math.min(value, maxChange))
    const normalizedChange = clampedChange / maxChange

    const green = [34, 197, 94] // Emerald Green
    const yellow = [253, 224, 71] // Canary Yellow
    const red = [239, 68, 68] // Crimson Red

    let startColor, endColor, t

    if (normalizedChange > 0) {
      startColor = yellow
      endColor = green
      t = Math.sqrt(normalizedChange)
    } else {
      startColor = yellow
      endColor = red
      t = Math.sqrt(Math.abs(normalizedChange))
    }

    const interpolatedColor = startColor.map((start, i) => Math.round(start + (endColor[i] - start) * t))

    return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`
  }

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const formattedData = heatmapData.map((stock) => ({
    name: stock.symbol,
    value: Math.abs(stock[selectedSort] || 0),
    changepct: stock.changepct,
    price: stock.price,
    [selectedSort]: stock[selectedSort],
    color: getColor(stock.changepct),
    image: `/images/${stock.symbol}.svg`,
    companyname: stock.companyname,
    selectedSort: selectedSort,
  }))

  return (
    <div className="container mx-auto sm:mt-0 mt-2"> 
        <Card>
        <CardHeader>
            <CardTitle>
            <p className="text-2xl font-bold">
                {selectedIndex.replace("_", " ")} Heatmap
            </p>
            </CardTitle>
            <div className="flex gap-2">
                <div className="relative">
                    <Select value={selectedIndex} onValueChange={(value) => setSelectedIndex(value as FilterOption)}>
                        <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Index : {selectedIndex.replace("_", " ")}</span>
                            {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
                        </div>
                        </SelectTrigger>
                        <SelectContent>
                        {filterOptions.map((option) => (
                            <SelectItem key={option} value={option} className="text-gray-700">
                            {option.replace("_", " ")}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative">
                    <Select value={selectedSort} onValueChange={(value) => setSelectedSort(value as SortOption)}>
                        <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Sort By : {sortOptionLabels[selectedSort]}</span>
                        </div>
                        </SelectTrigger>
                        <SelectContent>
                        {sortOptions.map((option) => (
                            <SelectItem key={option} value={option} className="text-gray-700">
                            {sortOptionLabels[option]}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>

        <CardContent>
            <ResponsiveContainer width="100%" height={650}>
                <Treemap
                    data={formattedData}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={300}
                    animationEasing="ease-out"
                    content={
                        <CustomTreemapContent
                        x={0}
                        y={0}
                        width={0}
                        height={0}
                        name=""
                        color=""
                        image=""
                        changepct={0}
                        price={0}
                        onClick={(name) => {
                            const stock = heatmapData.find((s) => s.symbol === name)
                            if (stock) handleStockClick(stock)
                        }}
                        />
                    }
                    >
                    <Tooltip content={<CustomTooltip />} />
                </Treemap>
            </ResponsiveContainer>
        </CardContent>
        </Card>
        
      <StockModal stock={selectedStock} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}