import { NextResponse } from "next/server"

export const revalidate = 300 // Revalidate every 5 minutes (300 seconds)

export async function GET() {
  try {
    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec",
      {
        signal: controller.signal,
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      },
    )

    clearTimeout(timeoutId) // Clear the timeout if the request completes

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Return the data with cache control headers
    return NextResponse.json(data.data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Error fetching stock data:", error)

    // Return an empty array with a 500 status code
    return NextResponse.json([], {
      status: 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  }
}

