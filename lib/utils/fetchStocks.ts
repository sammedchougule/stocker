export interface Stock {
  symbol: string
  companyname: string
  industry: string
  sector: string
  indices: {
    [key: string]: boolean
  }
  viewchart: string
  type: string
  exchange: string
  currency: string
  closeyest: string
  priceopen: string
  price: string
  low: string
  high: string
  change: string
  changepct: string
  tradetime: string
  volume: string
  volumeavg: string
  volumespike: string
  todayHLCross: string
  monthHigh: string
  monthLow: string
  monthHLCross: string
  highYear: string
  lowYear: string
  yearHLCross: string
  marketcap: string
  eps: string
  pe: string
  shares: string
  nearYearHigh: string
  nearYearLow: string
}

export async function fetchStocks(): Promise<Stock[]> {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec",
      {
        method: "GET",
        cache: "no-store", // Don't use browser cache
        next: { revalidate: 300 }, // Revalidate every 5 minutes (300 seconds)
        redirect: "follow", // Explicitly follow redirects
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0", // Some servers require a user agent
        },
      },
    )

    // For Google Scripts, sometimes we need to handle redirects manually
    if (response.status === 302) {
      const redirectUrl = response.headers.get("Location")
      if (redirectUrl) {
        const redirectResponse = await fetch(redirectUrl, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
        })

        if (!redirectResponse.ok) {
          console.error(`Failed to fetch from redirect: ${redirectResponse.status}`)
          return getFallbackData()
        }

        // Check if the response is JSON before parsing
        const contentType = redirectResponse.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await redirectResponse.json()
            const stocks = Array.isArray(data) ? data : data.data || []
            return stocks.length > 0 ? stocks : getFallbackData()
          } catch (error) {
            console.error("Error parsing JSON from redirect:", error)
            const text = await redirectResponse.text()
            console.error("Response text:", text.substring(0, 200) + "...") // Log first 200 chars
            return getFallbackData()
          }
        } else {
          // Not JSON, handle as text
          const text = await redirectResponse.text()
          console.error("Non-JSON response:", text.substring(0, 200) + "...") // Log first 200 chars
          return getFallbackData()
        }
      }
    }

    if (!response.ok) {
      console.error(`Failed to fetch stock data: ${response.status}`)
      return getFallbackData()
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      try {
        const data = await response.json()
        const stocks = Array.isArray(data) ? data : data.data || []
        return stocks.length > 0 ? stocks : getFallbackData()
      } catch (error) {
        console.error("Error parsing JSON:", error)
        const text = await response.text()
        console.error("Response text:", text.substring(0, 200) + "...") // Log first 200 chars
        return getFallbackData()
      }
    } else {
      // Not JSON, handle as text
      const text = await response.text()
      console.error("Non-JSON response:", text.substring(0, 200) + "...") // Log first 200 chars
      return getFallbackData()
    }
  } catch (error) {
    console.error("Error fetching stocks:", error)
    return getFallbackData()
  }
}

// Fallback data function to provide sample data when the API fails
function getFallbackData(): Stock[] {
  // Return a small set of sample stock data
  return [
    {
      symbol: "NIFTY_50",
      companyname: "Nifty 50",
      industry: "Index",
      sector: "Index",
      indices: { "Nifty 50": true },
      viewchart: "",
      type: "INDEX",
      exchange: "NSE",
      currency: "INR",
      closeyest: "22500.00",
      priceopen: "22550.00",
      price: "22600.00",
      low: "22480.00",
      high: "22650.00",
      change: "100.00",
      changepct: "0.44",
      tradetime: "15:30",
      volume: "0",
      volumeavg: "0",
      volumespike: "0",
      todayHLCross: "...",
      monthHigh: "22800.00",
      monthLow: "22000.00",
      monthHLCross: "...",
      highYear: "23000.00",
      lowYear: "21500.00",
      yearHLCross: "...",
      marketcap: "0",
      eps: "0",
      pe: "0",
      shares: "0",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
    {
      symbol: "RELIANCE",
      companyname: "Reliance Industries Ltd",
      industry: "Oil & Gas",
      sector: "Energy",
      indices: { "Nifty 50": true, "Nifty Energy": true },
      viewchart: "",
      type: "EQ",
      exchange: "NSE",
      currency: "INR",
      closeyest: "2950.00",
      priceopen: "2955.00",
      price: "2980.00",
      low: "2945.00",
      high: "2990.00",
      change: "30.00",
      changepct: "1.02",
      tradetime: "15:30",
      volume: "5000000",
      volumeavg: "4500000",
      volumespike: "1.11",
      todayHLCross: "...",
      monthHigh: "3100.00",
      monthLow: "2800.00",
      monthHLCross: "...",
      highYear: "3200.00",
      lowYear: "2700.00",
      yearHLCross: "...",
      marketcap: "2000000000000",
      eps: "75.00",
      pe: "39.73",
      shares: "6000000000",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
    {
      symbol: "TCS",
      companyname: "Tata Consultancy Services Ltd",
      industry: "IT Services",
      sector: "Technology",
      indices: { "Nifty 50": true, "Nifty IT": true },
      viewchart: "",
      type: "EQ",
      exchange: "NSE",
      currency: "INR",
      closeyest: "3800.00",
      priceopen: "3810.00",
      price: "3750.00",
      low: "3740.00",
      high: "3820.00",
      change: "-50.00",
      changepct: "-1.32",
      tradetime: "15:30",
      volume: "2000000",
      volumeavg: "1800000",
      volumespike: "1.11",
      todayHLCross: "...",
      monthHigh: "3900.00",
      monthLow: "3600.00",
      monthHLCross: "...",
      highYear: "4000.00",
      lowYear: "3500.00",
      yearHLCross: "...",
      marketcap: "1400000000000",
      eps: "120.00",
      pe: "31.25",
      shares: "3700000000",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
    {
      symbol: "HDFCBANK",
      companyname: "HDFC Bank Ltd",
      industry: "Banking",
      sector: "Financial Services",
      indices: { "Nifty 50": true, "Nifty Bank": true, "Nifty Financial Services": true },
      viewchart: "",
      type: "EQ",
      exchange: "NSE",
      currency: "INR",
      closeyest: "1650.00",
      priceopen: "1655.00",
      price: "1670.00",
      low: "1645.00",
      high: "1675.00",
      change: "20.00",
      changepct: "1.21",
      tradetime: "15:30",
      volume: "3000000",
      volumeavg: "2800000",
      volumespike: "1.07",
      todayHLCross: "...",
      monthHigh: "1700.00",
      monthLow: "1600.00",
      monthHLCross: "...",
      highYear: "1750.00",
      lowYear: "1550.00",
      yearHLCross: "...",
      marketcap: "1200000000000",
      eps: "80.00",
      pe: "20.88",
      shares: "5500000000",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
    {
      symbol: "INFY",
      companyname: "Infosys Ltd",
      industry: "IT Services",
      sector: "Technology",
      indices: { "Nifty 50": true, "Nifty IT": true },
      viewchart: "",
      type: "EQ",
      exchange: "NSE",
      currency: "INR",
      closeyest: "1450.00",
      priceopen: "1455.00",
      price: "1430.00",
      low: "1425.00",
      high: "1460.00",
      change: "-20.00",
      changepct: "-1.38",
      tradetime: "15:30",
      volume: "2500000",
      volumeavg: "2200000",
      volumespike: "1.14",
      todayHLCross: "...",
      monthHigh: "1500.00",
      monthLow: "1400.00",
      monthHLCross: "...",
      highYear: "1550.00",
      lowYear: "1350.00",
      yearHLCross: "...",
      marketcap: "600000000000",
      eps: "65.00",
      pe: "22.00",
      shares: "4200000000",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
    {
      symbol: "BHARTIARTL",
      companyname: "Bharti Airtel Ltd",
      industry: "Telecommunications",
      sector: "Communication Services",
      indices: { "Nifty 50": true },
      viewchart: "",
      type: "EQ",
      exchange: "NSE",
      currency: "INR",
      closeyest: "1200.00",
      priceopen: "1205.00",
      price: "1220.00",
      low: "1195.00",
      high: "1225.00",
      change: "20.00",
      changepct: "1.67",
      tradetime: "15:30",
      volume: "1800000",
      volumeavg: "1600000",
      volumespike: "1.13",
      todayHLCross: "...",
      monthHigh: "1250.00",
      monthLow: "1150.00",
      monthHLCross: "...",
      highYear: "1300.00",
      lowYear: "1100.00",
      yearHLCross: "...",
      marketcap: "700000000000",
      eps: "40.00",
      pe: "30.50",
      shares: "5800000000",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
    {
      symbol: "NIFTY_BANK",
      companyname: "Nifty Bank",
      industry: "Index",
      sector: "Index",
      indices: { "Nifty Bank": true },
      viewchart: "",
      type: "INDEX",
      exchange: "NSE",
      currency: "INR",
      closeyest: "48500.00",
      priceopen: "48550.00",
      price: "48700.00",
      low: "48450.00",
      high: "48800.00",
      change: "200.00",
      changepct: "0.41",
      tradetime: "15:30",
      volume: "0",
      volumeavg: "0",
      volumespike: "0",
      todayHLCross: "...",
      monthHigh: "49000.00",
      monthLow: "47500.00",
      monthHLCross: "...",
      highYear: "49500.00",
      lowYear: "47000.00",
      yearHLCross: "...",
      marketcap: "0",
      eps: "0",
      pe: "0",
      shares: "0",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
    {
      symbol: "NIFTY_IT",
      companyname: "Nifty IT",
      industry: "Index",
      sector: "Index",
      indices: { "Nifty IT": true },
      viewchart: "",
      type: "INDEX",
      exchange: "NSE",
      currency: "INR",
      closeyest: "32500.00",
      priceopen: "32550.00",
      price: "32400.00",
      low: "32350.00",
      high: "32600.00",
      change: "-100.00",
      changepct: "-0.31",
      tradetime: "15:30",
      volume: "0",
      volumeavg: "0",
      volumespike: "0",
      todayHLCross: "...",
      monthHigh: "33000.00",
      monthLow: "32000.00",
      monthHLCross: "...",
      highYear: "33500.00",
      lowYear: "31500.00",
      yearHLCross: "...",
      marketcap: "0",
      eps: "0",
      pe: "0",
      shares: "0",
      nearYearHigh: "0",
      nearYearLow: "0",
    },
  ]
}
