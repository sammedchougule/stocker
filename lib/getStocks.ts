import type { Stock } from "@/types/Stock"

export async function getStocks(): Promise<Stock[]> {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec",
    { next: { revalidate: 300 } }, // Revalidate every 5 minutes (300 seconds)
  )

  if (!res.ok) {
    throw new Error("Failed to fetch stocks")
  }

  const data = await res.json()
  return data.data
}

