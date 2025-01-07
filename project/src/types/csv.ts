export interface CSVData {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  'Volume': number;
  '% Change': number;
  '% Change vs Average': number;
}

export interface ImportedCompanyData {
  symbol: string;
  data: CSVData[];
}