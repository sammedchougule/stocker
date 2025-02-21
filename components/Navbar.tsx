"use client"

import Link from "next/link"
import { Menu, X, Home, SquareActivity, Layers, Sliders, LayoutGrid, Newspaper } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { StockInput } from "./Input"
import { supabase } from "@/lib/supabase"
import SignInModal from "./SignInModal"
import type { User } from "@/types/user"

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const isActive = (path: string) => pathname === path

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

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

  // SignOut logic
  // const handleSignOut = async () => {
  //   await supabase.auth.signOut()
  //   setUser(null) // Immediately set user to null after signout
  // }

  // const handleLinkClick = (path: string) => {
  //   if (!user) {
  //     setIsSignInModalOpen(true)
  //   } else {
  //     router.push(path) // Use next/navigation's router
  //   }
  // }

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-8 left-0 right-0 z-50 border-b border-gray-200 backdrop-blur-md bg-white/10 md:p-1 lg:p-1">
        <div className="container mx-auto px-4 flex justify-between items-center py-1">
          {/* Website Name and Eye Animation */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-black flex items-center">
              Stocker
            </Link>
          </div>

          {/* Search Input for Tablet and Desktop */}
          <div className="hidden md:flex justify-center flex-grow max-w-lg px-4 relative z-10">
            <StockInput />
          </div>

          {/* Links for Desktop */}

          <div className="hidden lg:flex space-x-6">
            <Link
              href="/intrabuzz"
              className="text-black hover:text-gray-600 flex items-center"
              // onClick={() => handleLinkClick("/intrabuzz")}
            >
              IntraBuzz
            </Link>

            <Link
              href="/sectors"
              className="text-black hover:text-gray-600 flex items-center"
              // onClick={() => handleLinkClick("/sectors")}
            >
              Sectors
            </Link>
            <Link
              href="/heatmap"
              className="text-black hover:text-gray-600 flex items-center"
              // onClick={() => handleLinkClick("/heatmap")}
            >
              Heatmap
            </Link>
            <Link
              href="/screener"
              className="text-black hover:text-gray-600 flex items-center"
              // onClick={() => handleLinkClick("/screener")}
            >
              Screener
            </Link>
            <Link
              href="/news"
              className="text-black hover:text-gray-600 flex items-center"
              // onClick={() => handleLinkClick("/news")}
            >
              News
            </Link>
            {/* {user ? (
              <button onClick={handleSignOut} className="text-black hover:text-gray-600 flex items-center">
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="text-black hover:text-gray-600 flex items-center"
              >
                Sign In
              </button>
            )} */}
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
        </div>

        {/* Search Input for Mobile */}
        <div className="md:hidden px-2 pt-0 py-1">
          <div className="relative mx-4">
            <StockInput />
          </div>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0  bg-opacity-100 z-40 hidden md:block lg:hidden" onClick={toggleMenu}></div>
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
              // onClick={() => handleLinkClick("/intrabuzz")}
            >
              <SquareActivity className="h-5 w-5 mr-3" />
              IntraBuzz
            </Link>

            <Link
              href="/sectors"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
              // onClick={() => handleLinkClick("/sectors")}
            >
              <Layers className="h-5 w-5 mr-3" />
              Sectors
            </Link>
            <Link
              href="/heatmap"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
              // onClick={() => handleLinkClick("/heatmap")}
            >
              <LayoutGrid className="h-5 w-5 mr-3" />
              Heatmap
            </Link>
            <Link
              href="/screener"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
              // onClick={() => handleLinkClick("/screener")}
            >
              <Sliders className="h-5 w-5 mr-3" />
              Screener
            </Link>
            <Link
              href="/news"
              className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
              // onClick={() => handleLinkClick("/news")}
            >
              <Newspaper className="h-5 w-5 mr-3" />
              News
            </Link>
            {/* {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="flex items-center py-2 text-gray-800 hover:bg-gray-200 rounded-md px-2 transition-colors duration-200"
              >
                Sign In
              </button>
            )} */}
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
          <div
            // onClick={() => handleLinkClick("/intrabuzz")}
            className={`text-gray-700 flex flex-col items-center cursor-pointer ${
              isActive("/intrabuzz") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <SquareActivity className={`h-6 w-6 ${isActive("/intrabuzz") ? "text-yellow-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">IntraBuzz</span>
          </div>
          <div
            // onClick={() => handleLinkClick("/sectors")}
            className={`text-gray-700 flex flex-col items-center cursor-pointer ${
              isActive("/sectors") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <Layers className={`h-6 w-6 ${isActive("/sectors") ? "text-yellow-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">Sectors</span>
          </div>
          <div
            // onClick={() => handleLinkClick("/heatmap")}
            className={`text-gray-700 flex flex-col items-center cursor-pointer ${
              isActive("/heatmap") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <LayoutGrid className={`h-6 w-6 ${isActive("/heatmap") ? "text-orange-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">Heatmap</span>
          </div>
          <div
            // onClick={() => handleLinkClick("/screener")}
            className={`text-gray-700 flex flex-col items-center cursor-pointer ${
              isActive("/screener") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <Sliders className={`h-6 w-6 ${isActive("/screener") ? "text-orange-500" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">Screener</span>
          </div>
          <Link
            href="/news"
            className={`text-gray-700 flex flex-col items-center ${
              isActive("/news") ? "bg-gray-200 rounded-md px-2 py-1" : ""
            }`}
          >
            <Newspaper className={`h-6 w-6 ${isActive("/news") ? "text-green-700" : "text-gray-700"}`} />
            <span className="text-xs text-gray-600">News</span>
          </Link>
        </div>
      </nav>
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  )
}

export default Navbar

