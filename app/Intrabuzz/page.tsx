'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useStockContext } from '@/context/StockContext'
import { Stock } from '@/types/Stock'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, ArrowUp, ArrowDown, TableIcon, LayoutGrid } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { StockModal } from '@/components/StockModal';
import { Button } from '@/components/ui/buttons'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// type SortOption = 
//   | 'changepct_desc' 
//   | 'changepct_asc' 
//   | 'volumespike_desc' 
//   | 'volumespike_asc' 

// type FilterOption = 'all' | 'Nifty 50' | 'Nifty Bank' | 'Nifty IT' | 'Nifty Auto' | 'Nifty FnO'

// export default function Intrabuzz() {
//   const { stocks, loading } = useStockContext()
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const [sortBy, setSortBy] = useState<SortOption>(() => {
//     const savedSort = typeof window !== 'undefined' ? localStorage.getItem('sortBy') : null
//     return (savedSort as SortOption) || searchParams.get('sort') as SortOption || 'changepct_desc'
//   })

//   const [filterBy, setFilterBy] = useState<FilterOption>(() => {
//     const savedFilter = typeof window !== 'undefined' ? localStorage.getItem('filterBy') : null
//     return (savedFilter as FilterOption) || searchParams.get('filter') as FilterOption || 'Nifty FnO'
//   })

//   const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

//   const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('sortBy', sortBy)
//       localStorage.setItem('filterBy', filterBy)
//     }
    
//     const params = new URLSearchParams(searchParams)
//     params.set('sort', sortBy)
//     params.set('filter', filterBy)
//     router.push(`/Intrabuzz?${params.toString()}`)
//   }, [sortBy, filterBy, router, searchParams])

//   const filteredAndSortedStocks = useMemo(() => {
//     if (!stocks) return []

//     let filtered = stocks.filter(stock => stock.type === 'EQ')

//     if (filterBy !== 'all') {
//       filtered = filtered.filter(stock => 
//         stock.indices && stock.indices[filterBy as keyof typeof stock.indices]
//       )
//     } else {
//       // When 'all' is selected, show stocks from any of the specified indices
//       filtered = filtered.filter(stock => 
//         stock.indices && (
//           stock.indices["Nifty 50"]
//         )
//       )
//     }

//     switch (sortBy) {
//       case 'changepct_desc':
//         filtered.sort((a, b) => b.changepct - a.changepct)
//         break
//       case 'changepct_asc':
//         filtered.sort((a, b) => a.changepct - b.changepct)
//         break
//       case 'volumespike_desc':
//         filtered.sort((a, b) => (b.volumespike || 0) - (a.volumespike || 0))
//         break
//       case 'volumespike_asc':
//         filtered.sort((a, b) => (a.volumespike || 0) - (b.volumespike || 0))
//         break
//     }

//     return filtered
//   }, [stocks, sortBy, filterBy])

  
//   const getRandomColor = (symbol: string) => {
//     // Check if the color for the symbol is already stored in localStorage
//     const cachedColor = localStorage.getItem(symbol);
//     if (cachedColor) {
//       return cachedColor; // Return the cached color from localStorage
//     }
  
//     // If no color is found in localStorage, generate a new color and store it
//     const newColor = generateRandomColor();
//     localStorage.setItem(symbol, newColor); // Store the generated color in localStorage
//     return newColor;
//   };
  
//   // Function to generate a random hex color
//   const generateRandomColor = () => {
//     const randomHex = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hex value
//     return `#${randomHex.padStart(6, '0')}`; // Ensure 6 characters with padding
//   };

//   // Function to Modal Opening
//   const handleStockClick = (stock: Stock) => {
//     setSelectedStock(stock);
//     setIsModalOpen(true);
//   };

//   const StockCard = ({ stock }: { stock: Stock }) => (
//     <Card className="relative flex flex-col cursor-pointer" onClick={() => handleStockClick(stock)}>
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-center" >
//         <div className="w-28 px-3 py-1 rounded-md text-white font-medium text-sm flex items-center justify-center"
//           style={{ backgroundColor: getRandomColor(stock.symbol) }} // Apply cached random color
//         >
//           <span className="text-center whitespace-nowrap text-[13px] leading-none">
//             {stock.symbol}
//           </span>
//         </div>
//           <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
//             <Plus className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>
//       </CardHeader>
//       <CardContent className="pb-2 flex-grow">
//         <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
//           {stock.companyname}
//         </h3>
//       </CardContent>
//       <CardFooter className="flex flex-col items-start pt-2">
//         <div className="text-xl font-semibold mb-1">
//           ₹{Number(stock.price).toFixed(2)}
//         </div>
//         <div className="flex justify-between w-full">
//           <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
//             ${(stock.changepct >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100')
//               }`}>
//                 {stock.changepct >= 0 ? '↑' : '↓'} {Number(stock.changepct).toFixed(2)}%
//           </div>
//           <div className="text-xs font-medium text-gray-600 bg-yellow-100 px-2 py-1 rounded-md">
//             {((stock.volumespike ?? 0 ) * 100).toFixed(2)}
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   )

//   const SkeletonCard = () => (
//     <Card className="relative flex flex-col">
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-center">
//           <Skeleton width={112} height={28} />
//           <Skeleton circle width={36} height={36} />
//         </div>
//       </CardHeader>
//       <CardContent className="pb-2 flex-grow">
//         <Skeleton width="100%" height={40} />
//       </CardContent>
//       <CardFooter className="flex flex-col items-start pt-2">
//         <Skeleton width={80} height={24} className="mb-1" />
//         <Skeleton width={60} height={20} />
//       </CardFooter>
//     </Card>
//   )

//   return (
//     <div className="container mx-auto mt-8 px-4">
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <Select
//           value={filterBy}
//           onValueChange={(value: FilterOption) => setFilterBy(value)}
//         >
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Filter by Index" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Nifty FnO">All</SelectItem>
//             <SelectItem value="Nifty 50">Nifty 50</SelectItem>
//             <SelectItem value="Nifty Bank">Nifty Bank</SelectItem>
//             <SelectItem value="Nifty IT">Nifty IT</SelectItem>
//             <SelectItem value="Nifty Auto">Nifty Auto</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex items-center gap-2">
//           <Select
//             value={sortBy}
//             onValueChange={(value: SortOption) => setSortBy(value)}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="changepct_desc">
//                 <span className="flex items-center">
//                   <ArrowDown className="w-4 h-4 mr-2" />
//                   Change % 
//                 </span>
//               </SelectItem>
//               <SelectItem value="changepct_asc">
//                 <span className="flex items-center">
//                   <ArrowUp className="w-4 h-4 mr-2" />
//                   Change % 
//                 </span>
//               </SelectItem>
//               <SelectItem value="volumespike_desc">
//                 <span className="flex items-center">
//                   <ArrowDown className="w-4 h-4 mr-2" />
//                   Volume Spike 
//                 </span>
//               </SelectItem>
//               <SelectItem value="volumespike_asc">
//                 <span className="flex items-center">
//                   <ArrowUp className="w-4 h-4 mr-2" />
//                   Volume Spike 
//                 </span>
//               </SelectItem>
//             </SelectContent>
//           </Select>

//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
//           >
//             {viewMode === 'card' ? <TableIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
//           </Button>
//         </div>
//       </div>

//       {viewMode === 'card' ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//           {loading
//             ? Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)
//             : filteredAndSortedStocks.map((stock) => (
//                 <StockCard key={stock.symbol} stock={stock} />
//               ))
//           }
//         </div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Image</TableHead>
//               <TableHead>Symbol</TableHead>
//               <TableHead>Company Name</TableHead>
//               <TableHead className="text-right">Price</TableHead>
//               <TableHead className="text-right">Change %</TableHead>
//               <TableHead className="text-right">Volume Spike</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading
//               ? Array(10).fill(0).map((_, index) => (
//                   <TableRow key={index}>
//                     <TableCell><Skeleton circle width={30} height={30} /></TableCell>
//                     <TableCell><Skeleton width={60} /></TableCell>
//                     <TableCell><Skeleton width={150} /></TableCell>
//                     <TableCell className="text-right"><Skeleton width={80} /></TableCell>
//                     <TableCell className="text-right"><Skeleton width={60} /></TableCell>
//                     <TableCell className="text-right"><Skeleton width={80} /></TableCell>
//                   </TableRow>
//                 ))
//               : filteredAndSortedStocks.map((stock) => (
//                   <TableRow className='cursor-pointer' key={stock.symbol} onClick={() => handleStockClick(stock)}>
//                     <TableCell className="font-medium">
//                       <Image
//                         className='w-8 h-8 rounded-full'
//                         src={`/images/${stock.symbol}.svg`}
//                         alt={stock.companyname}
//                         width={32}
//                         height={32}
//                       />
//                     </TableCell>
//                     <TableCell className="font-medium">{stock.symbol}</TableCell>
//                     <TableCell>{stock.companyname}</TableCell>
//                     <TableCell className="text-right">₹{Number(stock.price).toFixed(2)}</TableCell>
//                     <TableCell className={`text-right ${stock.changepct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                       {Number(stock.changepct).toFixed(2)}%
//                     </TableCell>
//                     <TableCell className="text-right">{((stock.volumespike ?? 0 ) * 100).toFixed(2)}</TableCell>
//                   </TableRow>
//                 ))
//             }
//           </TableBody>
//         </Table>
//       )}

//       <StockModal
//         stock={selectedStock}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div> 
//   )
// }

type SortOption = 
  | 'changepct_desc' 
  | 'changepct_asc' 
  | 'volumespike_desc' 
  | 'volumespike_asc' 

type FilterOption = 'all' | 'Nifty 50' | 'Nifty Bank' | 'Nifty IT' | 'Nifty Auto' | 'Nifty FnO'

function IntrabuzzContent() {
  const { stocks, loading } = useStockContext()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const savedSort = typeof window !== 'undefined' ? localStorage.getItem('sortBy') : null
    return (savedSort as SortOption) || searchParams.get('sort') as SortOption || 'changepct_desc'
  })

  const [filterBy, setFilterBy] = useState<FilterOption>(() => {
    const savedFilter = typeof window !== 'undefined' ? localStorage.getItem('filterBy') : null
    return (savedFilter as FilterOption) || searchParams.get('filter') as FilterOption || 'Nifty FnO'
  })

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sortBy', sortBy)
      localStorage.setItem('filterBy', filterBy)
    }
    
    const params = new URLSearchParams(searchParams)
    params.set('sort', sortBy)
    params.set('filter', filterBy)
    router.push(`/Intrabuzz?${params.toString()}`)
  }, [sortBy, filterBy, router, searchParams])

  const filteredAndSortedStocks = useMemo(() => {
    if (!stocks) return []

    let filtered = stocks.filter(stock => stock.type === 'EQ')

    if (filterBy !== 'all') {
      filtered = filtered.filter(stock => 
        stock.indices && stock.indices[filterBy as keyof typeof stock.indices]
      )
    } else {
      // When 'all' is selected, show stocks from any of the specified indices
      filtered = filtered.filter(stock => 
        stock.indices && (
          stock.indices["Nifty 50"]
        )
      )
    }

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

    return filtered
  }, [stocks, sortBy, filterBy])

  const getRandomColor = (symbol: string) => {
    // Check if the color for the symbol is already stored in localStorage
    const cachedColor = localStorage.getItem(symbol);
    if (cachedColor) {
      return cachedColor; // Return the cached color from localStorage
    }
  
    // If no color is found in localStorage, generate a new color and store it
    const newColor = generateRandomColor();
    localStorage.setItem(symbol, newColor); // Store the generated color in localStorage
    return newColor;
  };
  
  // Function to generate a random hex color
  const generateRandomColor = () => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hex value
    return `#${randomHex.padStart(6, '0')}`; // Ensure 6 characters with padding
  };
  
  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const StockCard = ({ stock }: { stock: Stock }) => (
    <Card className="relative flex flex-col cursor-pointer" onClick={() => handleStockClick(stock)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center" >
          <div className="w-28 px-3 py-1 rounded-md text-white font-medium text-sm flex items-center justify-center"
            style={{ backgroundColor: getRandomColor(stock.symbol) }}
          >
            <span className="text-center whitespace-nowrap text-[13px] leading-none">
              {stock.symbol}
            </span>
          </div>
          <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <h3 className="text-md font-medium text-gray-900 leading-tight line-clamp-2">
          {stock.companyname}
        </h3>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <div className="text-xl font-semibold mb-2 w-full">
          ₹{Number(stock.price).toFixed(2)}
        </div>
        <div className="flex justify-between items-center w-full">
          <div className={`flex items-center px-2 py-1 rounded-md text-sm font-medium
            ${(stock.changepct >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100')}`}>
            {stock.changepct >= 0 ? '↑' : '↓'} {Number(stock.changepct).toFixed(2)}%
          </div>
          {/* <div className="flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700">
            Vol: {((stock.volumespike ?? 0) * 100).toFixed(2)}
          </div> */}
        </div>
      </CardFooter>
    </Card>
  )

  const SkeletonCard = () => (
    <Card className="relative flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Skeleton width={112} height={28} />
          <Skeleton circle width={36} height={36} />
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <Skeleton width="100%" height={40} />
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <Skeleton width={80} height={24} className="mb-1" />
        <Skeleton width={60} height={20} />
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          value={filterBy}
          onValueChange={(value: FilterOption) => setFilterBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nifty FnO">All</SelectItem>
            <SelectItem value="Nifty 50">Nifty 50</SelectItem>
            <SelectItem value="Nifty Bank">Nifty Bank</SelectItem>
            <SelectItem value="Nifty IT">Nifty IT</SelectItem>
            <SelectItem value="Nifty Auto">Nifty Auto</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="changepct_desc">
                <span className="flex items-center">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Change % 
                </span>
              </SelectItem>
              <SelectItem value="changepct_asc">
                <span className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Change % 
                </span>
              </SelectItem>
              <SelectItem value="volumespike_desc">
                <span className="flex items-center">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Volume Spike 
                </span>
              </SelectItem>
              <SelectItem value="volumespike_asc">
                <span className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Volume Spike 
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
          >
            {viewMode === 'card' ? <TableIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)
            : filteredAndSortedStocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))
          }
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change %</TableHead>
              <TableHead className="text-right">Volume Spike</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array(10).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton circle width={30} height={30} /></TableCell>
                    <TableCell><Skeleton width={60} /></TableCell>
                    <TableCell><Skeleton width={150} /></TableCell>
                    <TableCell className="text-right"><Skeleton width={80} /></TableCell>
                    <TableCell className="text-right"><Skeleton width={60} /></TableCell>
                    <TableCell className="text-right"><Skeleton width={80} /></TableCell>
                  </TableRow>
                ))
              : filteredAndSortedStocks.map((stock) => (
                  <TableRow className='cursor-pointer' key={stock.symbol} onClick={() => handleStockClick(stock)}>
                    <TableCell className="font-medium">
                      <Image
                        className='w-8 h-8 rounded-full'
                        src={`/images/${stock.symbol}.svg`}
                        alt={stock.companyname}
                        width={32}
                        height={32}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>{stock.companyname}</TableCell>
                    <TableCell className="text-right">₹{Number(stock.price).toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${stock.changepct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(stock.changepct).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">{((stock.volumespike ?? 0 ) * 100).toFixed(2)}</TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
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
    <Suspense fallback={<div>Loading...</div>}>
      <IntrabuzzContent />
    </Suspense>
  )
}