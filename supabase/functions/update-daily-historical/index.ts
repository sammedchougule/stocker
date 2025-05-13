// supabase/functions/update-daily-historical/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const GOOGLE_SHEET_URL = Deno.env.get('GOOGLE_SHEET_URL')!

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  try {
    const res = await fetch(GOOGLE_SHEET_URL)
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)

    const data = await res.json()

    console.log("Starting function...")
    console.log("Using SHEET_URL:", GOOGLE_SHEET_URL)

    for (const row of data) {
      const {
        symbol,
        date,
        closeyest,
        priceopen,
        price,
        low,
        high,
        change,
        changepct,
        tradetime,
        volume,
        volumeavg,
        volumespike,
        todayHLCross,
        monthHigh,
        monthLow,
        monthHLCross,
        highYear,
        lowYear,
        yearHLCross,
        marketcap,
        eps,
        pe,
        nearYearHigh,
        nearYearLow
      } = row

      const { error: dailyError } = await supabase.from('dailydata').upsert({
        symbol,
        date,
        closeyest,
        priceopen,
        price,
        low,
        high,
        change,
        changepct,
        tradetime,
        volume,
        volumeavg,
        volumespike,
        todayHLCross,
        monthHigh,
        monthLow,
        monthHLCross,
        highYear,
        lowYear,
        yearHLCross,
        marketcap,
        eps,
        pe,
        nearYearHigh,
        nearYearLow
      })

      if (dailyError) console.error("Dailydata error:", dailyError)

      const { error: histError } = await supabase.from('historical').upsert({
        symbol,
        date,
        open: priceopen,
        high,
        low,
        close: price,
        volume,
        volumeavg
      }, { onConflict: 'symbol,date' })

      if (histError) console.error("Historical error:", histError)
    }

    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 })
  } catch (error) {
    console.error("Function failed:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
