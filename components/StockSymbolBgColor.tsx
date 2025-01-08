import React, { useState, useEffect, useRef } from 'react';
import { Vibrant } from 'node-vibrant/browser';
import tinycolor from 'tinycolor2';


interface CachedColors {
  [key: string]: string;
}

const StockSymbolBgColor = ({ symbol, className, width }: { symbol: string; className?: string; width?:string }) => {
  const containerWidth = width || '7rem';
  const [backgroundColor, setBackgroundColor] = useState('bg-gray-200'); // Default color
  const cachedColors = useRef<CachedColors>({}); // Cache colors
  const [isClient, setIsClient] = useState(false); // Check if running on client

  useEffect(() => {
    setIsClient(true); // Indicate that we're on the client
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchColor = async () => {
      if (cachedColors.current[symbol]) {
        setBackgroundColor(cachedColors.current[symbol]);
        return;
      }

      try {
        const imagePath = `/images/${symbol}.svg`;
        const response = await fetch(imagePath);
        const blob = await response.blob();
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = async () => {
          const vibrant = new Vibrant(img);
          const swatch = await vibrant.getPalette();
          const color = swatch?.Vibrant?.hex || '#e5e7eb'; // Default to gray (#e5e7eb)

          // Adjust the color to reduce contrast
          const adjustedColor = tinycolor(color).lighten(10).toHexString(); // Lighten by 20%
          cachedColors.current[symbol] = adjustedColor;
          setBackgroundColor(adjustedColor);
          URL.revokeObjectURL(img.src);
        };

        img.onerror = () => {
          cachedColors.current[symbol] = '#e5e7eb';
          setBackgroundColor('#e5e7eb');
        };
      } catch (error) {
        console.error(`Error fetching image for ${symbol}:`, error);
        cachedColors.current[symbol] = '#e5e7eb';
        setBackgroundColor('#e5e7eb');
      }
    };

    fetchColor();
  }, [symbol, isClient]);

  return isClient ? (
    <div
      className={`px-2 py-1 rounded-md text-white font-semibold flex items-center justify-center ${className}`}
       style={{ backgroundColor, width: containerWidth }}
    >
      <span
        className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
         style={{ paddingLeft: '4px', paddingRight: '4px', maxWidth: '100%',
           fontSize: symbol.length > 4 ? '12px' : '14px' }}

      >
        {symbol}
      </span>
    </div>
  ) : null;
};

export default StockSymbolBgColor;