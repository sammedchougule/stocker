import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import MobileNavbar from "@/components/MobileNavbar"
import NiftyMarquee from "@/components/NiftyMarquee"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StockDash - Real-time Stock Dashboard",
  description: "Track real-time stock market updates with StockDash",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
          <NiftyMarquee />
          <Navbar />
          <div className="py-4 md:pb-4">{children}</div>
          <Footer />
          <MobileNavbar />
      </body>
    </html>
  )
}
