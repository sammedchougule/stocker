'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useStockContext } from '@/context/StockContext'
import { Stock } from '@/types/Stock'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUp, ArrowDown, TableIcon, LayoutGrid, Flame, Percent } from 'lucide-react'
import { StockModal } from '@/components/StockModal';
import { Button } from '@/components/ui/buttons'
import { useSearchParams } from 'next/navigation'
import { useStockAnimation } from '@/hooks/useStockAnimation'
import StockDataTable from '@/components/StockDataTable';
import StockCard from '@/components/StockCard';

type SortOption = 
  | 'changepct_desc' 
  | 'changepct_asc' 
  | 'volumespike_desc' 
  | 'volumespike_asc' 

type FilterOption = 
| "all"
| "Nifty 50"
| "Nifty Bank"
| "Nifty IT"
| "Nifty Auto"
| "Nifty FnO"
| "Nifty Financial Services"
| "Nifty FMCG"
| "Nifty Healthcare"
| "Nifty Media"
| "Nifty Metal"
| "Nifty Pharma"
| "Nifty PVT Bank"
| "Nifty PSU Bank"
| "Nifty Realty";

type TableSortColumn = 'symbol' | 'companyname' | 'closeyest' | 'price' | 'change' | 'changepct' | 'volumespike';
type TableSortDirection = 'asc' | 'desc';



function IntrabuzzContent() {
  
  const { stocks } = useStockContext()
  const searchParams = useSearchParams()

  // Move these hooks to the top level
  const priceDirections = stocks?.map(stock => useStockAnimation(stock, ['price'])) || [];
  const changeDirections = stocks?.map(stock => useStockAnimation(stock, ['change', 'changepct'])) || [];
  const volumespikeDirections = stocks?.map(stock => useStockAnimation(stock, ['volumespike'])) || [];

  const [sortBy, setSortBy] = useState<SortOption>(() => {
    if (typeof window !== 'undefined') {
      const savedSort = localStorage.getItem('sortBy')
      return (savedSort as SortOption) || searchParams.get('sort') || 'changepct_desc'
    }
    return 'changepct_desc'
  })

  const [filterBy, setFilterBy] = useState<FilterOption>(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = localStorage.getItem('filterBy')
      return (savedFilter as FilterOption) || searchParams.get('filter') || 'Nifty FnO'
    }
    return 'Nifty FnO'
  })

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableSortColumn, setTableSortColumn] = useState<TableSortColumn>('symbol');
  const [tableSortDirection, setTableSortDirection] = useState<TableSortDirection>('asc');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sortBy', sortBy)
      localStorage.setItem('filterBy', filterBy)
    }
  }, [sortBy, filterBy])
    
  const filteredAndSortedStocks = useMemo(() => {
    if (!stocks) return []

    let filtered = stocks.filter(stock => stock.type === 'EQ')

    if (filterBy !== 'all') {
      filtered = filtered.filter(stock => 
        stock.indices && stock.indices[filterBy as keyof typeof stock.indices]
      )
    } else {
      filtered = filtered.filter(stock => 
        stock.indices && (
          stock.indices["Nifty 50"]
        )
      )
    }

    // First apply the main sorting (if in card view)
    if (viewMode === 'card') {
      switch (sortBy) {
        case 'changepct_desc':
          filtered.sort((a, b) => b.changepct - a.changepct)
          break
        case 'changepct_asc':
          filtered.sort((a, b) => a.changepct - b.changepct)
          break
        case 'volumespike_desc':
          filtered.sort((a, b) => (b.volumespike || 0) - (a.volumespike || 0))
          break
        case 'volumespike_asc':
          filtered.sort((a, b) => (a.volumespike || 0) - (b.volumespike || 0))
          break
      }
    } else {
      // Apply table sorting
      filtered.sort((a, b) => {
        let aValue = a[tableSortColumn];
        let bValue = b[tableSortColumn];

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if ((aValue ?? 0) < (bValue ?? 0)) return tableSortDirection === 'asc' ? -1 : 1;
        if ((aValue ?? 0) > (bValue ?? 0)) return tableSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered
  }, [stocks, sortBy, filterBy, viewMode, tableSortColumn, tableSortDirection])

  const stockAnimations = useMemo(() => {
    return filteredAndSortedStocks.map((stock) => ({
      priceDirection: priceDirections[stocks.indexOf(stock)],
      changeDirection: changeDirections[stocks.indexOf(stock)],
      volumespikeDirection: volumespikeDirections[stocks.indexOf(stock)]
    }));
  }, [filteredAndSortedStocks, stocks, priceDirections, changeDirections, volumespikeDirections]);
  
  //TODO: Implement Modal Open
  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleTableSort = (column: TableSortColumn) => {
    if (column === tableSortColumn) {
      setTableSortDirection(tableSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTableSortColumn(column);
      setTableSortDirection('asc');
    }
  };

  const currentTableData = filteredAndSortedStocks;

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-4 mb-6">
        <Select
          value={filterBy}
          onValueChange={(value: FilterOption) => setFilterBy(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter by Index" />
          </SelectTrigger>
          <SelectContent>
                <SelectItem value="Nifty FnO">All</SelectItem>
                  <SelectItem value="Nifty 50">Nifty 50</SelectItem>
                <SelectItem value="Nifty Auto">Auto</SelectItem>
                <SelectItem value="Nifty Bank">Bank</SelectItem>
                  <SelectItem value="Nifty Financial Services">Financials</SelectItem>
                  <SelectItem value="Nifty FMCG">FMCG</SelectItem>
                  <SelectItem value="Nifty Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Nifty IT">IT</SelectItem>
                  <SelectItem value="Nifty Media">Media</SelectItem>
                  <SelectItem value="Nifty Metal">Metal</SelectItem>
                  <SelectItem value="Nifty Pharma">Pharma</SelectItem>
                  <SelectItem value="Nifty PVT Bank">PVT Bank</SelectItem>
                  <SelectItem value="Nifty PSU Bank">PSU Bank</SelectItem>
                  <SelectItem value="Nifty Realty">Realty</SelectItem>
              </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSortBy(sortBy === 'changepct_desc' ? 'changepct_asc' : 'changepct_desc')}
          >
            <Percent className="w-4 h-4" />
            {sortBy.startsWith('changepct') && (
              sortBy === 'changepct_desc' ? (
                <ArrowDown className="w-4 h-4 font-extrabold text-green-500" />
              ) : (
                <ArrowUp className="w-4 h-4 font-extrabold text-red-500" />
              )
            )}
            {!sortBy.startsWith('changepct') && (
              <ArrowDown className="w-4 h-4 text-gray-400" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSortBy(sortBy === 'volumespike_desc' ? 'volumespike_asc' : 'volumespike_desc')}
          >
            <Flame className="w-4 h-4" />
            {sortBy.startsWith('volumespike') && (
              sortBy === 'volumespike_desc' ? (
                <ArrowDown className="w-4 h-4 font-extrabold text-green-500" />
              ) : (
                <ArrowUp className="w-4 h-4 font-extrabold text-red-500" />
              )
            )}
            {!sortBy.startsWith('volumespike') && (
              <ArrowDown className="w-4 h-4  text-gray-400" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
          >
            {viewMode === 'card' ? <TableIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {stocks?.length === 0 ? (
        <div>Loading...</div>
      ) : (
      <>
      {viewMode === 'card' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredAndSortedStocks.map((stock, index) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  index={index}
                  sortBy={sortBy}
                  stockAnimations={stockAnimations[index]}
                  onClick={handleStockClick}
                />
              ))}
        </div>
      ) : (
        <>
          <StockDataTable
            stocks={currentTableData}
            stockAnimations={stockAnimations}
            onStockClick={handleStockClick}
            onSort={handleTableSort}
            sortColumn={tableSortColumn}
            sortDirection={tableSortDirection}
          />
        </>
      )}
    </>
      )}

      <StockModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div> 
  )
}


export default function Intrabuzz() {
  return (
    <Suspense>
      <IntrabuzzContent />
    </Suspense>
  )
}
