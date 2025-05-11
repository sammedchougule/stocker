export interface Trade {
  id: number
  date: string
  symbol: string
  type: string
  tradeType: string
  entryPrice: number
  exitPrice: number
  quantity: number
  profitLoss: number
  note: string
}

// Mock data to use as fallback when Supabase connection fails
export const mockTrades = []

export function getTotalProfitLoss(trades: Trade[]): number {
  return trades.reduce((total, trade) => total + (trade.profitLoss || 0), 0)
}

export function getWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0
  const winningTrades = trades.filter((trade) => (trade.profitLoss || 0) > 0)
  return winningTrades.length / trades.length
}
