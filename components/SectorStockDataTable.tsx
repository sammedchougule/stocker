// // components/SectorStockDataTable.tsx
// import React, { useMemo } from 'react';
// import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
// import { Stock } from '@/types/Stock'
//  import { SortColumn, SortDirection } from '@/types/Stock';
// import { getStockBgColor } from '@/lib/getstockBgColor';
// import Image from 'next/image';

// interface SectorStockDataTableProps {
//   tableId: string;
//   stocks: Stock[];
//   onStockClick: (stock: Stock) => void;
//   onSort: (tableId: string, column: SortColumn) => void;
//   sortColumn: SortColumn;
//   sortDirection: SortDirection;
// }


// const SectorStockDataTable: React.FC<SectorStockDataTableProps> = ({ 
//   tableId, 
//   stocks, 
//   onStockClick, 
//   onSort, 
//   sortColumn, 
//   sortDirection 
// }) => {

//   const sortedStocks = useMemo(() => {
//     return [...stocks].sort((a, b) => {
//       let aValue = a[sortColumn];
//       let bValue = b[sortColumn];
  
//       // Helper function to parse currency values
//       const parseCurrency = (value: string | number) => {
//         if (typeof value === 'string') {
//           if (value.includes('₹')) {
//             return parseFloat(value.replace(/[^\d.-]/g, '')); // Remove ₹ and parse as number
//           }
//           if (value.includes('%')) {
//             return parseFloat(value.replace('%', '')); // Remove % and parse as percentage
//           }
//         }
//         return parseFloat(value.toString()); // For numeric values, return as number
//       };
  
//       // Handle sorting for price, change, changepct (numeric columns)
//       if (sortColumn === 'price' || sortColumn === 'change' || sortColumn === 'changepct') {
//         aValue = parseCurrency(aValue ?? 0);
//         bValue = parseCurrency(bValue ?? 0);
//       }
  
//       // Handle sorting for symbol and companyname (alphabetical)
//       if (typeof aValue === 'string' && typeof bValue === 'string') {
//         aValue = aValue.toLowerCase();
//         bValue = bValue.toLowerCase();
//         return sortDirection === 'asc'
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
  
//       // Handle numeric sorting for other columns
//       return (aValue ?? 0) < (bValue ?? 0)
//         ? sortDirection === 'asc'
//           ? -1
//           : 1
//         : (aValue ?? 0) > (bValue ?? 0)
//         ? sortDirection === 'asc'
//           ? 1
//           : -1
//         : 0;
//     });
//   }, [stocks, sortColumn, sortDirection]);  
  

//   const renderSortIcon = (column: SortColumn) => {
//     if (column === sortColumn) {
//       return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
//     }
//     return <ArrowUpDown className="w-4 h-4" />;
//   };

//   return (
//     <div className="relative border border-gray-200 rounded-lg">
//       <div className="overflow-auto max-h-[700px]">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-20 bg-blue-200">
//             <tr>
//               <th 
//                 className="sticky left-0 z-30 bg-blue-200  min-w-[100px] px-8 text-left font-medium cursor-pointer"
//                 onClick={() => onSort(tableId, 'symbol')}
//               >
//                 <div className="flex items-center gap-2">
//                   <span>Symbol</span>
//                   {renderSortIcon('symbol')}
//                 </div>
//               </th>
//               <th 
//                 className="p-2 text-left font-medium cursor-pointer"
//                 onClick={() => onSort(tableId, 'companyname')}
//               >
//                 <div className="flex items-center gap-2">
//                   <span>Close Yst.</span>
//                   {renderSortIcon('companyname')}
//                 </div>
//               </th>
//               <th 
//                 className="p-2 text-right font-medium min-w-[100px] cursor-pointer"
//                 onClick={() => onSort(tableId, 'price')}
//               >
//                 <div className="flex items-center justify-end gap-2">
//                   <span>Price</span>
//                   {renderSortIcon('price')}
//                 </div>
//               </th>
//               <th 
//                 className="p-2 text-right font-medium min-w-[100px] cursor-pointer"
//                 onClick={() => onSort(tableId, 'change')}
//               >
//                 <div className="flex items-center justify-end gap-2">
//                   <span>Change</span>
//                   {renderSortIcon('change')}
//                 </div>
//               </th>
//               <th 
//                 className="p-2 text-right font-medium min-w-[100px] cursor-pointer"
//                 onClick={() => onSort(tableId, 'changepct')}
//               >
//                 <div className="flex items-center justify-end gap-2">
//                   <span>Chg %</span>
//                   {renderSortIcon('changepct')}
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedStocks.map((stock) => (
//               <tr 
//                 key={stock.symbol} 
//                 className="cursor-pointer hover:bg-gray-50"
//                 onClick={() => onStockClick(stock)}
//               >
//                 <td className="sticky left-0 z-10 bg-white p-4 border-t">
//                   <div className="flex items-center gap-2">
//                     <Image className="w-6 h-6 rounded-full" 
//                       src={`/images/${stock.symbol}.svg`} 
//                       alt={stock.companyname} 
//                       width={20} 
//                       height={20} 
//                     />
//                     <div 
//                       className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
//                       style={{ backgroundColor: getStockBgColor(stock.symbol), width: '7rem' }}
//                       >
//                       <span 
//                         className="whitespace-nowrap text-[14px] leading-none text-center block overflow-hidden text-ellipsis"
//                         style={{
//                           paddingLeft: '4px',
//                           paddingRight: '4px',
//                           maxWidth: '100%',
//                           fontSize: (stock.symbol).length > 10 ? '12px' : '14px'
//                           }}
//                         >
//                         {stock.symbol}
//                       </span>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-2 border-t text-left">
//                   <span className="truncate block">
//                   ₹{stock.closeyest}
//                   </span>
//                 </td>
//                 <td className="p-2 border-t text-right">
//                   ₹{Number(stock.price).toFixed(2)}
//                 </td>
//                 <td className="p-2 border-t text-right">
//                   <span
//                     className={`inline-flex items-center rounded px-1 py-1 font-medium text-md ${
//                       stock.change >= 0
//                         ? 'text-green-500 bg-green-50 rounded-lg'
//                         : 'text-red-500 bg-red-50 rounded-lg'
//                     }`}
//                   >
//                     {stock.change >= 0 ? (
//                       <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
//                     ) : (
//                       <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
//                     )}
//                     {Number(stock.change).toFixed(2)}
//                   </span>
//                 </td>
//                 <td className="p-2 border-t text-right">
//                   <span
//                     className={`inline-flex items-center rounded px-1 py-1 font-medium ${
//                       stock.changepct >= 0
//                         ? 'text-green-500 bg-green-50 rounded-lg'
//                         : 'text-red-500 bg-red-50 rounded-lg'
//                     }`}
//                   >
//                     {stock.changepct >= 0 ? (
//                       <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
//                     ) : (
//                       <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
//                     )}
//                     {Number(stock.changepct).toFixed(2)}%
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SectorStockDataTable;




"use client"

// components/SectorStockDataTable.tsx
import type React from "react"
import { useMemo } from "react"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import type { Stock } from "@/types/Stock"
import type { SortColumn, SortDirection } from "@/types/Stock"
import { getStockBgColor } from "@/lib/getstockBgColor"
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "./ui/table"

interface SectorStockDataTableProps {
  tableId: string
  stocks: Stock[]
  onStockClick: (stock: Stock) => void
  onSort: (tableId: string, column: SortColumn) => void
  sortColumn: SortColumn
  sortDirection: SortDirection
}

const SectorStockDataTable: React.FC<SectorStockDataTableProps> = ({
  tableId,
  stocks,
  onStockClick,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => {
      let aValue = a[sortColumn]
      let bValue = b[sortColumn]

      // Helper function to parse currency values
      const parseCurrency = (value: string | number) => {
        if (typeof value === "string") {
          if (value.includes("₹")) {
            return Number.parseFloat(value.replace(/[^\d.-]/g, ""))
          }
          if (value.includes("%")) {
            return Number.parseFloat(value.replace("%", ""))
          }
        }
        return Number.parseFloat(value.toString())
      }

      // Handle sorting for price, change, changepct (numeric columns)
      if (sortColumn === "price" || sortColumn === "change" || sortColumn === "changepct") {
        aValue = parseCurrency(aValue ?? 0)
        bValue = parseCurrency(bValue ?? 0)
      }

      // Handle sorting for symbol and companyname (alphabetical)
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Handle numeric sorting for other columns
      return (aValue ?? 0) < (bValue ?? 0)
        ? sortDirection === "asc"
          ? -1
          : 1
        : (aValue ?? 0) > (bValue ?? 0)
          ? sortDirection === "asc"
            ? 1
            : -1
          : 0
    })
  }, [stocks, sortColumn, sortDirection])

  const renderSortIcon = (column: SortColumn) => {
    if (column === sortColumn) {
      return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
    }
    return <ArrowUpDown className="w-4 h-4" />
  }

  return (
    <div className="relative border bg-white dark:bg-[#151719] rounded-lg">
      <div className="overflow-auto max-h-[730px]">
        <Table className="w-full border-collapse">
          <TableHeader className="sticky top-0 z-20  backdrop-blur bg-blue-200 dark:bg-blue-900 ">
            <TableRow>
              <TableHead
                className="sticky left-0 z-30  min-w-[100px] px-8 py-3 text-left font-medium cursor-pointer border-b bg-blue-200 dark:bg-blue-900 dark:border-gray-700"
                onClick={() => onSort(tableId, "symbol")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-gray-100">Symbol</span>
                  {renderSortIcon("symbol")}
                </div>
              </TableHead>
              <TableHead
                className="p-3 text-left font-medium cursor-pointer border-b dark:border-gray-700"
                onClick={() => onSort(tableId, "companyname")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-gray-100">Pre Close</span>
                  {renderSortIcon("companyname")}
                </div>
              </TableHead>
              <TableHead
                className="p-3 text-right font-medium min-w-[100px] cursor-pointer border-b dark:border-gray-700"
                onClick={() => onSort(tableId, "price")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span className="text-gray-900 dark:text-gray-100">Price</span>
                  {renderSortIcon("price")}
                </div>
              </TableHead>
              <TableHead
                className="p-3 text-right font-medium min-w-[100px] cursor-pointer border-b dark:border-gray-700"
                onClick={() => onSort(tableId, "change")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span className="text-gray-900 dark:text-gray-100">Change</span>
                  {renderSortIcon("change")}
                </div>
              </TableHead>
              <TableHead
                className="p-3 text-right font-medium min-w-[100px] cursor-pointer border-b dark:border-gray-700"
                onClick={() => onSort(tableId, "changepct")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span className="text-gray-900 dark:text-gray-100">Chg %</span>
                  {renderSortIcon("changepct")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-[#151719]">
            {sortedStocks.map((stock) => (
              <TableRow
                key={stock.symbol}
                className="cursor-pointer bg-white dark:bg-[#151719] hover:bg-gray-200 dark:hover:bg-muted/100 transition-colors"
                onClick={() => onStockClick(stock)}
              >
                <TableCell className="sticky left-0 z-10  p-4 border-t dark:border-gray-800">
                  
                    <div
                      className="px-1 py-1 rounded-md text-white font-semibold flex items-center justify-center"
                      style={{ backgroundColor: getStockBgColor(stock.symbol), width: "6rem" }}
                    >
                      <span
                        className="whitespace-nowrap text-[12px] leading-none text-center block overflow-hidden text-ellipsis"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                          maxWidth: "100%",
                          fontSize: stock.symbol.length > 10 ? "10px" : "12px",
                        }}
                      >
                        {stock.symbol}
                      </span>
                  </div>
                </TableCell>
                <TableCell className="p-3 border-t dark:border-gray-800 text-left text-gray-900 dark:text-gray-100">
                  <span className="truncate block">₹{stock.closeyest}</span>
                </TableCell>
                <TableCell className="p-3 border-t dark:border-gray-800 text-right text-gray-900 dark:text-gray-100">
                  ₹{Number(stock.price).toFixed(2)}
                </TableCell>
                <TableCell className="p-3 border-t dark:border-gray-800 text-right">
                  <span
                    className={`inline-flex items-center rounded px-2 py-1 font-medium text-md ${
                      stock.change >= 0
                        ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50"
                        : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50"
                    }`}
                  >
                    {stock.change >= 0 ? (
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {Number(stock.change).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="p-3 border-t dark:border-gray-800 text-right">
                  <span
                    className={`inline-flex items-center rounded px-1 py-1 font-medium ${
                      stock.changepct >= 0
                        ? "text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/50"
                        : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/50"
                    }`}
                  >
                    {stock.changepct >= 0 ? (
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {Number(stock.changepct).toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default SectorStockDataTable

