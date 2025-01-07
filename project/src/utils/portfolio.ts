import { Position, Trade, Portfolio, PortfolioMetrics } from '../types/portfolio';
import { OHLCV } from '../types/trading';

const RISK_PER_TRADE = 0.02; // 2% risk per trade
const INITIAL_CAPITAL = 100000;

export class PortfolioManager {
  private portfolio: Portfolio;

  constructor() {
    this.portfolio = {
      cash: INITIAL_CAPITAL,
      positions: [],
      trades: [],
      equity: INITIAL_CAPITAL
    };
  }

  private calculatePositionSize(price: number, stopLoss: number): number {
    const riskAmount = this.portfolio.equity * RISK_PER_TRADE;
    const riskPerShare = Math.abs(price - stopLoss);
    return Math.floor(riskAmount / riskPerShare);
  }

  public openPosition(
    symbol: string,
    price: number,
    timestamp: number,
    stopLoss: number,
    takeProfit: number
  ): boolean {
    if (this.hasOpenPosition(symbol)) return false;

    const quantity = this.calculatePositionSize(price, stopLoss);
    const cost = quantity * price;

    if (cost > this.portfolio.cash) return false;

    const position: Position = {
      symbol,
      entryPrice: price,
      entryTimestamp: timestamp,
      quantity,
      stopLoss,
      takeProfit
    };

    this.portfolio.positions.push(position);
    this.portfolio.cash -= cost;
    this.updateEquity();

    return true;
  }

  public closePosition(symbol: string, price: number, timestamp: number): boolean {
    const positionIndex = this.portfolio.positions.findIndex(p => p.symbol === symbol);
    if (positionIndex === -1) return false;

    const position = this.portfolio.positions[positionIndex];
    const value = position.quantity * price;
    const pnl = value - (position.quantity * position.entryPrice);
    const pnlPercent = (price - position.entryPrice) / position.entryPrice;

    const trade: Trade = {
      symbol,
      entryPrice: position.entryPrice,
      exitPrice: price,
      entryTimestamp: position.entryTimestamp,
      exitTimestamp: timestamp,
      quantity: position.quantity,
      pnl,
      pnlPercent
    };

    this.portfolio.trades.push(trade);
    this.portfolio.positions.splice(positionIndex, 1);
    this.portfolio.cash += value;
    this.updateEquity();

    return true;
  }

  private updateEquity(): void {
    const positionsValue = this.portfolio.positions.reduce(
      (total, pos) => total + (pos.quantity * pos.entryPrice),
      0
    );
    this.portfolio.equity = this.portfolio.cash + positionsValue;
  }

  public hasOpenPosition(symbol: string): boolean {
    return this.portfolio.positions.some(p => p.symbol === symbol);
  }

  public getPortfolio(): Portfolio {
    return { ...this.portfolio };
  }

  public getMetrics(): PortfolioMetrics {
    const trades = this.portfolio.trades;
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const returns = trades.map(t => t.pnlPercent);
    
    let maxDrawdown = 0;
    let peak = INITIAL_CAPITAL;
    let equity = INITIAL_CAPITAL;
    
    trades.forEach(trade => {
      equity += trade.pnl;
      peak = Math.max(peak, equity);
      const drawdown = (peak - equity) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    return {
      totalPnl,
      pnlPercent: totalPnl / INITIAL_CAPITAL,
      openPositions: this.portfolio.positions.length,
      totalTrades: trades.length,
      averageReturn: trades.length > 0 ? returns.reduce((a, b) => a + b, 0) / trades.length : 0,
      maxDrawdown
    };
  }
}