// app/api/stocks/route.ts
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec',
      {
        next: {
          revalidate: 60 // Cache the response for 60 seconds
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`)
    }

    const data = await response.json()
    return Response.json(data.data)
  } catch (error) {
    console.error('API Route Error:', error)
    return Response.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}