import { OHLCV } from '../../types/trading';
import { BollingerBands } from '../indicators/types';

export function isTrendValid(sma50: number, sma200: number): boolean {
  return sma50 > sma200;
}

export function isRSIValid(rsi: number): boolean {
  return rsi > 30 && rsi < 70;
}

export function isPriceBreakout(price: number, bollingerBands: BollingerBands, index: number): boolean {
  return price > bollingerBands.upper[index];
}

export function shouldExitLongPosition(
  currentPrice: number,
  bollingerBands: BollingerBands,
  index: number,
  stopLoss: number,
  takeProfit: number,
  isUptrend: boolean
): { shouldExit: boolean; reason: string } {
  if (currentPrice <= stopLoss) {
    return { shouldExit: true, reason: 'Stop loss hit' };
  }
  
  if (currentPrice >= takeProfit) {
    return { shouldExit: true, reason: 'Take profit hit' };
  }
  
  if (!isUptrend) {
    return { shouldExit: true, reason: 'Trend reversal' };
  }
  
  if (currentPrice < bollingerBands.upper[index]) {
    return { shouldExit: true, reason: 'Price closed below upper BB' };
  }
  
  return { shouldExit: false, reason: '' };
}