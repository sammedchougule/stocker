'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useStockContext } from '@/context/StockContext';
import { Stock } from '@/types/Stock';
import { StockModal } from './StockModal';

const INDICES = [
    'NIFTY_50',
    'NIFTY_AUTO',
    'NIFTY_BANK',
    'NIFTY_ENERGY',
    'NIFTY_FIN_SERVICE',
    'NIFTY_FMCG',
    'NIFTY_IT',
    'NIFTY_MEDIA',
    'NIFTY_METAL',
    'NIFTY_PHARMA',
    'NIFTY_PSU_BANK',
    'NIFTY_PVT_BANK',
    'NIFTY_REALTY',
];

const Indices: React.FC = () => {
  const { stocks, loading, error } = useStockContext();   // {lastUpdated}
  const [filteredSectors, setFilteredSectors] = useState<Stock[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (stocks.length > 0) {
      const sectorsData = stocks.filter((stock) => INDICES.includes(stock.symbol)).slice(0, 9);
      setFilteredSectors(sectorsData);
    }
  }, [stocks]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveCard((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setActiveCard((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 gap-4">
      {Array(3)
        .fill(null)
        .map((_, idx) => (
          <div key={idx} className="flex justify-between items-center px-1 py-2">
            <div className="flex items-center space-x-2">
              <Skeleton circle width={30} height={30} />
              <Skeleton width={90} height={20} />
            </div>
            <div className="text-right">
              <Skeleton width={60} height={20} />
              <div className="flex items-center justify-end mt-1">
                <Skeleton width={50} height={24} style={{ borderRadius: '0.5rem' }} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderCard = (startIndex: number, endIndex: number) => (
    <div className="grid grid-cols-1 gap-5">
      {filteredSectors.slice(startIndex, endIndex).map((sector) => (
        <div key={sector.symbol} className="flex justify-between items-start cursor-pointer" onClick={() => handleStockClick(sector)}>
          <div className="flex items-center space-x-1">
          <Image
            className='w-8 h-8 rounded-full'
            src={`/images/${sector.symbol}.svg`}
            alt={sector.companyname}
            width={32}
            height={32}
          />
            <span className="text-md font-md truncate max-w-[150px]">{sector.companyname}</span>
          </div>

          <div className="text-right">
            <div className="text-md font-md">{sector.price}</div>
            <div className="flex items-center justify-end mt-0.5">
              <span
                className={`inline-flex items-center rounded px-1 py-1 ${
                  sector.changepct >= 0
                    ? 'text-green-500 bg-green-50 rounded-lg'
                    : 'text-red-500 bg-red-50 rounded-lg'
                }`}
              >
                {sector.changepct >= 0 ? (
                  <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5" />
                )}
                <span className="text-sm font-md">
                  {sector.changepct}%
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto sm:px-6 lg:px-8">
        <Card className="bg-white">
          <CardContent>
            <p className="text-red-500 ">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto sm:px-6 lg:px-8 mt-4">
      <Card className="overflow-y-auto max-h-[calc(100vh-8rem)]">
        <Card className="p-2">
          <CardHeader className="p-2 pb-2">
            <div className="flex justify-between items-center border-b">
              <h2 className="text-xl font-medium">Sectoral Indices</h2>
              <a href="/Sectors" className="text-md text-blue-500">
                See All
              </a>
            </div>
          </CardHeader>
          <CardContent className="relative p-1">
            {loading ? (
              <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="pr-4">
                  {renderSkeleton()}
                </div>
                <div className="px-4 hidden sm:block">
                  {renderSkeleton()}
                </div>
                <div className="pl-4 hidden md:block">
                  {renderSkeleton()}
                </div>
              </div>
            ) : (
              <>
                {/* Desktop and Tablet View */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
                  <div className="pr-4">
                    {renderCard(0, 3)}
                  </div>
                  <div className="px-4 sm:border-l sm:border-gray-200 ">
                    {renderCard(3, 6)}
                  </div>
                  <div className="pl-4 md:border-l md:border-gray-200 sm:col-span-2 md:col-span-1">
                    {renderCard(6, 9)}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="sm:hidden overflow-hidden" {...handlers}>
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${activeCard * 100}%)`,
                    }}
                  >
                    <div className="w-full flex-shrink-0 px-1">
                      {renderCard(0, 3)}
                    </div>
                    <div className="w-full flex-shrink-0 px-1">
                      {renderCard(3, 6)}
                    </div>
                    <div className="w-full flex-shrink-0 px-1">
                      {renderCard(6, 9)}
                    </div>
                  </div>
                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          onClick={() => setActiveCard(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            activeCard === index ? 'bg-blue-500' : 'bg-gray-300 '
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </Card>

      <StockModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Indices;

