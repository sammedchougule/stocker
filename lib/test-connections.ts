"use server"

import { createServerClient } from "@/lib/supabase"

export async function testSupabaseConnection() {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      return {
        success: false,
        message: "Failed to initialize Supabase client.",
      }
    }

    // Test the connection by making a simple query
    const { data, error } = await supabase.from("journal").select("count()", { count: "exact" }).limit(1)

    if (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error,
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase!",
      count: data[0]?.count || 0,
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      error,
    }
  }
}
