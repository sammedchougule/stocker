import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StockProvider } from '@/context/StockContext'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stock Data Table',
  description: 'Displaying top 20 stocks data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <StockProvider>
            <div className="min-h-screen pt-20">
              <Marquee />
              <Navbar />
              <div className="content-container">
                {children}
              </div>
            </div>
          </StockProvider>
      </body>
    </html>
  )
}

