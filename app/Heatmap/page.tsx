
"use client";

import { useEffect, useState } from "react";
import { useStockContext } from "@/context/StockContext";
import { Stock } from "@/types/Stock";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/utils/utils";
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/buttons'

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
    | "Nifty Pharma";

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
    "Nifty Pharma"
];


export default function Heatmap() {
    const { stocks } = useStockContext();
    const [heatmapData, setHeatmapData] = useState<Stock[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<FilterOption>("Nifty FnO");

    useEffect(() => {
        let filtered = stocks.filter((stock) => stock.type === "EQ");

        if (selectedIndex === "Nifty FnO") {
            filtered = filtered.filter((stock) => stock.indices && stock.indices["Nifty FnO"]);
        } else {
            filtered = filtered.filter(
                (stock) => stock.indices && stock.indices[selectedIndex as keyof typeof stock.indices]
            );
        }

        if (filtered.length > 0) {
            const sortedStocks = [...filtered].sort((a, b) => b.changepct - a.changepct);
            setHeatmapData(sortedStocks);
        }
    }, [stocks, selectedIndex]);
    

    const getColor = (changepct: number, maxChange: number = 10) => {
        // Clamp changepct to the range [-maxChange, maxChange]
        const clampedChange = Math.max(-maxChange, Math.min(changepct, maxChange));
    
        // Normalize the changepct to the range [-1, 1]
        const normalizedChange = clampedChange / maxChange;
    
        // Define RGB values for green, yellow, and red
        const green = [20, 180, 20];    //  green
        const yellow = [220, 230, 100]; //  yellow
        const red = [220, 10, 10];      //  red
    
        let startColor, endColor, t;
    
        if (normalizedChange > 0) {
            // Transition from yellow to green for positive changes
            startColor = yellow;
            endColor = green;
            t = Math.sqrt(normalizedChange); // Smooth scale
        } else {
            // Transition from yellow to red for negative changes
            startColor = yellow;
            endColor = red;
            t = Math.sqrt(Math.abs(normalizedChange)); // Smooth scale
        }
    
        // Interpolate each color channel
        const interpolatedColor = startColor.map((start, i) =>
            Math.round(start + (endColor[i] - start) * t)
        );
    
        return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
    };


    return (
        <div className="container mx-auto">
            <Card>
                <CardHeader className="sticky top-0 bg-white z-10">
                    <CardTitle className="flex gap-2 items-center justify-center"><LayoutGrid />Heatmap</CardTitle>
                    <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4">
                        <div className="inline-flex gap-2">
                            {filterOptions.map((option) => (
                                <Button
                                    key={option}
                                    variant={selectedIndex === option ? "default" : "outline"}
                                    onClick={() => setSelectedIndex(option)}
                                    className="flex-shrink-0"
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto"}}>
                    <div className="grid gap-2 grid-cols-4 sm:grid-cols-6 lg:grid-cols-8">
                        {heatmapData.map((stock) => (
                            <div
                                key={stock.symbol}
                                className={cn(
                                    "flex flex-col items-center justify-center rounded-lg p-2 h-28 md:h-28 mt-2",
                                )}
                                style={{ background: getColor(stock.changepct)}}
                            >
                                <Image
                                    src={`/images/${stock.symbol}.svg`}
                                    alt={stock.symbol}
                                    width={20}
                                    height={20}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="text-gray-50 font-md text-md mt-1 truncate w-full text-center">
                                    {stock.symbol}
                                </div>
                                <div className="text-gray-50 text-md mt-1 truncate w-full text-center">
                                    {Number(stock.changepct).toFixed(2)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

