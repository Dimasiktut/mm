
import React, { useEffect, useState } from 'react';
import { Product, User } from '../types';
import { mockBackend } from '../services/mockBackend';
import { Search, Filter, MoreHorizontal, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export const SellerProducts: React.FC<{ user: User }> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    mockBackend.getProducts({ sellerId: user.id }).then(res => {
        setProducts(res);
        setIsLoading(false);
    });
  }, [user.id]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Мои товары</h1>
       </div>

       {/* Filters */}
       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
                type="text" 
                placeholder="Поиск по названию..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
             />
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Фильтры
             </button>
          </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                   <th className="px-6 py-4">Товар</th>
                   <th className="px-6 py-4">Категория</th>
                   <th className="px-6 py-4">Цена</th>
                   <th className="px-6 py-4">Остаток</th>
                   <th className="px-6 py-4">Статус</th>
                   <th className="px-6 py-4 text-right">Действия</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                   <tr><td colSpan={6} className="p-6 text-center text-slate-500">Загрузка...</td></tr>
                ) : filtered.length === 0 ? (
                   <tr><td colSpan={6} className="p-6 text-center text-slate-500">Товары не найдены</td></tr>
                ) : (
                   filtered.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                  <img src={product.image || ''} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p className="font-medium text-slate-900 line-clamp-1">{product.name}</p>
                                  <p className="text-xs text-slate-400">ID: {product.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-slate-600">
                            {product.categoryId}
                         </td>
                         <td className="px-6 py-4 font-medium text-slate-900">
                            {product.price.toLocaleString()} ₽
                         </td>
                         <td className="px-6 py-4 text-slate-600">
                            {product.stock} т
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                product.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                               {product.status === 'ACTIVE' ? 'Активен' : product.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title="Редактировать">
                                  <Edit className="w-4 h-4" />
                               </button>
                               <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Удалить">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};
