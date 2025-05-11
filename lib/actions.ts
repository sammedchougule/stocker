"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Define a type for updating trades (all fields optional except id)
interface TradeUpdate {
  id: number;
  date?: string;
  symbol?: string;
  type?: string;
  trade_type?: string;
  entry_price?: number;
  exit_price?: number;
  quantity?: number;
  profit_loss?: number;
  note?: string;
  strategy?: string;
  stop_loss?: number | null;
  expiry?: string | null;
}

export async function addTrade(formData: FormData) {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      throw new Error("Failed to initialize Supabase client")
    }

    // Calculate profit/loss
    const entryPrice = Number.parseFloat(formData.get("entry") as string)
    const exitPrice = Number.parseFloat(formData.get("exit") as string)
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const type = formData.get("trade") as string

    // For long trades: (exit - entry) * quantity
    // For short trades: (entry - exit) * quantity
    const profitLoss = type === "Long" ? (exitPrice - entryPrice) * quantity : (entryPrice - exitPrice) * quantity

    const { data, error } = await supabase
      .from("journal")
      .insert({
        date: formData.get("date") as string,
        symbol: formData.get("ticker") as string,
        type: type,
        trade_type: formData.get("type") as string,
        entry_price: entryPrice,
        exit_price: exitPrice,
        quantity: quantity,
        profit_loss: profitLoss,
        note: formData.get("note") as string,
        strategy: formData.get("strategy") as string,
        stop_loss: Number.parseFloat(formData.get("stopLoss") as string) || null,
        expiry: (formData.get("expiry") as string) || null,
      })
      .select()

    if (error) {
      console.error("Error adding trade:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the dashboard page to show the new trade
    revalidatePath("/")

    return { success: true, data }
  } catch (error) {
    console.error("Error in addTrade:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function updateTrade(trade: TradeUpdate) {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      throw new Error("Failed to initialize Supabase client")
    }

    // Extract the id and remove it from the update data
    const { id, ...updateData } = trade

    // Clean and prepare the data for update
    const cleanedData: Record<string, unknown> = {}

    // Process each field to ensure proper formatting
    Object.entries(updateData).forEach(([key, value]) => {
      // Skip undefined or null values
      if (value === undefined || value === null || value === "") {
        return
      }

      // Handle numeric fields
      if (["entry_price", "exit_price", "quantity", "profit_loss", "stop_loss"].includes(key)) {
        cleanedData[key] = typeof value === "string" ? Number.parseFloat(value) : value
      }
      // Handle date fields - ensure they're in the correct format
      else if (["date", "expiry"].includes(key)) {
        // If it's a valid date string, use it as is
        if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          cleanedData[key] = value
        }
        // Otherwise, skip it
        else if (typeof value === "string" && value.trim() !== "") {
          cleanedData[key] = value
        }
      }
      // Handle other fields
      else {
        cleanedData[key] = value
      }
    })

    // Perform the update
    const { error } = await supabase.from("journal").update(cleanedData).eq("id", id)

    if (error) {
      console.error("Error updating trade:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the dashboard page to reflect the changes
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error in updateTrade:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function fetchTrades() {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      console.error("Failed to initialize Supabase client")
      return []
    }

    const { data, error } = await supabase.from("journal").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching trades:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchTrades:", error)
    return []
  }
}

export async function deleteTrade(id: number) {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      throw new Error("Failed to initialize Supabase client")
    }

    const { error } = await supabase.from("journal").delete().eq("id", id)

    if (error) {
      console.error("Error deleting trade:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the dashboard page to reflect the deletion
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteTrade:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
