'use client'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Stock } from '@/types/Stock';
import { useRouter } from 'next/navigation';


// Function to generate a random color for each stock
export const getRandomColor = (symbol: string): string => {
  if (typeof window !== "undefined") {
    // Check if the color for the symbol is already stored in localStorage
    const cachedColor = localStorage.getItem(symbol);
    if (cachedColor) {
      return cachedColor; // Return the cached color from localStorage
    }

    // Generate a new random color (excluding black) and store it
    let newColor;
    do {
      newColor = generateRandomColor();
    } while (newColor === "#000000"); // Ensure it's not black

    localStorage.setItem(symbol, newColor); // Store the generated color in localStorage
    return newColor; // Return the new color
  }

  return "#ffffff"; // Default color if window is not available
};

// Function to generate a random hex color
const generateRandomColor = (): string => {
  const randomHex = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hex value
  return `#${randomHex.padStart(6, "0")}`; // Ensure 6 characters with padding
};

interface StockCardProps {
    stock: Stock;
    
  }

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
    const router = useRouter();

    const handleStockClick = () => {
        router.push(`/stocks/${stock.symbol}`);
      };
      
  return (
    <Card className="relative flex flex-col cursor-pointer" onClick={handleStockClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div
            className="w-28 px-3 py-1 rounded-md text-white font-medium text-sm flex items-center justify-center"
            style={{ backgroundColor: getRandomColor(stock.symbol) }}
          >
            <span className="text-center whitespace-nowrap text-[13px] leading-none">
              {stock.symbol}
            </span>
          </div>
          <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
          {stock.companyname}
        </h3>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <div className="text-xl font-semibold mb-2 w-full">
          ₹{Number(stock.price).toFixed(2)}
        </div>
        <div className="flex justify-between items-center w-full">
          <div
            className={`flex items-center px-2 py-1 rounded-md text-sm font-medium
            ${
              stock.changepct >= 0
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {stock.changepct >= 0 ? "↑" : "↓"}{" "}
            {Number(stock.changepct).toFixed(2)}%
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};