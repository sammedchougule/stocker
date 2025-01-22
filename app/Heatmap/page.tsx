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



"use client";

import { useEffect, useState } from "react";
import { useStockContext } from "@/context/StockContext";
import { Stock } from "@/types/Stock";
import { Button } from "@/components/ui/buttons";
import { StockModal } from "@/components/StockModal";
import Image from "next/image";
import * as d3 from "d3";

type FilterOption =
    | "Nifty 50"
    | "Nifty Auto"
    | "Nifty Bank"
    | "Nifty Energy"
    | "Nifty Financial Services"
    | "Nifty FMCG"
    | "Nifty IT"
    | "Nifty Metal"
    | "Nifty Pharma";

const filterOptions: FilterOption[] = [
    "Nifty 50",
    "Nifty Auto",
    "Nifty Bank",
    "Nifty Energy",
    "Nifty Financial Services",
    "Nifty FMCG",
    "Nifty IT",
    "Nifty Metal",
    "Nifty Pharma",
];

export default function Heatmap() {
    const { stocks } = useStockContext();
    const [heatmapData, setHeatmapData] = useState<(Stock & { x0: number, x1: number, y0: number, y1: number, data: any })[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<FilterOption>("Nifty 50");
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let filtered = stocks.filter((stock) => stock.type === "EQ");

        if (selectedIndex === "Nifty 50") {
            filtered = filtered.filter((stock) => stock.indices && stock.indices["Nifty 50"]);
        } else {
            filtered = filtered.filter(
                (stock) => stock.indices && stock.indices[selectedIndex as keyof typeof stock.indices]
            );
        }

        if (filtered.length > 0) {
            const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct);
            const mappedStocks = sortedStocks.map(stock => ({
                ...stock,
                x0: 0,
                x1: 0,
                y0: 0,
                y1: 0,
                data: stock
            }));
            setHeatmapData(mappedStocks);
        }
    }, [stocks, selectedIndex]);

    const getColor = (changepct: number, maxChange: number = 10) => {
        const clampedChange = Math.max(-maxChange, Math.min(changepct, maxChange));
        const normalizedChange = clampedChange / maxChange;

        const green = [20, 180, 20];
        const yellow = [220, 230, 100];
        const red = [220, 10, 10];

        let startColor, endColor, t;

        if (normalizedChange > 0) {
            startColor = yellow;
            endColor = green;
            t = Math.sqrt(normalizedChange);
        } else {
            startColor = yellow;
            endColor = red;
            t = Math.sqrt(Math.abs(normalizedChange));
        }

        const interpolatedColor = startColor.map((start, i) =>
            Math.round(start + (endColor[i] - start) * t)
        );

        return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
    };

    const handleStockClick = (stock: Stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true);
    };

    const formattedData = heatmapData.map((stock) => ({
        name: stock.symbol,
        value: Math.abs(stock.changepct),
        changepct: stock.changepct,
        color: getColor(stock.changepct),
    }));

    useEffect(() => {
        const width = 800; // Width of the treemap container
        const height = 600; // Height of the treemap container

        const treemapLayout = d3.treemap()
            .size([width, height])
            .padding(1);

        const root = d3.hierarchy<{ children: typeof formattedData }>( { children: formattedData })
            .sum((d: any) => d.value);

        treemapLayout(root);

        const treemapData = root.leaves();

        setHeatmapData(treemapData as any);
    }, [formattedData]);

    return (
        <div className="container mx-auto mt-6">
            <div className="flex gap-2 mt-4 flex-wrap">
                {filterOptions.map((option) => (
                    <Button
                        key={option}
                        variant={selectedIndex === option ? "default" : "outline"}
                        onClick={() => setSelectedIndex(option)}
                        className={`flex-shrink-0 ${selectedIndex === option ? "bg-gray-600 text-white" : "bg-white"}`}
                    >
                        {option}
                    </Button>
                ))}
            </div>

            <svg width="100%" height="600">
                {heatmapData.map((node, index) => (
                    <g key={index}>
                        <rect
                            x={node.x0}
                            y={node.y0}
                            width={node.x1 - node.x0}
                            height={node.y1 - node.y0}
                            style={{ fill: node.data.color, stroke: "#fff", cursor: "pointer" }}
                            onClick={() => handleStockClick(node.data)}
                        />
                        {node.x1 - node.x0 > 30 && node.y1 - node.y0 > 30 && ( // Show image only if the rectangle is large enough
                            <foreignObject x={node.x0 + 5} y={node.y0 + 5} width={20} height={20}>
                                <Image
                                    className="rounded-full"
                                    width={20}
                                    height={20}
                                    src={`/images/${node.data.name}.svg`}
                                    alt={node.data.name || "Unknown"}
                                />
                            </foreignObject>
                        )}
                        <text
                            x={node.x0 + (node.x1 - node.x0) / 2}
                            y={node.y0 + (node.y1 - node.y0) / 2}
                            textAnchor="middle"
                            fontSize={Math.min(node.x1 - node.x0, node.y1 - node.y0) / 7} // Dynamically scale font size
                            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                            {node.data.name}
                        </text>
                    </g>
                ))}
            </svg>

            <StockModal
                stock={selectedStock}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
