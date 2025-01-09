import './globals.css'
import { Inter } from 'next/font/google'
import { StockProvider } from '@/context/StockContext'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'
import Head from 'next/head'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StockProvider>
          <div className="min-h-screen pt-20">
            <Marquee />
            <Navbar />
            <div className="content-container mb-20">{children}</div>
            <Footer />
          </div>
          <Head>
            <meta name="theme-color" content="#000000" />
          </Head>
        </StockProvider>
      </body>
    </html>
  )
}
