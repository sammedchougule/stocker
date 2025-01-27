// app/admin/login.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Query Supabase for the admin username and hashed password
      const { data, error } = await supabase
        .from("admin")
        .select("id, username, password")
        .eq("username", username)
        .single()

      if (error || !data) {
        throw new Error("Invalid username or password")
      }

      // Verify the password using the `verify_password` function in Supabase
      const { data: passwordMatch } = await supabase.rpc("verify_password", {
        hashed: data.password,
        plain: password,
      })

      if (!passwordMatch) {
        throw new Error("Invalid username or password")
      }

      // Store session and redirect to admin page
      await supabase.auth.setSession(data.id) // You can also store in cookies or localStorage if needed
      router.push("/admin") // Redirect to admin page after login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label htmlFor="username" className="block mb-1">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
