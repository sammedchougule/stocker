import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'
import { Footer } from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "@/components/theme-provider"
import PageLayout from '@/components/PageLayout'
import MetadataManager from '@/components/MetadataManager'
import { getStocks } from '@/lib/getStocks' // Import the getStocks function

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: {children: React.ReactNode}) {
  // Fetch the stocks data using getStocks function
  const stocks = await getStocks()

  return (
    <html lang="en">
      <head>
        {/* MetadataManager will handle dynamic metadata updates */}
        <MetadataManager />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Pass the stocks data directly to any component that requires it */}
          <div className="bg-white dark:bg-black min-h-screen">
            <Marquee />
            <Navbar />
            <PageLayout>
              {/* Pass the stocks data to children or a component that requires it */}
              {children}
              <Analytics />
            </PageLayout>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
