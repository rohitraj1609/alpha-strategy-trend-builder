import { Signal, TradeReport } from '../types/trading';

export function generateTradeReport(signals: Signal[], name: string, quantity: number = 1): TradeReport[] {
  const report: TradeReport[] = [];
  
  for (let i = 0; i < signals.length; i += 2) {
    if (i + 1 >= signals.length) break;
    
    const entry = signals[i];
    const exit = signals[i + 1];
    
    const profitLoss = (exit.price - entry.price) * quantity;
    
    report.push({
      name,
      entryDateTime: new Date(entry.timestamp).toISOString(),
      entryPrice: entry.price,
      exitDateTime: new Date(exit.timestamp).toISOString(),
      exitPrice: exit.price,
      quantity,
      profitLoss
    });
  }
  
  return report;
}

export function exportToCSV(reports: TradeReport[]): string {
  const headers = ['Name', 'Entry Date and Time', 'Entry Price', 'Exit Date and Time', 'Exit Price', 'Quantity', 'Profit/Loss'];
  const rows = reports.map(report => [
    report.name,
    report.entryDateTime,
    report.entryPrice.toFixed(2),
    report.exitDateTime,
    report.exitPrice.toFixed(2),
    report.quantity,
    report.profitLoss.toFixed(2)
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}