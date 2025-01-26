"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const redirectTo = localStorage.getItem("redirectTo") || "/"
        localStorage.removeItem("redirectTo")
        router.push(redirectTo)
      }
    })
  }, [router])

  return null
}

