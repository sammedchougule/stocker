import './globals.css'
import { Inter } from 'next/font/google'
import { StockProvider } from '@/contexts/StockContext'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'
import { Footer } from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "@/components/theme-provider"
import PageLayout from '@/components/PageLayout'
import { metadataConfig, MetadataConfigType } from '@/lib/metadataConfig'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname(); // Get the current page path
  const pageKey = pathname.split('/')[1] as keyof typeof metadataConfig || 'default'; // Extract page key (e.g., 'intrabuzz', 'screener', etc.)

  // Get metadata based on the current page, fallback to default metadata
  const metadata: MetadataConfigType[keyof typeof metadataConfig] = metadataConfig[pageKey] || metadataConfig.default;

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content="https://stocker.co.in" />
        <meta property="og:site_name" content="Stocker" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/stocker.png" />
        <meta name="author" content="Stocker" />
        <link rel="icon" href="/stocker.png" />
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
