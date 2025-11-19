import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileLoaded: (content: string, fileName: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoaded }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content, file.name);
    };
    reader.readAsText(file);
  }, [onFileLoaded]);

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-3 bg-indigo-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="mb-2 text-sm text-slate-700 font-medium">
            點擊上傳或拖曳檔案至此
          </p>
          <p className="text-xs text-slate-500">
            支援 .txt, .csv (自動過濾非案號欄位)
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3 border border-blue-100">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">智能數據清洗規則：</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li><span className="font-medium">多欄位支援：</span>自動識別 CSV/Excel 格式，只提取專利案號，忽略其他欄位。</li>
            <li><span className="font-medium">自動分國：</span>依據 Country 欄位或案號前兩碼 (如 <span className="font-mono bg-blue-100 px-1 rounded">CN</span>) 進行分類。</li>
            <li><span className="font-medium">格式淨化：</span>自動去除引號、空格與重複數據，生成 120+ 國家純案號清單。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};