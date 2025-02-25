import type React from "react"

interface PageLayoutProps {
  children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="pt-24 sm:pt-24">
      {/* This div adds top padding to create space for the fixed navbar and marquee */}
      {children}
    </div>
  )
}

export default PageLayout