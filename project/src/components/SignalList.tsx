import React from 'react';
import { Signal } from '../types/trading';

interface SignalListProps {
  signals: Signal[];
}

export function SignalList({ signals }: SignalListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Strategy Signals</h2>
      <div className="space-y-4">
        {signals.map((signal, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                signal.type === 'ENTRY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {signal.type}
              </span>
              <p className="text-sm text-gray-600 mt-1">{signal.reason}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${signal.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                {new Date(signal.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}