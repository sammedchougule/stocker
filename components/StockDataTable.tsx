import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, Flame, ArrowUpDown } from 'lucide-react'
import Image from 'next/image'
import { Stock } from '@/types/Stock'
import { AnimatedValue } from '@/components/AnimatedValue'

interface StockDataTableProps {
  stocks: Stock[];
  stockAnimations: {
    priceDirection: 'up' | 'down' | null;
    changeDirection: 'up' | 'down' | null;
    volumespikeDirection: 'up' | 'down' | null;
  }[];
  onStockClick?: (stock: Stock) => void;
  onSort: (column: SortColumn) => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  usePagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

type SortColumn = 'symbol' | 'companyname' | 'closeyest' | 'price' | 'change' | 'changepct' | 'volumespike';
type SortDirection = 'asc' | 'desc';

const StockDataTable: React.FC<StockDataTableProps> = ({ stocks, stockAnimations, onStockClick, onSort, sortColumn, sortDirection, usePagination = false, currentPage = 1, totalPages = 1, onPageChange }) => {


  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if ((aValue ?? 0) < (bValue ?? 0)) return sortDirection === 'asc' ? -1 : 1;
      if ((aValue ?? 0) > (bValue ?? 0)) return sortDirection === 'asc' ? 1 : -1;
      return 0; 
    });
  }, [stocks, sortColumn, sortDirection]);

  const renderSortIcon = (column: SortColumn) => {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
    }
    return <ArrowUpDown className="w-4 h-4" />;
  };

  return (
    <div className="relative border border-gray-200 rounded-lg">
      <div className="overflow-auto max-h-[700px]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-20 bg-blue-200">
            <tr>
              <th 
                className="sticky left-0 z-30 bg-blue-200 p-4 text-left font-medium cursor-pointer"
                onClick={() => onSort('symbol')}
              >
                <div className="flex items-center gap-2">
                  <span>Symbol</span>
                  {renderSortIcon('symbol')}
                </div>
              </th>
              <th 
                className="p-4 text-left font-medium min-w-[200px] cursor-pointer"
                onClick={() => onSort('companyname')}
              >
                <div className="flex items-center gap-2">
                  <span>Company Name</span>
                  {renderSortIcon('companyname')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort('closeyest')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Previous Close</span>
                  {renderSortIcon('closeyest')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Price</span>
                  {renderSortIcon('price')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort('change')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Change</span>
                  {renderSortIcon('change')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort('changepct')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Change %</span>
                  {renderSortIcon('changepct')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[150px] cursor-pointer"
                onClick={() => onSort('volumespike')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Vol_Spike</span>
                  {renderSortIcon('volumespike')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock, index) => (
              <tr 
                key={stock.symbol} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onStockClick && onStockClick(stock)}
              >
                <td className="sticky left-0 bg-white z-10 p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Image
                      className="w-6 h-6 rounded-full"
                      src={`/images/${stock.symbol}.svg`}
                      alt={stock.companyname}
                      width={20}
                      height={20}
                    />
                    <span className="font-medium">{stock.symbol}</span>
                  </div>
                </td>
                <td className="p-4 border-t truncate max-w-[200px]">{stock.companyname}</td>
                <td className="p-4 border-t text-right">₹{Number(stock.closeyest).toFixed(2)}</td>
                <td className="p-4 border-t text-right">
                  <AnimatedValue
                    value={`₹${Number(stock.price).toFixed(2)}`}
                    direction={stockAnimations[index].priceDirection}
                  />
                </td>
                <td className="p-4 border-t text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      stock.change >= 0
                        ? 'text-green-500 bg-green-50 rounded-lg'
                        : 'text-red-500 bg-red-50 rounded-lg'
                    }`}
                  >
                    {stock.change >= 0 ? (
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    <AnimatedValue
                      value={`${Number(stock.change).toFixed(2)}`}
                      direction={stockAnimations[index].changeDirection}
                    />
                  </span>
                </td>
                <td className="p-4 border-t text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      stock.changepct >= 0
                        ? 'text-green-500 bg-green-50 rounded-lg'
                        : 'text-red-500 bg-red-50 rounded-lg'
                    }`}
                  >
                    {stock.changepct >= 0 ? (
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    <span className="text-sm font-medium">
                      {stock.changepct}%
                    </span>
                  </span>
                </td>
                <td className="p-4 border-t text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      (stock.volumespike ?? 0) >= 1
                        ? 'text-orange-600 bg-orange-100 rounded-lg'
                        : 'text-yellow-600 bg-yellow-100 rounded-lg'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 mr-0.5" />
                    <AnimatedValue
                      value={`${Number(stock.volumespike).toFixed(2)}X`}
                      direction={stockAnimations[index].volumespikeDirection}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {usePagination && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StockDataTable;
