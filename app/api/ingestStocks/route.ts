import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Stock } from '@/types/Stock'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbzK8oDQse4ERT_jddWwlK9iTLz3TNhiVAyb0Jp5L4U3q-XOyplps-HLNY0uLcNiNn0ERg/exec')
    const json = await res.json()

    if (!json?.data || !Array.isArray(json.data)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const stocks: Stock[] = json.data

    const stocksInsert = stocks.map(stock => ({
      symbol: stock.symbol,
      companyname: stock.companyname,
      industry: stock.industry,
      sector: stock.sector,
      type: stock.type,
      exchange: stock.exchange,
      currency: stock.currency,
      indices: stock.indices,
      shares: stock.shares,
    }))

    const dailyDataInsert = stocks.map(stock => ({
      symbol: stock.symbol,
      date: stock.tradetime,
      closeyest: stock.closeyest,
      priceopen: stock.priceopen,
      price: stock.price,
      low: stock.low,
      high: stock.high,
      change: stock.change,
      changepct: stock.changepct,
      tradetime: stock.tradetime,
      volume: stock.volume,
      volumeavg: stock.volumeavg,
      volumespike: stock.volumespike,
      todayHLCross: stock.todayHLCross,
      monthHigh: stock.monthHigh,
      monthLow: stock.monthLow,
      monthHLCross: stock.monthHLCross,
      highYear: stock.highYear,
      lowYear: stock.lowYear,
      yearHLCross: stock.yearHLCross,
      marketcap: stock.marketcap,
      eps: stock.eps,
      pe: stock.pe,
      nearYearHigh: stock.nearYearHigh,
      nearYearLow: stock.nearYearLow,
    }))

    const historicalInsert = stocks.map(stock => ({
      symbol: stock.symbol,
      date: stock.tradetime,
      open: stock.priceopen,
      close: stock.price,
      high: stock.high,
      low: stock.low,
      volume: stock.volume,
      volumeavg: stock.volumeavg,
    }))

    const [stocksRes, dailyRes, histRes] = await Promise.all([
      supabase.from('stocks').upsert(stocksInsert, { onConflict: 'symbol' }),
      supabase.from('dailydata').upsert(dailyDataInsert, { onConflict: 'symbol,date' }),
      supabase.from('historical').upsert(historicalInsert, { onConflict: 'symbol,date' }),
    ])

    if (stocksRes.error || dailyRes.error || histRes.error) {
      console.error('Supabase error:', stocksRes.error || dailyRes.error || histRes.error)
      return NextResponse.json({ error: 'Supabase insert error' }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', count: stocks.length })
  } catch (err) {
    console.error('Error ingesting stock data:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
