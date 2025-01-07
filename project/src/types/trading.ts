// Add these new interfaces
export interface TradeReport {
  name: string;
  entryDateTime: string;
  entryPrice: number;
  exitDateTime: string;
  exitPrice: number;
  quantity: number;
  profitLoss: number;
}

export interface DataSet {
  name: string;
  data: OHLCV[];
}