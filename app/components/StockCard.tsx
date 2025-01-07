interface StockCardProps {
  stock: Stock;
  index: number;
  sortBy: string;
  className?: string;
  onClick: () => void;
}

export default function StockCard({ stock, index, sortBy, className, onClick }: StockCardProps) {
  // ... rest of the component
} 