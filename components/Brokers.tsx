'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import brokerageData from '@/data/borkerageCharges.json'
import { Card, CardContent } from "@/components/ui/card"
import { BadgeIndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
            className="group [perspective:1000px] h-80">
             <div className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 group-hover:[transform:rotateY(180deg)]">
            {/* Front // src={`/logos/${broker.broker.toLowerCase().replace(/\s/g, "")}.png`}*/} 
            <Card className="absolute inset-0 bg-white dark:bg-[#151719] [backface-visibility:hidden] flex flex-col justify-between">
                <CardContent className="flex flex-col items-center justify-center text-gray-900 dark:text-gray-100 py-6 px-4">
                <Image
                    src={`/logos/${broker.broker.toLowerCase().replace(/\s/g, "")}.png`}
                    alt={`${broker.broker} logo`}
                    width={50}
                    height={50}
                    className="mb-3"
                />
                <h2 className="font-semibold text-md">{broker.broker}</h2>
                <div className="mt-4 space-y-2 text-left w-full text-sm">
                    <p className="flex items-start gap-2 ">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>AMC 1st Year: {broker.amc.resident_first_year}</span>
                    </p>
                    <p className="flex items-start gap-2">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Next: {broker.amc.resident_subsequent_years}</span>
                    </p>
                    <p className="flex items-start gap-2">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>NRI: {broker.amc.nri}</span>
                    </p>
                </div>
                </CardContent>
            </Card>

            {/* Back */}
            <Card className="absolute inset-0 bg-gray-100 dark:bg-[#151719] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto">
                <CardContent className="text-sm p-4 text-gray-900 dark:text-gray-100">
                {/* <h3 className="font-semibold text-lg mb-4 text-center">Brokerage</h3> */}
                <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Equity Intraday: {broker.brokerage.equity_intraday}</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Currency Futures: {broker.brokerage.currency_futures}</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Currency Options: {broker.brokerage.currency_options}</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Commodity Futures: {broker.brokerage.commodity_futures}</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <BadgeIndianRupee className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Commodity Options: {broker.brokerage.commodity_options}</span>
                    </li>
                </ul>
                </CardContent>
                <div className="px-4 pb-4">
                  <Button
                    asChild
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  >
                    <Link
                      href="https://zerodha.com/?c=QG5075&s=CONSOLE"
                      target="_blank"
                    >
                      Open Demat Account
                    </Link>
                  </Button>
                </div>

            </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Brokers