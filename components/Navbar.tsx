"use client"

import Link from "next/link"
import { Menu, X, SquareActivity, Layers, Sliders, LayoutGrid, Newspaper , Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { StockInput } from "./Input"
import { useTheme } from "next-themes"
import Image from "next/image"

const Navbar = () => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showBottomNav, setShowBottomNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const { theme, setTheme } = useTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        setShowBottomNav(false)
      } else {
        setShowBottomNav(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-8 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-white/10 dark:bg-gray-800/10 md:p-1 lg:p-1">
        <div className="container mx-auto px-4 flex justify-between items-center py-1">
          {/* Website Name, Eye Animation, and Mobile Theme Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="text-2xl font-bold text-black dark:text-white flex items-center gap-1">
              Stocker
              <Image
                src="/stocker.png"
                alt="Stocker Logo"
                width={24}
                height={24}
                className="w-8 h-8"
              />
            </Link>
            <button
              onClick={toggleTheme}
              className="md:hidden text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Search Input for Tablet and Desktop */}
          <div className="hidden md:flex justify-center flex-grow max-w-lg px-4 relative z-10">
            <StockInput />
          </div>

          {/* Links for Desktop */}
          <div className="hidden lg:flex space-x-6">
            <Link
              href="/intrabuzz"
              className={`flex items-center gap-1 ${isActive("/intrabuzz") ? "text-yellow-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
            >
              <SquareActivity
                className={`h-5 w-5  ${isActive("/intrabuzz") ? "text-yellow-500" : "text-gray-700 dark:text-gray-300"}`}
              />
              IntraBuzz
            </Link>

            <Link
              href="/sectors"
              className={`flex items-center gap-1 ${isActive("/sectors") ? "text-red-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
            >
              <Layers
                className={`h-5 w-5 ${isActive("/sectors") ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}
              />
              Sectors
            </Link>
            <Link
              href="/heatmap"
              className={`flex items-center gap-1 ${isActive("/heatmap") ? "text-orange-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
            >
              <LayoutGrid
                className={`h-5 w-5 ${isActive("/heatmap") ? "text-orange-500" : "text-gray-700 dark:text-gray-300"}`}
              />
              Heatmap
            </Link>
            <Link
              href="/screener"
              className={`flex items-center gap-1 ${isActive("/screener") ? "text-green-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
            >
              <Sliders
                className={`h-5 w-5 ${isActive("/screener") ? "text-green-500" : "text-gray-700 dark:text-gray-300"}`}
              />
              Screener
            </Link>
            <Link
              href="/news"
              className={`flex items-center gap-1 ${isActive("/news") ? "text-blue-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
            >
              <Newspaper 
                className={`h-5 w-5 ${isActive("/news") ? "text-blue-700" : "text-gray-700 dark:text-gray-300"}`}
              />
              News
            </Link>
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Hamburger Menu for Tablet */}
          <div className="hidden md:flex lg:hidden items-center relative z-20">
            <button
              onClick={toggleMenu}
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none p-2 rounded-md transition-colors duration-300 ease-in-out"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Input for Mobile */}
        <div className="md:hidden px-2 pt-0 py-1">
          <div className="relative mx-4">
            <StockInput />
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden md:block lg:hidden"
            onClick={toggleMenu}
          ></div>
        )}
        {/* Dropdown Menu for Tablet */}
        <div
          className={`fixed md:block lg:hidden top-20 right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 ${
            isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/intrabuzz"
              className="flex items-center py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
            >
              <SquareActivity className="h-5 w-5 mr-3" />
              IntraBuzz
            </Link>

            <Link
              href="/sectors"
              className="flex items-center py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
            >
              <Layers className="h-5 w-5 mr-3" />
              Sectors
            </Link>
            <Link
              href="/heatmap"
              className="flex items-center py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
            >
              <LayoutGrid className="h-5 w-5 mr-3" />
              Heatmap
            </Link>
            <Link
              href="/screener"
              className="flex items-center py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
            >
              <Sliders className="h-5 w-5 mr-3" />
              Screener
            </Link>
            <Link
              href="/news"
              className="flex items-center py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
            >
              <Newspaper  className="h-5 w-5 mr-3" />
              News
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar for Mobile */}
      <nav
        className={`fixed bottom-2 left-2 right-2 z-50 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl md:hidden backdrop-blur-md bg-white/10 dark:bg-gray-800/10 transition-transform duration-300 ${showBottomNav ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-around items-center py-2">
          <Link
            href="/intrabuzz"
            className={`text-gray-700 dark:text-gray-300 flex flex-col items-center cursor-pointer ${
              isActive("/intrabuzz") ? "bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1" : ""
            }`}
          >
            <SquareActivity
              className={`h-6 w-6 ${isActive("/intrabuzz") ? "text-yellow-500" : "text-gray-700 dark:text-gray-300"}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">IntraBuzz</span>
          </Link>
          <Link
            href="/sectors"
            className={`text-gray-700 dark:text-gray-300 flex flex-col items-center cursor-pointer ${
              isActive("/sectors") ? "bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1" : ""
            }`}
          >
            <Layers
              className={`h-6 w-6 ${isActive("/sectors") ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">Sectors</span>
          </Link>
          <Link
            href="/heatmap"
            className={`text-gray-700 dark:text-gray-300 flex flex-col items-center cursor-pointer ${
              isActive("/heatmap") ? "bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1" : ""
            }`}
          >
            <LayoutGrid
              className={`h-6 w-6 ${isActive("/heatmap") ? "text-orange-500" : "text-gray-700 dark:text-gray-300"}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">Heatmap</span>
          </Link>
          <Link
            href="/screener"
            className={`text-gray-700 dark:text-gray-300 flex flex-col items-center cursor-pointer ${
              isActive("/screener") ? "bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1" : ""
            }`}
          >
            <Sliders
              className={`h-6 w-6 ${isActive("/screener") ? "text-green-500" : "text-gray-700 dark:text-gray-300"}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">Screener</span>
          </Link>
          <Link
            href="/news"
            className={`text-gray-700 dark:text-gray-300 flex flex-col items-center ${
              isActive("/news") ? "bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1" : ""
            }`}
          >
            <Newspaper 
              className={`h-6 w-6 ${isActive("/news") ? "text-blue-700" : "text-gray-700 dark:text-gray-300"}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">News</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar

