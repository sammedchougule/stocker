import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Stock } from '@/types/Stock'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycb.../exec')
    const json = await res.json()

    if (!json?.data || !Array.isArray(json.data)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const stocks: Stock[] = json.data

    for (const stock of stocks) {
      const {
        symbol,
        companyname,
        industry,
        sector,
        type,
        exchange,
        currency,
        indices,
        shares,

        // daily data
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
        nearYearLow,
      } = stock

      // 1. Upsert to `stocks` table
      await supabase.from('stocks').upsert(
        {
          symbol,
          companyname,
          industry,
          sector,
          type,
          exchange,
          currency,
          indices,
          shares,
        },
        { onConflict: 'symbol' }
      )

      // 2. Upsert to `dailydata` table
      await supabase.from('dailydata').upsert(
        {
          symbol,
          date: tradetime,
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
          nearYearLow,
        },
        { onConflict: 'symbol,date' }
      )

      // 3. Upsert to `historical` table
      await supabase.from('historical').upsert(
        {
          symbol,
          date: tradetime,
          open: priceopen,
          close: price,
          high,
          low,
          volume,
          volumeavg,
        },
        { onConflict: 'symbol,date' }
      )
    }

    return NextResponse.json({ status: 'success', count: stocks.length })
  } catch (err) {
    console.error('Error ingesting stock data:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
