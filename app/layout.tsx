import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Marquee from '@/components/Marquee'
import { Footer } from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "@/components/theme-provider"
import PageLayout from '@/components/PageLayout'
import MetadataManager from '@/components/MetadataManager'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: {children: React.ReactNode}) {
  

  return (
    <html lang="en">
      <head>
        {/* Place only static tags here, do not render React components */}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Dynamic metadata manager should be rendered here, not in <head> */}
          <MetadataManager />
          <div className="bg-white dark:bg-black min-h-screen">
            <Marquee />
            <Navbar />
            <PageLayout>
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
