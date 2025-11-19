import React, { useState } from 'react';
import { Sparkles, Bot, Loader2, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PatentGroup, AnalysisStatus } from '../types';
import { generatePortfolioInsight } from '../services/geminiService';

interface InsightPanelProps {
  groups: PatentGroup[];
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ groups }) => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [insight, setInsight] = useState<string>('');

  const handleAnalysis = async () => {
    if (groups.length === 0) return;
    setStatus(AnalysisStatus.LOADING);
    try {
      const result = await generatePortfolioInsight(groups);
      setInsight(result);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      setInsight("Analysis unavailable. Please check API configuration.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  if (groups.length === 0) return null;

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-900 to-violet-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
      {/* Decorative bg elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-300" size={24} />
            <h2 className="text-xl font-bold">Gemini AI 專利組合分析</h2>
          </div>
          {status === AnalysisStatus.IDLE && (
            <button
              onClick={handleAnalysis}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Bot size={16} />
              生成分析報告
            </button>
          )}
        </div>

        {status === AnalysisStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-8 text-indigo-200 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>正在分析專利地域分佈...</p>
          </div>
        )}

        {status === AnalysisStatus.SUCCESS && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-5 border border-white/10 text-indigo-50 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReactMarkdown
              components={{
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 my-2" {...props} />,
                li: ({node, ...props}) => <li className="ml-2" {...props} />,
                strong: ({node, ...props}) => <span className="font-bold text-yellow-200" {...props} />,
                p: ({node, ...props}) => <p className="mb-3" {...props} />
              }}
            >
              {insight}
            </ReactMarkdown>
          </div>
        )}
        
        {status === AnalysisStatus.ERROR && (
           <div className="text-red-200 bg-red-900/30 p-4 rounded-lg text-sm border border-red-500/30">
             {insight}
           </div>
        )}
      </div>
    </div>
  );
};