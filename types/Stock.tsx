export interface Indices {
  Nifty50: boolean;
  "NiftyF&O": boolean;
  NiftyAuto: boolean;
  NiftyBank: boolean;
  NiftyConsumerDurables: boolean;
  NiftyFinancialServices: boolean;
  NiftyFmcg: boolean;
  NiftyHealthcare: boolean;
  NiftyIt: boolean;
  NiftyMedia: boolean;
  NiftyMetal: boolean;
  NiftyMidSmallHealthcare: boolean;
  NiftyOilGas: boolean;
  NiftyPharma: boolean;
  NiftyPrivateBank: boolean;
  NiftyPsuBank: boolean;
  NiftyRealty: boolean;
  "NiftyFinancialServices25/50": boolean;
}

export interface Stock {
  symbol: string;
  companyname: string;
  industry: string | null;
  sector: string | null;
  view_chart: string | null;
  indices: Indices | null;
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
}

export interface StockData {
  data: Stock[];
}

