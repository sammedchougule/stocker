'use client'

import Link from "next/link"
import { Menu, X, User, Home, SquareActivity, Layers, Sliders, LayoutGrid, BriefcaseBusiness } from 'lucide-react'
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import EyeAnimation from "./EyeAnimation"

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
            <Link href="/" className="text-xl font-bold text-black flex items-center">
              ST<EyeAnimation />CKER
            </Link>
          </div>

          {/* Search Input for Tablet and Desktop */}
          <div className="hidden md:flex flex-grow max-w-md px-4 relative">
            <Input type="search" placeholder="Search..." className="w-full" />
          </div>

          {/* Links for Desktop */}
          <div className="hidden lg:flex space-x-6">
            <Link href="/Portfolio" className="text-black hover:text-gray-600 flex items-center">
              Portfolio
            </Link>
            <Link href="/Intrabuzz" className="text-black hover:text-gray-600 flex items-center">
              IntraBuzz
            </Link>
            <Link href="/Heatmap" className="text-black hover:text-gray-600 flex items-center">
              Heatmap
            </Link>
            <Link href="/Sectors" className="text-black hover:text-gray-600 flex items-center">
              Sectors
            </Link>
            <Link href="/Screeners" className="text-black hover:text-gray-600 flex items-center">
              Screeners
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
            <Input type="search" placeholder="Search..." className="w-full" />
          </div>
        </div>

        {/* Dropdown Menu for Tablet */}
        <div 
          className={`absolute right-0 top-full w-64 shadow-lg transform transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-2 space-y-2 bg-gray-800">
            <Link href="/Portfolio" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <BriefcaseBusiness className="h-5 w-5 mr-3" />
              Portfolio
            </Link>
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
            <Link href="/Screeners" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <Sliders className="h-5 w-5 mr-3" />
              Screeners
            </Link>
            <Link href="/Account" className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200">
              <User className="h-5 w-5 mr-3" />
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar for Mobile */}
      <nav className="fixed bottom-2 left-4 right-4 z-50 border border-gray-200 shadow-2xl rounded-2xl sm:hidden backdrop-blur-md bg-white/10">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/') ? 'bg-gray-200 rounded-2xl px-2 py-1' : ''
            }`}
          >
            <Home className={`h-6 w-6 ${isActive('/') ? 'text-blue-500' : 'text-gray-700'}`} />
            <span className={`text-xxs text-gray-600 ${isActive('/') ? 'block' : 'hidden'}`}>Home</span>
          </Link>
          <Link
            href="/Portfolio"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Portfolio') ? 'bg-gray-200 rounded-2xl px-2 py-1' : ''
            }`}
          >
            <BriefcaseBusiness className={`h-6 w-6 ${isActive('/Portfolio') ? 'text-green-700' : 'text-gray-700'}`} />
            <span className={`text-xxs text-gray-600 ${isActive('/Portfolio') ? 'block' : 'hidden'}`}>Portfolio</span>
          </Link>
          <Link
            href="/Intrabuzz"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Intrabuzz') ? 'bg-gray-200 rounded-2xl px-2 py-1' : ''
            }`}
          >
            <SquareActivity className={`h-6 w-6 ${isActive('/intrabuzz') ? 'text-blue-500' : 'text-gray-700'}`} />
            <span className={`text-xxs text-gray-600 ${isActive('/intrabuzz') ? 'block' : 'hidden'}`}>IntraBuzz</span>
          </Link>
          <Link
            href="/Heatmap"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Heatmap') ? 'bg-gray-200 rounded-2xl px-2 py-1' : ''
            }`}
          >
            <LayoutGrid className={`h-6 w-6 ${isActive('/heatmap') ? 'text-orange-500' : 'text-gray-700'}`} />
            <span className={`text-xxs text-gray-600 ${isActive('/heatmap') ? 'block' : 'hidden'}`}>Heatmap</span>
          </Link>
          <Link
            href="/Sectors"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Sectors') ? 'bg-gray-200 rounded-2xl px-2 py-1' : ''
            }`}
          >
            <Layers className={`h-6 w-6 ${isActive('/sectors') ? 'text-yellow-500' : 'text-gray-700'}`} />
            <span className={`text-xxs text-gray-600 ${isActive('/sectors') ? 'block' : 'hidden'}`}>Sectors</span>
          </Link>
          <Link
            href="/Screener"
            className={`text-gray-700 flex flex-col items-center ${
              isActive('/Screener') ? 'bg-gray-200 rounded-2xl px-2 py-1' : ''
            }`}
          >
            <Sliders className={`h-6 w-6 ${isActive('/screeners') ? 'text-red-500' : 'text-gray-700'}`} />
            <span className={`text-xxs text-gray-600 ${isActive('/screeners') ? 'block' : 'hidden'}`}>Screener</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
