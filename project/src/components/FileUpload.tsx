import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { DataSet } from '../types/trading';
import { parseCSVData } from '../utils/csv';

interface FileUploadProps {
  onFilesUpload: (datasets: DataSet[]) => void;
}

export function FileUpload({ onFilesUpload }: FileUploadProps) {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const datasets: DataSet[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsText(file);
        });
        
        const data = parseCSVData(text);
        datasets.push({
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          data
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }
    
    if (datasets.length > 0) {
      onFilesUpload(datasets);
    }
  }, [onFilesUpload]);

  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Multiple CSV files with OHLCV data</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".csv"
          multiple
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}