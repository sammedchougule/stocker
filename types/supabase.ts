export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      journal: {
        Row: {
          id: number
          date: string
          symbol: string
          type: string
          trade_type: string
          entry_price: number
          exit_price: number | null
          quantity: number
          profit_loss: number | null
          note: string | null
          expiry: string | null
          strategy: string | null
          stop_loss: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          symbol: string
          type: string
          trade_type: string
          entry_price: number
          exit_price?: number | null
          quantity: number
          profit_loss?: number | null
          note?: string | null
          expiry?: string | null
          strategy?: string | null
          stop_loss?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          symbol?: string
          type?: string
          trade_type?: string
          entry_price?: number
          exit_price?: number | null
          quantity?: number
          profit_loss?: number | null
          note?: string | null
          expiry?: string | null
          strategy?: string | null
          stop_loss?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      dailydata: {
        Row: {
          symbol: string
          date: string
          price: number
          priceopen: number
          high: number
          low: number
          change: number
          changepct: number
          volume: number
          volumeavg: number
          tradetime: string
          // Other fields omitted for brevity
        }
        Insert: {
          symbol: string
          date: string
          price: number
          priceopen: number
          high: number
          low: number
          change: number
          changepct: number
          volume: number
          volumeavg: number
          tradetime: string
        }
        Update: {
          symbol?: string
          date?: string
          price?: number
          priceopen?: number
          high?: number
          low?: number
          change?: number
          changepct?: number
          volume?: number
          volumeavg?: number
          tradetime?: string
        }
      }
      stocks: {
        Row: {
          symbol: string
          companyname: string
          sector: string
          industry: string
          exchange: string
          // Other fields omitted for brevity
        }
        Insert: {
          symbol: string
          companyname: string
          sector?: string
          industry?: string
          exchange?: string
        }
        Update: {
          symbol?: string
          companyname?: string
          sector?: string
          industry?: string
          exchange?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

type Trade = Database["public"]["Tables"]["journal"]["Row"]
