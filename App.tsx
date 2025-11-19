import React, { useState } from 'react';
import JSZip from 'jszip';
import { DownloadCloud, RefreshCw, Settings } from 'lucide-react';
import { processPatentData } from './services/processor';
import { ProcessResult } from './types';
import { FileUploader } from './components/FileUploader';
import { StatsDashboard } from './components/StatsDashboard';
import { CountryList } from './components/CountryList';
import { InsightPanel } from './components/InsightPanel';

const App: React.FC = () => {
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileLoaded = (content: string, name: string) => {
    const processed = processPatentData(content);
    setResult(processed);
    setFileName(name);
  };

  const handleReset = () => {
    setResult(null);
    setFileName('');
  };

  const downloadAllAsZip = async () => {
    if (!result) return;

    const zip = new JSZip();
    const folder = zip.folder("DI_Batch_Lists");
    
    if (folder) {
      result.groups.forEach(group => {
        folder.file(`${group.countryCode}_DI_Batch.txt`, group.patents.join('\n'));
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Processed_Patents_${new Date().toISOString().slice(0,10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Settings size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">Patent Splitter Pro</h1>
              <p className="text-xs text-slate-500 font-medium">智能專利數據分割與清洗系統</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {result && (
              <button 
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RefreshCw size={16} />
                重新上傳
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto mt-12 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">數據分割與清洗流程</h2>
              <p className="text-slate-600 text-lg">
                支援多國專利清單 (Excel/CSV/TXT)。<br/>
                系統將自動過濾多餘欄位，僅保留案號並依國別分類，確保 RPA 流程順暢。
              </p>
            </div>
            <FileUploader onFileLoaded={handleFileLoaded} />
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">處理結果概覽</h2>
                <p className="text-sm text-slate-500">來源檔案: {fileName}</p>
              </div>
              <button
                onClick={downloadAllAsZip}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-medium flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <DownloadCloud size={20} />
                下載所有檔案 (.zip)
              </button>
            </div>

            <StatsDashboard stats={result.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CountryList groups={result.groups} />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 sticky top-24">
                  <h3 className="font-semibold text-slate-800 mb-4">RPA 執行指南</h3>
                  <ol className="relative border-l border-slate-200 ml-3 space-y-6">
                    <li className="ml-6">
                      <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 ring-8 ring-white">
                        <span className="text-xs font-bold text-indigo-600">1</span>
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">下載 ZIP 檔案</h4>
                      <p className="text-xs text-slate-500 mt-1">下載並解壓縮，獲得已清洗的 {result.stats.uniqueCountries} 個國家獨立清單。</p>
                    </li>
                    <li className="ml-6">
                      <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 ring-8 ring-white">
                        <span className="text-xs font-bold text-slate-600">2</span>
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">啟動 RPA 流程</h4>
                      <p className="text-xs text-slate-500 mt-1">機器人將讀取 <code>XX_DI_Batch.txt</code> 檔案名稱。</p>
                    </li>
                    <li className="ml-6">
                      <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 ring-8 ring-white">
                        <span className="text-xs font-bold text-slate-600">3</span>
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">全自動檢索</h4>
                      <p className="text-xs text-slate-500 mt-1">自動完成所有 {result.stats.uniqueCountries} 個國家的檢索與下載。</p>
                    </li>
                  </ol>
                </div>
                
                {/* AI Insight Component */}
                <InsightPanel groups={result.groups} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;