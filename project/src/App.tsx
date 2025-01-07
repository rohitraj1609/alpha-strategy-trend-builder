import React, { useState } from 'react';
import { Chart } from './components/Chart';
import { Metrics } from './components/Metrics';
import { FileUpload } from './components/FileUpload';
import { SignalList } from './components/SignalList';
import { OHLCV, Signal, StrategyResult, DataSet, TradeReport } from './types/trading';
import { generateSignals, calculateMetrics } from './utils/strategy';
import { generateTradeReport, exportToCSV, downloadCSV } from './utils/reports';
import { Settings, RefreshCw, Download } from 'lucide-react';

function App() {
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DataSet | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [metrics, setMetrics] = useState<StrategyResult['metrics'] | null>(null);
  const [reports, setReports] = useState<TradeReport[]>([]);

  const handleFilesUpload = (newDatasets: DataSet[]) => {
    setDatasets(newDatasets);
    if (newDatasets.length > 0) {
      setSelectedDataset(newDatasets[0]);
    }
  };

  const runStrategy = () => {
    const allReports: TradeReport[] = [];
    
    datasets.forEach(dataset => {
      const generatedSignals = generateSignals(dataset.data);
      const report = generateTradeReport(generatedSignals, dataset.name);
      allReports.push(...report);
      
      if (dataset === selectedDataset) {
        setSignals(generatedSignals);
        setMetrics(calculateMetrics(dataset.data, generatedSignals));
      }
    });
    
    setReports(allReports);
  };

  const handleDownloadReport = () => {
    if (reports.length === 0) return;
    
    const csv = exportToCSV(reports);
    downloadCSV(csv, 'trading_report.csv');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Alpha Strategy Builder</h1>
            <div className="flex items-center space-x-4">
              {datasets.length > 1 && (
                <select
                  className="form-select rounded-md border-gray-300"
                  value={selectedDataset?.name || ''}
                  onChange={(e) => {
                    const dataset = datasets.find(d => d.name === e.target.value);
                    if (dataset) setSelectedDataset(dataset);
                  }}
                >
                  {datasets.map(dataset => (
                    <option key={dataset.name} value={dataset.name}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
              )}
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={runStrategy}
                disabled={datasets.length === 0}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Run Strategy</span>
              </button>
              {reports.length > 0 && (
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {datasets.length === 0 ? (
            <FileUpload onFilesUpload={handleFilesUpload} />
          ) : (
            <>
              {metrics && <Metrics metrics={metrics} />}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {selectedDataset && (
                  <>
                    <Chart data={selectedDataset.data} signals={signals} />
                    <SignalList signals={signals} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;