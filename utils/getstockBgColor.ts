// utils/getStockBgColor.ts
import stockColors from '@/data/stockColors.json';

type StockColors = {
    [symbol: string]: number[]; // Array with 3 numbers (RGB)
  };
  
  export const getStockBgColor = (symbol: string): string => {
    const colorArray: number[] | undefined = (stockColors as StockColors)[symbol];
    const color: [number, number, number] | undefined = colorArray && colorArray.length === 3 ? [colorArray[0], colorArray[1], colorArray[2]] : undefined;
    if (color) {
      return `rgb(${color.join(', ')})`; // Return the RGB color format
    }
    return 'rgb(255, 255, 255)'; // Default to white if no color found
  };
  