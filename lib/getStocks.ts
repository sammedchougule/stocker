import type { Stock } from "@/types/Stock"

export async function getStocks(): Promise<Stock[]> {
  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec",
      { next: { revalidate: 300 } }, // Revalidate every 5 minutes (300 seconds)
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch stocks: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format")
    }

    return data.data
  } catch (error) {
    //console.error("Error fetching stocks:", error)
    return [] // Return an empty array to prevent crashes
  }
}
