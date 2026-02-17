
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { 
  Users, Package, AlertTriangle, TrendingUp, Download, Eye, ShieldCheck, Activity 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
      sellersCount: 0,
      productsCount: 0,
      productsOnModeration: 0,
      companiesOnVerification: 0
  });

  useEffect(() => {
     mockBackend.getAdminStats().then(setStats);
  }, []);

  // Mock data for charts
  const activityData = [
      { name: 'Пн', sellers: 4, products: 24, views: 2400 },
      { name: 'Вт', sellers: 7, products: 18, views: 1398 },
      { name: 'Ср', sellers: 5, products: 98, views: 9800 },
      { name: 'Чт', sellers: 12, products: 39, views: 3908 },
      { name: 'Пт', sellers: 9, products: 48, views: 4800 },
      { name: 'Сб', sellers: 3, products: 12, views: 1800 },
      { name: 'Вс', sellers: 2, products: 5, views: 1200 },
  ];

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Обзор системы</h1>
          <span className="text-sm text-slate-500">Последнее обновление: только что</span>
       </div>

       {/* KPI Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500">Компании (Продавцы)</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.sellersCount}</h3>
                <p className="text-xs text-emerald-600 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12% за неделю</p>
             </div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500">Товаров всего</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.productsCount}</h3>
             </div>
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Package className="w-6 h-6" />
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm flex items-center justify-between relative overflow-hidden">
             {stats.companiesOnVerification > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-3 animate-ping"></span>}
             <div>
                <p className="text-sm font-bold text-red-600">Требуют верификации</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.companiesOnVerification}</h3>
                <p className="text-xs text-slate-500 mt-1">Компании в ожидании</p>
             </div>
             <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                <ShieldCheck className="w-6 h-6" />
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-sm font-bold text-amber-600">Модерация товаров</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.productsOnModeration}</h3>
             </div>
             <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
             </div>
          </div>
       </div>

       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-slate-400"/> Активность (Регистрации / Товары)</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                      <Bar dataKey="sellers" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Новые продавцы" />
                      <Bar dataKey="products" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Новые товары" />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center"><Eye className="w-5 h-5 mr-2 text-slate-400"/> Просмотры на платформе</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                      <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} name="Просмотры" />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       {/* Recent Activity Table Stub */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Последние действия в системе</h3>
               <button className="text-xs font-bold text-blue-600 hover:underline">Смотреть все логи</button>
           </div>
           <table className="w-full text-sm text-left">
               <thead className="text-slate-500 font-medium border-b border-slate-100">
                   <tr>
                       <th className="px-6 py-3">Админ</th>
                       <th className="px-6 py-3">Действие</th>
                       <th className="px-6 py-3">Детали</th>
                       <th className="px-6 py-3 text-right">Время</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                   <tr className="hover:bg-slate-50">
                       <td className="px-6 py-3 font-medium">Super Admin</td>
                       <td className="px-6 py-3 text-emerald-600">Verification Approved</td>
                       <td className="px-6 py-3 text-slate-500">Company ID: 123-456</td>
                       <td className="px-6 py-3 text-right text-slate-400">2 мин назад</td>
                   </tr>
                   <tr className="hover:bg-slate-50">
                       <td className="px-6 py-3 font-medium">System</td>
                       <td className="px-6 py-3 text-blue-600">Excel Import</td>
                       <td className="px-6 py-3 text-slate-500">Seller: Severstal (54 items)</td>
                       <td className="px-6 py-3 text-right text-slate-400">15 мин назад</td>
                   </tr>
                   <tr className="hover:bg-slate-50">
                       <td className="px-6 py-3 font-medium">Moderator Anna</td>
                       <td className="px-6 py-3 text-red-600">Product Rejected</td>
                       <td className="px-6 py-3 text-slate-500">Reason: No certificate</td>
                       <td className="px-6 py-3 text-right text-slate-400">1 час назад</td>
                   </tr>
               </tbody>
           </table>
       </div>
    </div>
  );
};
