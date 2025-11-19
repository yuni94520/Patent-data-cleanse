import React from 'react';
import { Download, FileText } from 'lucide-react';
import { PatentGroup } from '../types';

interface CountryListProps {
  groups: PatentGroup[];
}

export const CountryList: React.FC<CountryListProps> = ({ groups }) => {
  const downloadSingle = (group: PatentGroup) => {
    const blob = new Blob([group.patents.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${group.countryCode}_DI_Batch.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText size={18} className="text-slate-500" />
          生成檔案列表
        </h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
          {groups.length} 檔案
        </span>
      </div>
      
      <div className="max-h-[500px] overflow-y-auto p-2">
        {groups.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            尚無數據
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {groups.map((group) => (
              <div 
                key={group.countryCode}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                    {group.countryCode}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{group.countryCode}_DI_Batch.txt</p>
                    <p className="text-xs text-slate-500">{group.patents.length} 筆專利</p>
                  </div>
                </div>
                <button
                  onClick={() => downloadSingle(group)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="下載此檔案"
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};