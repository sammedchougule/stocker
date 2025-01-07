import React, { useState, useEffect, useRef } from 'react';
import { Vibrant } from 'node-vibrant/browser';
import tinycolor from 'tinycolor2';

interface CachedColors {
  [key: string]: { backgroundColor: string; textColor: string };
}

const StockSymbolBgColor = ({ symbol, className }: { symbol: string; className?: string }) => {
  const [backgroundColor, setBackgroundColor] = useState('#e5e7eb'); // Default background color
  const [textColor, setTextColor] = useState('text-black'); // Default text color
  const cachedColors = useRef<CachedColors>({}); // Cache for colors
  const [isClient, setIsClient] = useState(false); // Check if running on client

  useEffect(() => {
    setIsClient(true); // Indicate that we're on the client
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchColor = async () => {
      if (cachedColors.current[symbol]) {
        const cached = cachedColors.current[symbol];
        setBackgroundColor(cached.backgroundColor);
        setTextColor(cached.textColor);
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
          const color = swatch?.Vibrant?.hex || '#e5e7eb'; // Default to gray

          // Adjust the background color to reduce contrast
          const adjustedColor = tinycolor(color).lighten(20).toHexString();

          // Determine text color based on luminance
          const calculatedTextColor = tinycolor(adjustedColor).isLight() ? 'text-black' : 'text-white';

          // Cache and update state
          cachedColors.current[symbol] = {
            backgroundColor: adjustedColor,
            textColor: calculatedTextColor,
          };
          setBackgroundColor(adjustedColor);
          setTextColor(calculatedTextColor);
          URL.revokeObjectURL(img.src);
        };

        img.onerror = () => {
          cachedColors.current[symbol] = { backgroundColor: '#e5e7eb', textColor: 'text-black' };
          setBackgroundColor('#e5e7eb');
          setTextColor('text-black');
        };
      } catch (error) {
        console.error(`Error fetching image for ${symbol}:`, error);
        cachedColors.current[symbol] = { backgroundColor: '#e5e7eb', textColor: 'text-black' };
        setBackgroundColor('#e5e7eb');
        setTextColor('text-black');
      }
    };

    fetchColor();
  }, [symbol, isClient]);

  return isClient ? (
    <div
      className={`w-28 px-3 py-1 rounded-md font-semibold flex items-center justify-center ${className}`}
      style={{ backgroundColor }}
    >
      <span className={`text-center whitespace-nowrap text-[15px] leading-none ${textColor}`}>
        {symbol}
        </span>

    </div>
  ) : null; // Render nothing on the server
};

export default StockSymbolBgColor;

