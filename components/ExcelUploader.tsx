
import React, { useState, useCallback } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle, Loader2, Download, HelpCircle } from 'lucide-react';
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

  const downloadTemplate = () => {
    // CSV Header matching the DB structure roughly
    const headers = [
      "Название товара",
      "ID Категории (c1, c1-1...)",
      "Цена (руб/т)",
      "Остаток (т)",
      "Описание",
      "Регион склада",
      "ГОСТ/ТУ",
      "Ссылка на фото",
      "Марка стали (Спецификация)",
      "Диаметр/Толщина (Спецификация)",
      "Длина (Спецификация)"
    ];

    const exampleRow = [
      "Арматура А500С d12",
      "c1-1",
      "52000",
      "150",
      "Рифленая арматура для фундамента, мерная длина.",
      "Москва",
      "ГОСТ 34028-2016",
      "https://example.com/image.jpg",
      "А500С",
      "12 мм",
      "11.7 м"
    ];

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + headers.join(";") + "\n" 
        + exampleRow.join(";");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shablon_zagruzki_tovarov.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Header & Template Download */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h3 className="text-lg font-bold text-blue-900 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Как загрузить товары массово?
           </h3>
           <p className="text-sm text-blue-700 mt-1 max-w-xl">
              1. Скачайте подготовленный шаблон.<br/>
              2. Заполните его вашими товарами (ID категорий можно найти в разделе "Каталог").<br/>
              3. Загрузите полученный файл в окно ниже.
           </p>
        </div>
        <button 
          onClick={downloadTemplate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
           <Download className="w-4 h-4 mr-2" /> Скачать шаблон (CSV)
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
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
          accept=".xlsx, .xls, .csv"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            ) : (
              <UploadCloud className="w-10 h-10 text-blue-600" />
            )}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">
              {isProcessing ? 'Обработка файла...' : 'Перетащите файл сюда'}
            </p>
            <p className="text-slate-500 mt-2">
              или кликните для выбора файла (.xlsx, .csv)
            </p>
          </div>
        </div>
      </div>

      {/* Result Notification */}
      {uploadLog && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 text-lg">Импорт завершен успешно!</h4>
            <p className="text-emerald-800 mt-1">
              Файл <strong>{uploadLog.fileName}</strong> обработан. Добавлено <strong>{uploadLog.rowCount}</strong> новых позиций в ваш каталог.
            </p>
          </div>
        </div>
      )}

      {/* Visual Guide Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Пример заполнения таблицы
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3 border-b">Название</th>
                <th className="px-6 py-3 border-b">ID Категории</th>
                <th className="px-6 py-3 border-b">Цена</th>
                <th className="px-6 py-3 border-b">Остаток</th>
                <th className="px-6 py-3 border-b">ГОСТ</th>
                <th className="px-6 py-3 border-b">Характеристики</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="px-6 py-3 text-slate-900 font-medium">Арматура А500С d12</td>
                <td className="px-6 py-3 text-slate-600 font-mono text-xs bg-slate-50 rounded">c1-1</td>
                <td className="px-6 py-3 text-slate-600">52000</td>
                <td className="px-6 py-3 text-slate-600">150</td>
                <td className="px-6 py-3 text-slate-600">34028-2016</td>
                <td className="px-6 py-3 text-slate-500 italic">Марка: А500С; Диам: 12мм</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-slate-900 font-medium">Лист г/к 5мм</td>
                <td className="px-6 py-3 text-slate-600 font-mono text-xs bg-slate-50 rounded">c2-1</td>
                <td className="px-6 py-3 text-slate-600">85000</td>
                <td className="px-6 py-3 text-slate-600">45</td>
                <td className="px-6 py-3 text-slate-600">19903-2015</td>
                <td className="px-6 py-3 text-slate-500 italic">Ст3сп5; 1500x6000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
