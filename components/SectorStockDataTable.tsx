// components/SectorStockDataTable.tsx
import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { Stock } from '@/types/Stock'
 import { SortColumn, SortDirection } from '@/types/Stock';
import { getStockBgColor } from '@/lib/getstockBgColor';


interface SectorStockDataTableProps {
  tableId: string;
  stocks: Stock[];
  onStockClick: (stock: Stock) => void;
  onSort: (tableId: string, column: SortColumn) => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}


const SectorStockDataTable: React.FC<SectorStockDataTableProps> = ({ 
  tableId, 
  stocks, 
  onStockClick, 
  onSort, 
  sortColumn, 
  sortDirection 
}) => {

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        if (aValue.includes('%')) aValue = parseFloat(aValue);
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
        if (bValue.includes('%')) bValue = parseFloat(bValue);
      }

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
                className="sticky left-0 z-30 bg-blue-200  min-w-[100px] px-8 text-left font-medium cursor-pointer"
                onClick={() => onSort(tableId, 'symbol')}
              >
                <div className="flex items-center gap-2">
                  <span>Symbol</span>
                  {renderSortIcon('symbol')}
                </div>
              </th>
              <th 
                className="p-4 text-left font-medium min-w-[200px] cursor-pointer"
                onClick={() => onSort(tableId, 'companyname')}
              >
                <div className="flex items-center gap-2">
                  <span>Company</span>
                  {renderSortIcon('companyname')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[100px] cursor-pointer"
                onClick={() => onSort(tableId, 'price')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Price</span>
                  {renderSortIcon('price')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[100px] cursor-pointer"
                onClick={() => onSort(tableId, 'change')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Change</span>
                  {renderSortIcon('change')}
                </div>
              </th>
              <th 
                className="p-4 text-right font-medium min-w-[100px] cursor-pointer"
                onClick={() => onSort(tableId, 'changepct')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Change %</span>
                  {renderSortIcon('changepct')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => (
              <tr 
                key={stock.symbol} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onStockClick(stock)}
              >
                <td className="sticky left-0 z-10 bg-white p-4 border-t">
                  <div className="flex items-center gap-2">
                    <div 
                      className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
                      style={{ backgroundColor: getStockBgColor(stock.symbol), width: '7rem' }}
                    >
                      <span 
                        className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
                        style={{
                          paddingLeft: '4px',
                          paddingRight: '4px',
                          maxWidth: '100%',
                          fontSize: (stock.symbol).length > 10 ? '12px' : '14px'
                          }}
                        >
                        {stock.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-t max-w-[200px] md:max-w-[200px]">
                  <span className="truncate block">
                    {stock.companyname}
                  </span>
                </td>
                <td className="p-4 border-t text-right">
                  ₹{Number(stock.price).toFixed(2)}
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
                    {Number(stock.change).toFixed(2)}
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
                    {Number(stock.changepct).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectorStockDataTable;