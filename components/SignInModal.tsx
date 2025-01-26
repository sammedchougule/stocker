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
        {message && <p className="mt-4 text-center text-sm text-gray-500">{message}</p>}
      </DialogContent>
    </Dialog>
  )
}






// import { useState } from "react"
// import { Dialog } from "@headlessui/react"
// import { supabase } from "@/lib/supabase"
// import { usePathname } from "next/navigation"

// interface SignInModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
//   const [email, setEmail] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   // const router = useRouter()
//   const pathname = usePathname()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const { error } = await supabase.auth.signInWithOtp({
//         email,
//         options: {
//           emailRedirectTo: `${window.location.origin}${pathname}`,
//         },
//       })

//       if (error) throw error

//       setSuccess(true)
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message)
//       } else {
//         setError(String(error))
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//   <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />
//   <div className="fixed inset-0 flex items-center justify-center p-4">
//     <Dialog.Panel className="w-[calc(100%-32px)] sm:w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg mx-auto p-6">
//       <Dialog.Title className="text-lg font-semibold mb-2">Sign In</Dialog.Title>
//       <p className="text-sm text-gray-500 mb-4">Sign in using your email address</p>
//       {!success ? (
//         <form onSubmit={handleSubmit} className="grid gap-4">
//           <div className="grid grid-cols-4 items-center">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="col-span-4 bg-gray-100 rounded-md border border-input bg-background px-3 py-2 text-md text-gray-800"
//               required
//             />
//           </div>
//           {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-gray-700 text-white text-md p-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
//           >
//             {isLoading ? "Sending..." : "Send Link"}
//           </button>
//         </form>
//       ) : (
//         <p className="text-green-500 text-center text-sm">Check Your Email For The Link!</p>
//       )}
//     </Dialog.Panel>
//   </div>
// </Dialog>

//   )
// }

// export default SignInModal

