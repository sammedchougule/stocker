"use client"

import Link from "next/link"
import { Menu, X, User, Home, SquareActivity, Layers, Sliders, LayoutGrid, Newspaper  } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { StockInput } from "./Input"
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-8 left-0 right-0 z-50 border-b border-gray-200 backdrop-blur-md bg-white/10 md:p-1 lg:p-1">
        <div className="container mx-auto px-4 flex justify-between items-center py-1">
          {/* Website Name and Eye Animation */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-black flex items-center">
              Stocker
              <Image
                src="/stocker.png"
                alt="Stocker Logo"
                width={30}
                height={30}
                className="ml-1"
              />
            </Link>
          </div>

          {/* Search Input for Tablet and Desktop */}
          <div className="hidden md:flex flex-grow max-w-md px-4 relative z-10">
            <StockInput />
          </div>

          {/* Links for Desktop */}
          <div className="hidden lg:flex space-x-6">
            <Link href="/intrabuzz" className="text-black hover:text-gray-600 flex items-center">
              IntraBuzz
            </Link>
            <Link href="/sectors" className="text-black hover:text-gray-600 flex items-center">
              Sectors
            </Link>
            <Link href="/heatmap" className="text-black hover:text-gray-600 flex items-center">
              Heatmap
            </Link>
            <Link href="/screener" className="text-black hover:text-gray-600 flex items-center">
              Screener
            </Link>
            <Link href="/news" className="text-black hover:text-gray-600 flex items-center">
              News
            </Link>
            <Link href="/account" className="text-black hover:text-gray-600 flex items-center">
              Account
              <User className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Hamburger Menu for Tablet */}
          <div className="hidden md:flex lg:hidden items-center relative z-20">
            <button
              onClick={toggleMenu}
              className="text-black hover:text-gray-600 focus:outline-none p-2 rounded-md transition-colors duration-300 ease-in-out"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* User Icon for Mobile */}
          <Link href="/account" className="md:hidden text-black hover:text-gray-600">
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Search Input for Mobile */}
        <div className="md:hidden px-2 pt-0 py-1">
          <div className="relative mx-4">
            <StockInput />
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="fixed inset-0  bg-opacity-100 z-40 hidden md:block lg:hidden"
            onClick={toggleMenu}
          ></div>
        )}
        {/* Dropdown Menu for Tablet */}
        <div
          className={`fixed md:block lg:hidden top-20 right-4 w-64 bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 ${
            isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/intrabuzz"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
            >
              <SquareActivity className="h-5 w-5 mr-3" />
              IntraBuzz
            </Link>
            
            <Link
              href="/sectors"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
            >
              <Layers className="h-5 w-5 mr-3" />
              Sectors
            </Link>
            <Link
              href="/heatmap"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
            >
              <LayoutGrid className="h-5 w-5 mr-3" />
              Heatmap
            </Link>
            <Link
              href="/screener"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
            >
              <Sliders className="h-5 w-5 mr-3" />
              Screener
            </Link>
            <Link
              href="/news"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
            >
              <Newspaper  className="h-5 w-5 mr-3" />
              News
            </Link>
            <Link
              href="/account"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
            >
              <User className="h-5 w-5 mr-3" />
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar for Mobile */}
      <nav className="fixed bottom-2 left-2 right-2 z-50 border border-gray-200 shadow-2xl rounded-xl md:hidden backdrop-blur-md bg-white/10">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/"
            className={`text-gray-700 flex flex-col items-center ${
              isActive("/") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <Home className={`h-6 w-6 ${isActive("/") ? "text-blue-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">Home</span>
          </Link>
          <Link
            href="/intrabuzz"
            className={`text-gray-700 flex flex-col items-center ${
              isActive("/intrabuzz") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <SquareActivity className={`h-6 w-6 ${isActive("/intrabuzz") ? "text-blue-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">IntraBuzz</span>
          </Link>
          <Link
            href="/sectors"
            className={`text-gray-700 flex flex-col items-center ${
              isActive("/sectors") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <Layers className={`h-6 w-6 ${isActive("/sectors") ? "text-yellow-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">Sectors</span>
          </Link>
          <Link
            href="/heatmap"
            className={`text-gray-700 flex flex-col items-center ${
              isActive("/heatmap") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <LayoutGrid className={`h-6 w-6 ${isActive("/heatmap") ? "text-orange-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">Heatmap</span>
          </Link>
          <Link
            href="/news"
            className={`text-gray-700 flex flex-col items-center ${
              isActive("/news") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <Newspaper  className={`h-6 w-6 ${isActive("/news") ? "text-green-700" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">News</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar

