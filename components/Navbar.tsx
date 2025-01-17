'use client'

import * as React from "react"
import Link from "next/link"
import { Menu, X, User, Home, SquareActivity, Layers, Sliders, LayoutGrid, Newspaper } from 'lucide-react'
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

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
          <div className="hidden md:flex flex-grow max-w-md px-4 relative">
            <StockInput />
          </div>

          {/* Links for Desktop */}
          <div className="hidden lg:flex space-x-6">
            <Link href="/Intrabuzz" className="text-black hover:text-gray-600 flex items-center">
              IntraBuzz
            </Link>
            <Link href="/Sectors" className="text-black hover:text-gray-600 flex items-center">
              Sectors
            </Link>
            <Link href="/Heatmap" className="text-black hover:text-gray-600 flex items-center">
              Heatmap
            </Link>
            <Link href="/Screener" className="text-black hover:text-gray-600 flex items-center">
              Screener
            </Link>
            <Link href="/News" className="text-black hover:text-gray-600 flex items-center">
              News
            </Link>
            <Link href="/Account" className="text-black hover:text-gray-600 flex items-center">
              Account
              <User className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Hamburger Menu for Tablet */}
          <div className="hidden md:flex lg:hidden relative">
            <button
              onClick={toggleMenu}
              className="text-black hover:text-gray-600 focus:outline-none transition-transform duration-300 ease-in-out"
            >
              <div className={`transform ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </div>
            </button>
          </div>

          {/* User Icon for Mobile */}
          <Link href="/Account" className="md:hidden text-black hover:text-gray-600">
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Search Input for Mobile */}
        <div className="md:hidden px-2 pt-0 py-1">
          <div className="relative mx-4">
            <StockInput />
          </div>
        </div>

        {/* Dropdown Menu for Tablet */}
        <div 
          className={`absolute right-0 top-full w-64 shadow-lg transform transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-2 space-y-2 bg-gray-800">
            <Link href="/Intrabuzz" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <SquareActivity className="h-5 w-5 mr-3" />
              IntraBuzz
            </Link>
            <Link href="/Heatmap" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <LayoutGrid className="h-5 w-5 mr-3" />
              Heatmap
            </Link>
            <Link href="/Sectors" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <Layers className="h-5 w-5 mr-3" />
              Sectors
            </Link>
            <Link href="/Screener" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <Sliders className="h-5 w-5 mr-3" />
              Screener
            </Link>
            <Link href="/News" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <Newspaper className="h-5 w-5 mr-3" />
              News
            </Link>
            <Link href="/Account" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <User className="h-5 w-5 mr-3" />
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar for Mobile */}
      <nav className="fixed bottom-2 left-2 right-2 z-50 border border-gray-200 shadow-2xl rounded-xl sm:hidden backdrop-blur-md bg-white/10">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/') ? 'bg-gray-200 rounded-md px-2 py-1' : ''
            }`}
          >
            <Home className={`h-6 w-6 ${isActive('/') ? 'text-blue-500' : 'text-gray-700'}`} />
            <span className={`text-xs text-gray-600 ${isActive('/') ? 'block' : 'hidden'}`}>Home</span>
          </Link>
          <Link
            href="/Intrabuzz"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Intrabuzz') ? 'bg-gray-200 rounded-md px-2 py-1' : ''
            }`}
          >
            <SquareActivity className={`h-6 w-6 ${isActive('/Intrabuzz') ? 'text-blue-500' : 'text-gray-700'}`} />
            <span className={`text-xs text-gray-600 ${isActive('/Intrabuzz') ? 'block' : 'hidden'}`}>IntraBuzz</span>
          </Link>
          <Link
            href="/Sectors"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Sectors') ? 'bg-gray-200 rounded-md px-2 py-1' : ''
            }`}
          >
            <Layers className={`h-6 w-6 ${isActive('/Sectors') ? 'text-yellow-500' : 'text-gray-700'}`} />
            <span className={`text-xs text-gray-600 ${isActive('/Sectors') ? 'block' : 'hidden'}`}>Sectors</span>
          </Link>
          <Link
            href="/Heatmap"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Heatmap') ? 'bg-gray-200 rounded-md px-2 py-1' : ''
            }`}
          >
            <LayoutGrid className={`h-6 w-6 ${isActive('/Heatmap') ? 'text-orange-500' : 'text-gray-700'}`} />
            <span className={`text-xs text-gray-600 ${isActive('/Heatmap') ? 'block' : 'hidden'}`}>Heatmap</span>
          </Link>
          <Link
            href="/Screener"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Screener') ? 'bg-gray-200 rounded-md px-2 py-1' : ''
            }`}
          >
            <Sliders className={`h-6 w-6 ${isActive('/Screener') ? 'text-red-500' : 'text-gray-700'}`} />
            <span className={`text-xs text-gray-600 ${isActive('/Screener') ? 'block' : 'hidden'}`}>Screener</span>
          </Link>
          <Link
            href="/News"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/News') ? 'bg-gray-200 rounded-md px-2 py-1' : ''
            }`}
          >
            <Newspaper className={`h-6 w-6 ${isActive('/News') ? 'text-green-700' : 'text-gray-700'}`} />
            <span className={`text-xs text-gray-600 ${isActive('/News') ? 'block' : 'hidden'}`}>News</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
