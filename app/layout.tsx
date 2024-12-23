import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StockProvider } from '@/context/StockContext'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stocker - Real-Time Stock Data and Portfolio Tracker',
  description: 'Track real-time stock data, build portfolios, and analyze financial reports with Stocker.',
  keywords: 'stocks, real-time stock data, stock portfolio, financial analysis, stock market',
  authors: [{ name: 'Stocker', url: 'https://stocker.co.in' }],
  openGraph: {
    title: 'Stocker - Real-Time Stock Data and Portfolio Tracker',
    description: 'Track real-time stock data, build portfolios, and analyze financial reports with Stocker.',
    url: 'https://stocker.co.in',
    siteName: 'Stocker',
    images: [
      {
        url: '/images/stock-image.png', // Replace with your image URL
        width: 800,
        height: 600,
        alt: 'Stocker - Stock Data',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico', // Replace with your favicon URL
    apple: '/apple-icon.png', // Replace with your apple icon URL
  },
  // Removed themeColor from here
}

export const revalidate = 60 // Revalidate every 60 seconds

async function fetchStockData() {
  const res = await fetch(
    'https://script.google.com/macros/s/AKfycbwiEg6IZArG2gqeW0B_m_WxYhXYon4XEqqA1Cz7ssgZ52u3b_uTC9RMQJ9UsC9yJhr-kQ/exec'
  )
  const stockData = await res.json()
  return {
    stocks: stockData.data,
    lastUpdated: new Date().toISOString(),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const initialData = await fetchStockData()
  return (
    <html lang="en">
      <body className={inter.className}>
        <StockProvider initialData={initialData}>
          <div className="min-h-screen pt-20">
            <Marquee />
            <Navbar />
            <div className="content-container">
              {children}
            </div>
          </div>
        </StockProvider>

        {/* Use the Head component to add themeColor */}
        <Head>
          <meta name="theme-color" content="#000000" /> {/* Replace with your desired theme color */}
        </Head>
      </body>
    </html>
  )
}