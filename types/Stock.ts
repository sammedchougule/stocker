export interface Indices {
    "Nifty 50": boolean;
    "Nifty FnO": boolean;
    "Nifty Auto": boolean;
    "Nifty Bank": boolean;
    "Nifty Financial Services": boolean;
    "Nifty FMCG": boolean;
    "Nifty Healthcare": boolean;
    "Nifty IT": boolean;
    "Nifty Media": boolean;
    "Nifty Metal": boolean;
    "Nifty Pharma": boolean;
    "Nifty PVT Bank": boolean;
    "Nifty PSU Bank": boolean;
    "Nifty Realty": boolean;
  }
  
  export interface Stock {
    symbol: string;
    companyname: string;
    industry: string | null;
    sector: string | null;
    viewchart: string | null;
    indices: Indices | null;
    type: string | null;
    exchange: string | null;
    currency: string | null;
    closeyest: number;
    priceopen: number;
    price: number;
    low: number;
    high: number;
    change: number;
    changepct: number;
    tradetime: string | null;
    volume: number | null;
    volumeavg: number | null;
    volumespike: number | null;
    month_high: number;
    month_low: number;
    high52: number;
    low52: number;
    marketcap: number | null;
    eps: number | null;
    pe: number | null;
    shares: number | null;
    closings: { [date: string]: number };
  }
  
  export interface StockData {
    data: Stock[];
  }
  

export type SortOption = 'changepct_desc' | 'changepct_asc' | 'volumespike_desc' | 'volumespike_asc'; 