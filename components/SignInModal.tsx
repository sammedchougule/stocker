"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Check your email for the login link!")
    }

    setLoading(false)
  }

  const handleClose = () => {
    onClose()
    setEmail("") // Clear email input on close
    setMessage(null) // Clear any messages on close
    router.push("/") // Redirect to home page after closing modal
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white/80 backdrop-blur-md border border-gray-200 max-w-md rounded-lg shadow-lg w-[calc(100%-32px)] sm:w-full mx-auto">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-lg font-semibold">Sign In</DialogTitle>
          <DialogDescription>Sign in using your email address</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center">
            <Input
              id="email"
              type="email"
              placeholder="Enter Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-4 bg-gray-100 rounded-md border border-input bg-background px-3 py-2 text-md text-gray-800"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gray-700 text-white text-md">
            {loading ? "Loading" : "Send Link"}
          </Button>
        </form>
        {message && <p className="text-center text-sm text-gray-500">{message}</p>}
      </DialogContent>
    </Dialog>
  )
}

