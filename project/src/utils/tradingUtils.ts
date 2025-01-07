import { CSVData } from '../types/csv';

export const findPriceForDateTime = (data: CSVData[], dateTime: string): number | null => {
  const targetDate = new Date(dateTime).toISOString().split('T')[0];
  const entry = data.find(d => d.Date.includes(targetDate));
  return entry ? entry.Close : null;
};

export const validateTradeDates = (entryDate: string, exitDate: string): boolean => {
  const entry = new Date(entryDate);
  const exit = new Date(exitDate);
  return entry < exit;
};