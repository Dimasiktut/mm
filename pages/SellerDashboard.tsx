
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Product, DailyStat, Lead } from '../types';
import { mockBackend } from '../services/mockBackend';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Eye, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Download,
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';

interface SellerDashboardProps {
  user: User;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<{
    totalProducts: number;
    topProduct: Product | null;
    dailyViews: DailyStat[];
    leads: Lead[];
  } | null>(null);

  useEffect(() => {
    mockBackend.getSellerStats(user.id).then(setStats);
  }, [user.id]);

  if (!stats) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const totalViews = stats.dailyViews.reduce((acc, curr) => acc + curr.views, 0);
  const totalOrders = stats.leads.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Обзор бизнеса</h1>
            <p className="text-sm text-slate-500">Последнее обновление: сегодня, 12:00</p>
         </div>
         <div className="flex gap-3">
             <Link to="/seller/import" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center text-sm">
                <Download className="w-4 h-4 mr-2" /> Загрузить Excel
             </Link>
             <Link to="/seller/products" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center text-sm shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Добавить товар
             </Link>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Views KPI */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-slate-500 text-sm font-medium">Просмотры (7 дн)</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalViews}</h3>
               </div>
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Eye className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-center text-xs text-emerald-600 font-medium">
               <ArrowUpRight className="w-3 h-3 mr-1" />
               +12% к прошлой неделе
            </div>
         </div>

         {/* Products KPI */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-slate-500 text-sm font-medium">Товаров в каталоге</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalProducts}</h3>
               </div>
               <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Package className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-center text-xs text-slate-400">
               Все активны
            </div>
         </div>

         {/* Leads KPI */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-slate-500 text-sm font-medium">Новые заявки</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalOrders}</h3>
               </div>
               <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <MessageSquare className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-center text-xs text-amber-600 font-medium">
               2 требуют внимания
            </div>
         </div>

         {/* Revenue Potential KPI */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-slate-500 text-sm font-medium">Потенциал сделок</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">1.2M ₽</h3>
               </div>
               <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-center text-xs text-slate-400">
               На основе активных лидов
            </div>
         </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-900">Динамика просмотров</h3>
               <select className="text-sm border border-slate-200 rounded px-2 py-1 bg-slate-50">
                  <option>За 7 дней</option>
                  <option>За 30 дней</option>
               </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyViews}>
                  <defs>
                    <linearGradient id="colorViews2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}
                    cursor={{stroke: '#e2e8f0'}}
                  />
                  <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Top Products Mini Table */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-900 mb-4">Топ товаров</h3>
            <div className="flex-1 overflow-y-auto">
               <div className="space-y-4">
                  {stats.topProduct ? (
                     <div className="flex items-center gap-3">
                        <img src={stats.topProduct.image || ''} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-slate-900 truncate">{stats.topProduct.name}</p>
                           <p className="text-xs text-slate-500">{stats.topProduct.price} ₽ / т</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-slate-900">{stats.topProduct.views}</p>
                           <p className="text-xs text-slate-400">просмотров</p>
                        </div>
                     </div>
                  ) : (
                     <p className="text-sm text-slate-500">Нет данных</p>
                  )}
                  {/* Dummy items for visuals if only 1 mock product */}
                  <div className="flex items-center gap-3 opacity-60">
                     <div className="w-12 h-12 rounded-lg bg-slate-100"></div>
                     <div className="flex-1">
                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                     </div>
                     <div className="w-8 h-8 bg-slate-100 rounded"></div>
                  </div>
                   <div className="flex items-center gap-3 opacity-40">
                     <div className="w-12 h-12 rounded-lg bg-slate-100"></div>
                     <div className="flex-1">
                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                     </div>
                     <div className="w-8 h-8 bg-slate-100 rounded"></div>
                  </div>
               </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
               Смотреть всю статистику
            </button>
         </div>
      </div>
      
    </div>
  );
};
