export interface Position {
  symbol: string;
  entryPrice: number;
  entryTimestamp: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
}

export interface Trade {
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  entryTimestamp: number;
  exitTimestamp: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
}

export interface Portfolio {
  cash: number;
  positions: Position[];
  trades: Trade[];
  equity: number;
}

export interface PortfolioMetrics {
  totalPnl: number;
  pnlPercent: number;
  openPositions: number;
  totalTrades: number;
  averageReturn: number;
  maxDrawdown: number;
}