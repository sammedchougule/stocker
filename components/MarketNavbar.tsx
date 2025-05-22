"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, LineChart, Filter, BookText } from "lucide-react"

export default function MobileNavbar() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-gray-800">
      <div className="flex justify-around items-center h-16">
        <NavItem href="/" icon={<Home className="h-5 w-5" />} label="Home" isActive={pathname === "/"} color="green" />
        <NavItem
          href="/intrabuzz"
          icon={<BarChart2 className="h-5 w-5" />}
          label="Intrabuzz"
          isActive={pathname === "/intrabuzz"}
          color="blue"
        />
        <NavItem
          href="/heatmap"
          icon={<LineChart className="h-5 w-5" />}
          label="Heatmap"
          isActive={pathname.includes("/heatmap")}
          color="purple"
        />
        <NavItem
          href="/screener"
          icon={<Filter className="h-5 w-5" />}
          label="Screener"
          isActive={pathname.includes("/screener")}
          color="yellow"
        />
        <NavItem
          href="/journal"
          icon={<BookText className="h-5 w-5" />}
          label="Journal"
          isActive={pathname === "/journal"}
          color="orange"
        />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  color: "green" | "blue" | "purple" | "yellow" | "orange"
}

function NavItem({ href, icon, label, isActive, color }: NavItemProps) {
  const colorMap = {
    green: {
      bg: "bg-gradient-to-t from-green-900/50 to-green-700/30",
      text: "text-green-500",
      border: "border-green-500",
    },
    blue: {
      bg: "bg-gradient-to-t from-blue-900/50 to-blue-700/30",
      text: "text-blue-500",
      border: "border-blue-500",
    },
    purple: {
      bg: "bg-gradient-to-t from-purple-900/50 to-purple-700/30",
      text: "text-purple-500",
      border: "border-purple-500",
    },
    yellow: {
      bg: "bg-gradient-to-t from-yellow-900/50 to-yellow-700/30",
      text: "text-yellow-500",
      border: "border-yellow-500",
    },
    orange: {
      bg: "bg-gradient-to-t from-orange-900/50 to-orange-700/30",
      text: "text-orange-500",
      border: "border-orange-500",
    },
  }

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center w-full h-full ${isActive ? colorMap[color].bg : ""}`}
    >
      <div className={`${isActive ? colorMap[color].text : "text-gray-400"}`}>{icon}</div>
      <span className={`text-xs mt-1 ${isActive ? colorMap[color].text : "text-gray-400"}`}>{label}</span>
      {isActive && <div className={`absolute bottom-0 w-12 h-1 rounded-t-full ${colorMap[color].border}`}></div>}
    </Link>
  )
}
