import React, { useState, useCallback } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle, Loader2 } from 'lucide-react';
import { mockBackend } from '../services/mockBackend';
import { ExcelImportLog } from '../types';

interface ExcelUploaderProps {
  sellerId: string;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ sellerId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadLog, setUploadLog] = useState<ExcelImportLog | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadLog(null);
    try {
      // Simulate backend processing
      const log = await mockBackend.processExcelUpload(file, sellerId);
      setUploadLog(log);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".xlsx, .xls"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-100 rounded-full">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-600" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">
              {isProcessing ? 'Обработка файла...' : 'Нажмите или перетащите файл'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Поддерживаются .xlsx, .xls (Макс. 10MB)
            </p>
          </div>
        </div>
      </div>

      {uploadLog && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start">
          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-emerald-900">Импорт завершен успешно</h4>
            <p className="text-sm text-emerald-700 mt-1">
              Добавлено <strong>{uploadLog.rowCount}</strong> товаров из файла <em>{uploadLog.fileName}</em>.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Структура Excel файла
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-4 py-2 border-b">Название</th>
                <th className="px-4 py-2 border-b">Категория</th>
                <th className="px-4 py-2 border-b">Цена</th>
                <th className="px-4 py-2 border-b">Остаток</th>
                <th className="px-4 py-2 border-b">Характеристики (JSON)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="px-4 py-2 text-slate-500">Лист стальной 5мм</td>
                <td className="px-4 py-2 text-slate-500">Листовой прокат</td>
                <td className="px-4 py-2 text-slate-500">85000</td>
                <td className="px-4 py-2 text-slate-500">500</td>
                <td className="px-4 py-2 text-slate-500">{"{\"Марка\": \"09Г2С\"}"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
