import { MarketCondition, TechnicalIndicators } from '../types/trading';
import { CSVData } from '../types/csv';
import { calculateSMA, calculateRSI, calculateADX, calculateATR, calculateBollingerBands } from './indicators';

export const analyzeTechnicals = (data: CSVData[]): TechnicalIndicators => {
  const closes = data.map(d => d.Close);
  const { upper, lower } = calculateBollingerBands(closes);
  
  return {
    sma20: calculateSMA(closes, 20),
    sma50: calculateSMA(closes, 50),
    sma200: calculateSMA(closes, 200),
    rsi: calculateRSI(closes),
    adx: calculateADX(data),
    atr: calculateATR(data),
    bollingerUpper: upper,
    bollingerLower: lower
  };
};

export const identifyMarketCondition = (indicators: TechnicalIndicators): MarketCondition => {
  const { sma20, sma50, sma200, adx, atr, rsi } = indicators;
  
  if (adx < 20) {
    return { trend: 'sideways', strength: adx / 20 };
  }
  
  if (sma20 > sma50 && sma50 > sma200 && adx > 25) {
    return { trend: 'uptrend', strength: adx / 100 };
  }
  
  if (sma20 < sma50 && sma50 < sma200 && adx > 25) {
    return { trend: 'downtrend', strength: adx / 100 };
  }
  
  if (atr > calculateSMA([atr], 20) * 1.5) {
    return { trend: 'volatile', strength: atr / (calculateSMA([atr], 20) * 2) };
  }
  
  return { trend: 'sideways', strength: 0.5 };
};