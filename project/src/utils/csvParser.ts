import { CSVData, ImportedCompanyData } from '../types/csv';

export const parseCSV = (csvContent: string): CSVData[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const entry: Partial<CSVData> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (header === 'Date') {
        entry[header] = value;
      } else {
        entry[header as keyof CSVData] = parseFloat(value);
      }
    });
    
    return entry as CSVData;
  });
};

export const calculateMetrics = (data: CSVData[]): {
  averageReturn: number;
  volatility: number;
  maxDrawdown: number;
} => {
  const returns = data.map(d => d['% Change']);
  const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  
  const variance = returns.reduce((acc, val) => 
    acc + Math.pow(val - averageReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  
  let maxDrawdown = 0;
  let peak = data[0].Close;
  
  data.forEach(d => {
    if (d.Close > peak) {
      peak = d.Close;
    }
    const drawdown = (peak - d.Close) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });
  
  return { averageReturn, volatility, maxDrawdown };
};