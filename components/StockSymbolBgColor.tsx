// import React, { useState, useEffect } from 'react';
// import stockColors from '@/data/stockColors.json';

// type StockColors = {
//   [key: string]: number[]; // Keys are strings, values are arrays of 3 numbers (RGB)
// };

// const StockSymbolBgColor = ({ 
//   symbol, 
//   className, 
//   width 
// }: { 
//   symbol: string; 
//   className?: string; 
//   width?: string; 
// }) => {
//   const containerWidth = width || '7rem';
//   const [backgroundColor, setBackgroundColor] = useState('rgb(229, 231, 235)'); // Default to light gray

//   useEffect(() => {
//     const colors = stockColors as StockColors; // Type assertion for JSON data
//     const colorArray = colors[symbol]; // Fetch RGB array for the symbol
//     if (colorArray) {
//       const rgbColor = `rgb(${colorArray.join(', ')})`;
//       setBackgroundColor(rgbColor);
//     } else {
//       setBackgroundColor('rgb(229, 231, 235)'); // Default to light gray if not found
//     }
//   }, [symbol]);

//   return (
    // <div
    //   className={`px-2 py-1 rounded-md text-white font-semibold flex items-center justify-center ${className}`}
    //   style={{ backgroundColor, width: containerWidth }}
    // >
    //   <span
    //     className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
    //     style={{
    //       paddingLeft: '4px',
    //       paddingRight: '4px',
    //       maxWidth: '100%',
    //       fontSize: symbol.length > 4 ? '12px' : '14px'
    //     }}
    //   >
    //     {symbol}
    //   </span>
    // </div>
//   );
// };

// export default StockSymbolBgColor;

import React, { useState, useEffect } from 'react';
import stockColors from '@/data/stockColors.json';

type StockColors = {
  [key: string]: number[]; // Keys are strings, values are arrays of 3 numbers (RGB)
};

const StockSymbolBgColor = ({ symbol }: { symbol: string }) => {
  const [backgroundColor, setBackgroundColor] = useState('rgb(229, 231, 235)'); // Default to light gray

  useEffect(() => {
    const colors = stockColors as StockColors; // Type assertion for JSON data
    const colorArray = colors[symbol]; // Fetch RGB array for the symbol
    if (colorArray) {
      const rgbColor = `rgb(${colorArray.join(', ')})`;
      setBackgroundColor(rgbColor);
    } else {
      setBackgroundColor('rgb(229, 231, 235)'); // Default to light gray if not found
    }
  }, [symbol]);

  return backgroundColor; // Return only the background color value
};

export default StockSymbolBgColor;
