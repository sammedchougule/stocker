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
        .select("id, username, password")  // Fetch username and password from the admin table
        .eq("username", username)  // Check for the provided username
        .single()  // Only expect a single record

      if (error || !data) {
        throw new Error("Invalid username or password")
      }

      // Now, verify the password using the `verify_password` function
      const { data: passwordMatch, error: passwordError } = await supabase.rpc(
        "verify_password",  // Call the verify_password function
        {
          hashed: data.password,  // Pass the hashed password from the database
          plain: password,        // Pass the plain password entered by the user
        }
      )

      if (passwordError || !passwordMatch) {
        throw new Error("Invalid username or password")
      }

      // If password matches, set session and redirect to the admin page
      await supabase.auth.setSession(data.id) // Set the session for the user
      router.push("/admin")  // Redirect to admin page after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)  // Stop loading state after operation completes
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
