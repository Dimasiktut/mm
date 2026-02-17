
import React from 'react';
import { User } from '../types';
import { Building, Shield, FileText, Upload } from 'lucide-react';

export const SellerProfile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-6 max-w-4xl">
       <h1 className="text-2xl font-bold text-slate-900">Профиль компании</h1>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
             <div className="absolute -bottom-10 left-8 w-24 h-24 rounded-xl bg-white p-1 border border-slate-200 shadow-md">
                <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <Building className="w-8 h-8" />
                </div>
             </div>
          </div>
          <div className="pt-12 px-8 pb-8">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{user.companyName || user.name}</h2>
                    <p className="text-slate-500 flex items-center mt-1">
                        <Shield className="w-4 h-4 text-emerald-500 mr-1" /> Статус: <span className="text-emerald-600 font-medium ml-1">Проверенный партнер</span>
                    </p>
                </div>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Редактировать
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Юридическая информация</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">ИНН</span>
                            <span className="font-medium text-slate-900">{user.inn || '7700000000'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">КПП</span>
                            <span className="font-medium text-slate-900">770101001</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">ОГРН</span>
                            <span className="font-medium text-slate-900">1157700000000</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Контакты</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium text-slate-900">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Телефон</span>
                            <span className="font-medium text-slate-900">{user.phone || '+7 (999) 000-00-00'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Сайт</span>
                            <span className="font-medium text-blue-600">{user.website || 'Нет данных'}</span>
                        </div>
                    </div>
                </div>
             </div>
             
             <div className="mt-8">
                 <h3 className="font-bold text-slate-900 mb-4">Документы и Сертификаты</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer transition-colors">
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs text-blue-600 font-medium">Загрузить сертификат</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center">
                        <FileText className="w-8 h-8 text-red-500 mr-3" />
                        <div className="overflow-hidden">
                           <p className="text-xs font-bold text-slate-900 truncate">Свидетельство.pdf</p>
                           <p className="text-[10px] text-slate-400">2.5 MB</p>
                        </div>
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};
