import { type SortOption } from "@/types/Stock";

interface StockCardProps {
  stock: Stock;
  sortBy: SortOption;
  className?: string;
  onClick: (stock: Stock) => void;
}

export default function StockCard({ stock, sortBy, className, onClick }: StockCardProps) {
  // ... rest of component
} 