import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle } from 'lucide-react';
import type { Trade } from '../types/trading';
import type { ImportedCompanyData } from '../types/csv';
import { findPriceForDateTime, validateTradeDates } from '../utils/tradingUtils';

interface TradeFormProps {
  onAddTrade: (trade: Trade) => void;
  companyData: ImportedCompanyData[];
}

export default function TradeForm({ onAddTrade, companyData }: TradeFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    entryDateTime: '',
    exitDateTime: '',
    quantity: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [prices, setPrices] = useState({ entry: null, exit: null });

  useEffect(() => {
    if (formData.companyName && formData.entryDateTime && formData.exitDateTime) {
      const company = companyData.find(c => c.symbol === formData.companyName);
      if (company) {
        const entryPrice = findPriceForDateTime(company.data, formData.entryDateTime);
        const exitPrice = findPriceForDateTime(company.data, formData.exitDateTime);
        
        if (entryPrice && exitPrice) {
          setPrices({ entry: entryPrice, exit: exitPrice });
          setError(null);
        } else {
          setError('Price data not available for selected dates');
          setPrices({ entry: null, exit: null });
        }
      }
    }
  }, [formData.companyName, formData.entryDateTime, formData.exitDateTime, companyData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTradeDates(formData.entryDateTime, formData.exitDateTime)) {
      setError('Exit date must be after entry date');
      return;
    }

    if (!prices.entry || !prices.exit) {
      setError('Unable to fetch price data');
      return;
    }

    const trade: Trade = {
      companyName: formData.companyName,
      entryDateTime: formData.entryDateTime,
      exitDateTime: formData.exitDateTime,
      entryPrice: prices.entry,
      exitPrice: prices.exit,
      quantity: Number(formData.quantity),
      profitLoss: (prices.exit - prices.entry) * Number(formData.quantity),
    };

    onAddTrade(trade);
    setFormData({
      companyName: '',
      entryDateTime: '',
      exitDateTime: '',
      quantity: '',
    });
    setPrices({ entry: null, exit: null });
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Trade</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <select
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Company</option>
            {companyData.map(company => (
              <option key={company.symbol} value={company.symbol}>
                {company.symbol}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Entry Date & Time</label>
          <input
            type="datetime-local"
            value={formData.entryDateTime}
            onChange={(e) => setFormData({ ...formData, entryDateTime: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {prices.entry && (
            <p className="mt-1 text-sm text-gray-500">Price: ${prices.entry.toFixed(2)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Exit Date & Time</label>
          <input
            type="datetime-local"
            value={formData.exitDateTime}
            onChange={(e) => setFormData({ ...formData, exitDateTime: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {prices.exit && (
            <p className="mt-1 text-sm text-gray-500">Price: ${prices.exit.toFixed(2)}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={!!error}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Trade
      </button>
    </form>
  );
}