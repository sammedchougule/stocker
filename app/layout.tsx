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
        url: '/stocker.png', // Replace with your image URL
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
        url: "/stocker.png",
        href: "/stocker.png",
      },
    ],
    shortcut: [
      {
        url: "/stocker.png",
        href: "/stocker.png",
      },
    ],
    apple: [
      {
        url: "/stocker.png",
        href: "/stocker.png",
      },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StockProvider >
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


