import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import type { ImportedCompanyData } from '../types/csv';

interface CSVImportProps {
  onDataImported: (data: ImportedCompanyData) => void;
}

export default function CSVImport({ onDataImported }: CSVImportProps) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const data = parseCSV(content);
      const symbol = file.name.replace('.csv', '');
      onDataImported({ symbol, data });
    };
    reader.readAsText(file);
  }, [onDataImported]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Import Company Data</h2>
      <label className="flex flex-col items-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">Upload CSV file</span>
        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
      </label>
    </div>
  );
}