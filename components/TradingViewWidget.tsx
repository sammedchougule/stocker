'use client';

import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if any
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NSE:SBIN",
      interval: '5',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: false,
      studies: ['Volume@tv-basicstudies'],
    });

    containerRef.current.appendChild(script);

    // Cleanup previous script on unmount or symbol change
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
}
