"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, Home, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchInput } from "./SearchInput"

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Intraday",
      href: "/intraday",
      icon: BarChart3,
    },
    {
      name: "Market Mood",
      href: "/market-mood-index",
      icon: LineChart,
    },
    {
      name: "Journal",
      href: "/journal",
      icon: BookOpen,
    },
  ]

  return (
    <header className="sticky top-8 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex w-full justify-between items-center gap-4">
          {/* Logo - visible on all screen sizes */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">Stocker</span>
          </Link>

          {/* Search Input - visible on all screen sizes */}
          <div className="flex-1 max-w-md mx-4">
            <SearchInput />
          </div>

          {/* Navigation - hidden on mobile, visible on md and up */}
          <nav className="hidden md:flex items-center space-x-1 md:space-x-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex h-8 items-center justify-center px-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:px-3 relative",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5 md:mr-1" />
                  <span className="hidden md:inline-block">{link.name}</span>
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-1 h-1 rounded-full" style={{
                      background: 'linear-gradient(90deg, #22c55e, #eab308, #f97316, #ef4444, #22c55e)',
                    }} />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
