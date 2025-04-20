'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import brokerageData from '@/data/borkerageCharges.json'
import { Card, CardContent } from "@/components/ui/card"


// Type Definitions
type Brokerage = {
  equity_intraday: string
  currency_futures: string
  currency_options: string
  commodity_futures: string
  commodity_options: string
}

type AMC = {
  resident_first_year: string
  resident_subsequent_years: string
  nri: string
}

type AccountOpening = {
  resident: string
  nri: string
}

type Broker = {
  broker: string
  logo?: string
  account_opening: AccountOpening
  amc: AMC
  brokerage: Brokerage
}

const Brokers = () => {
  const [brokers, setBrokers] = useState<Broker[]>([])

  useEffect(() => {
    setBrokers(brokerageData as Broker[])
  }, [])

  return (
    <div className="container mx-auto ">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Open Account With Top Brokers
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {brokers.map((broker, index) => (
          <div
            key={index}
            className="group [perspective:1000px] h-72"
          >
            <div className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 group-hover:[transform:rotateY(180deg)]">
              {/* Front */}
              <Card className="absolute inset-0 bg-white dark:bg-[#151719] [backface-visibility:hidden] flex flex-col items-center justify-center">
                <CardContent className="text-center flex flex-col items-center justify-center text-gray-900 dark:text-gray-100">
                    <Image
                        src={`/logos/${broker.broker.toLowerCase().replace(/\s/g, "")}.png`}
                        alt={`${broker.broker} logo`}
                        width={50}
                        height={50}
                        className="mb-3"
                    />
                    <h2 className="font-semibold text-md">{broker.broker}</h2>
                    <p className="text-sm mt-2">AMC 1st Year: {broker.amc.resident_first_year}</p>
                    <p className="text-sm">Next: {broker.amc.resident_subsequent_years}</p>
                    <p className="text-sm">NRI: {broker.amc.nri}</p>
                </CardContent>
              </Card>

              {/* Back */}
              <Card className="absolute inset-0 bg-gray-100 dark:bg-[#151719] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto">
                <CardContent className="text-sm p-4 text-gray-900 dark:text-gray-100">
                  <h3 className="font-semibold mb-2">Brokerage</h3>
                  <ul className="space-y-1">
                    <li>Equity Intraday: {broker.brokerage.equity_intraday}</li>
                    <li>Currency Futures: {broker.brokerage.currency_futures}</li>
                    <li>Currency Options: {broker.brokerage.currency_options}</li>
                    <li>Commodity Futures: {broker.brokerage.commodity_futures}</li>
                    <li>Commodity Options: {broker.brokerage.commodity_options}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Brokers