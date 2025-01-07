import { OHLCV, Signal } from '../types/trading';
import { calculateRSI } from './indicators/rsi';
import { calculateSMA } from './indicators/moving-averages';
import { calculateBollingerBands } from './indicators/bollinger';
import { calculateATR } from './indicators/atr';
import { PortfolioManager } from './portfolio';
import { isTrendValid, isRSIValid, isPriceBreakout, shouldExitLongPosition } from './strategy/conditions';
import { calculateStopLoss, calculateTakeProfit } from './strategy/risk';

export { calculateMetrics } from './metrics';

export function generateSignals(data: OHLCV[]): Signal[] {
  const closes = data.map(d => d.close);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);
  const rsi = calculateRSI(closes);
  const atr = calculateATR(data);
  const bollingerBands = calculateBollingerBands(closes);

  const signals: Signal[] = [];
  const portfolio = new PortfolioManager();

  for (let i = 200; i < data.length; i++) {
    const currentPrice = data[i].close;
    const currentATR = atr[i];
    
    // Entry conditions
    if (!portfolio.hasOpenPosition('STOCK')) {
      const isValidTrend = isTrendValid(sma50[i], sma200[i]);
      const isValidRSI = isRSIValid(rsi[i]);
      const isValidBreakout = isPriceBreakout(currentPrice, bollingerBands, i);

      if (isValidTrend && isValidRSI && isValidBreakout) {
        const stopLoss = calculateStopLoss(currentPrice, currentATR);
        const takeProfit = calculateTakeProfit(currentPrice, currentATR);

        if (portfolio.openPosition('STOCK', currentPrice, data[i].timestamp, stopLoss, takeProfit)) {
          signals.push({
            timestamp: data[i].timestamp,
            type: 'ENTRY',
            price: currentPrice,
            reason: 'Long entry: Uptrend with BB breakout and RSI confirmation'
          });
        }
      }
    }
    // Exit conditions
    else {
      const position = portfolio.getPortfolio().positions[0];
      const { shouldExit, reason } = shouldExitLongPosition(
        currentPrice,
        bollingerBands,
        i,
        position.stopLoss,
        position.takeProfit,
        isTrendValid(sma50[i], sma200[i])
      );

      if (shouldExit && portfolio.closePosition('STOCK', currentPrice, data[i].timestamp)) {
        signals.push({
          timestamp: data[i].timestamp,
          type: 'EXIT',
          price: currentPrice,
          reason
        });
      }
    }
  }

  return signals;
}