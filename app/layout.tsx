
import './globals.css'
import { Inter } from 'next/font/google'
import { StockProvider } from '@/contexts/StockContext'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'
import { Footer } from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "@/components/theme-provider"
import PageLayout from '@/components/PageLayout'
import MetadataManager from '@/components/MetadataManager'; 

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }: {children: React.ReactNode}) {

  return (
    <html lang="en">
      <head>
        {/* MetadataManager will handle dynamic metadata updates */}
        <MetadataManager />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StockProvider>
            <div className="bg-white dark:bg-black min-h-screen">
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
