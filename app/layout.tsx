import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StockProvider } from '@/contexts/StockContext'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'
import { Footer } from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from "@/components/theme-provider"
import PageLayout from '@/components/PageLayout'

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
        url: '@/public/stocker.png', // Replace with your image URL
        width: 800,
        height: 600,
        alt: 'Stocker - Stock Data',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stocker-e7t7Xlm1RJmJl1G0cDVxJiL3L55KLa.png",
        href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stocker-e7t7Xlm1RJmJl1G0cDVxJiL3L55KLa.png",
      },
    ],
    shortcut: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stocker-e7t7Xlm1RJmJl1G0cDVxJiL3L55KLa.png",
        href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stocker-e7t7Xlm1RJmJl1G0cDVxJiL3L55KLa.png",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stocker-e7t7Xlm1RJmJl1G0cDVxJiL3L55KLa.png",
        href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stocker-e7t7Xlm1RJmJl1G0cDVxJiL3L55KLa.png",
      },
    ],
  },
}

export const revalidate = 60 // Revalidate every 60 seconds

async function fetchStockData() {
  const res = await fetch(
    'https://script.google.com/macros/s/AKfycbwa3ZVL20X9vlqFfpi6KSteUsEecC9QpkY3V45sxVAmEQ5xeBBKSaCUyQejxrRbwE6wGw/exec'
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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <StockProvider initialData={initialData}>
          <div className=" bg-white dark:bg-black min-h-screen">
            <Marquee />
            <Navbar />
            <PageLayout>
              {children}
              <Analytics />
            </PageLayout> 
            <Footer />
          </div>
        </StockProvider>
      </ThemeProvider>

      </body>
    </html>
  )
}



