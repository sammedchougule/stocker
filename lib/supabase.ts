// import { createClient } from "@supabase/supabase-js"
// import type { Database } from "@/types/supabase"

// // Use environment variables
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sdpvkgckgmpoczvtylya.supabase.co"
// const supabaseAnonKey =
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcHZrZ2NrZ21wb2N6dnR5bHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjYyODIsImV4cCI6MjA2MDkwMjI4Mn0.oBi_o1x-hfStOJ6ubRpjfl-fuS5SQJ_OHaXpq9-DFwk"

// // For client components (browser)
// export const createBrowserClient = () => {
//   try {
//     return createClient<Database>(supabaseUrl, supabaseAnonKey, {
//       auth: {
//         persistSession: false, // Don't persist the session in localStorage
//       },
//     })
//   } catch (error) {
//     console.error("Error creating Supabase client:", error)
//     return null
//   }
// }

// // For server components
// export const createServerClient = () => {
//   try {
//     return createClient<Database>(supabaseUrl, supabaseAnonKey)
//   } catch (error) {
//     console.error("Error creating Supabase server client:", error)
//     return null
//   }
// }

// // Singleton pattern for client-side
// let browserClient: ReturnType<typeof createBrowserClient> | null = null

// export const getSupabaseBrowserClient = () => {
//   if (!browserClient) {
//     browserClient = createBrowserClient()
//   }
//   return browserClient
// }




import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.")
}

// For client-side (browser) use
const createBrowserClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// For server-side use (optional, if needed)
export const createServerClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton instance for browser
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Optional: export a default singleton for convenience
export const supabase = getSupabaseBrowserClient()
