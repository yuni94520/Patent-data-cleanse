import React from 'react';
import { Layers, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import { ProcessingStats } from '../types';

interface StatsDashboardProps {
  stats: ProcessingStats;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Layers size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">總行數</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats.totalLines.toLocaleString()}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg text-green-600">
            <CheckCircle size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">有效專利</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats.validPatents.toLocaleString()}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Flag size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">國家數量</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats.uniqueCountries}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">無法識別</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats.unknownCount.toLocaleString()}</p>
      </div>
    </div>
  );
};