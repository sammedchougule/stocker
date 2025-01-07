export interface Stock {
  symbol: string;
  companyname: string;
  type: string;
  exchange: string;
  price: number;
  change: number;
  changepct: number;
  high: number;
  low: number;
  high52: number;
  low52: number;
  marketcap: number;
  pe: number | null;
  industry: string;
  sector: string;
  volumespike?: number;
  closings: { [date: string]: number };
  indices?: { [key: string]: boolean };
}

export type SortOption = 'changepct_desc' | 'changepct_asc' | 'volumespike_desc' | 'volumespike_asc'; 