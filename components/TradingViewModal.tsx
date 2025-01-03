'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import TradingViewWidget from '@/components/TradingViewWidget';

interface TradingViewModalProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TradingViewModal({ symbol, isOpen, onClose }: TradingViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/80 backdrop-blur-md border border-gray-200 max-w-4xl rounded-lg shadow-lg w-[calc(100%-32px)] sm:w-full mx-auto">
        <div className="flex flex-col items-center justify-center h-[500px]">
          <h2 className="text-xl font-semibold mb-4">TradingView Chart for {symbol}</h2>
          <TradingViewWidget symbol={symbol} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
