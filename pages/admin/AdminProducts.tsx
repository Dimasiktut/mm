
import React, { useEffect, useState } from 'react';
import { Product, ProductStatus } from '../../types';
import { mockBackend } from '../../services/mockBackend';
import { Search, ExternalLink, Check, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    // Fetch all products (admin usually wants to see moderation queue first)
    const data = await mockBackend.getProducts({ status: 'MODERATION' });
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModeration = async (id: string, status: ProductStatus) => {
      await mockBackend.updateProductStatus(id, status);
      loadData(); // Refresh
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">Модерация товаров</h1>
             <p className="text-slate-500">Проверка новых позиций перед публикацией в каталог</p>
          </div>
       </div>

       <div className="flex gap-4 mb-4">
           <button className="px-4 py-2 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-200 text-sm">Очередь (Модерация)</button>
           <button className="px-4 py-2 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Все товары</button>
           <button className="px-4 py-2 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Жалобы</button>
       </div>

       <div className="grid grid-cols-1 gap-4">
           {isLoading ? (
               <div className="p-12 text-center text-slate-500">Загрузка очереди...</div>
           ) : products.length === 0 ? (
               <div className="p-12 text-center bg-white rounded-xl border border-slate-200 flex flex-col items-center">
                   <Check className="w-12 h-12 text-emerald-500 mb-4" />
                   <h3 className="text-lg font-bold text-slate-900">Очередь пуста</h3>
                   <p className="text-slate-500">Все товары проверены.</p>
               </div>
           ) : (
               products.map(product => (
                   <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col lg:flex-row gap-6">
                       <div className="w-full lg:w-48 h-48 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                           <img src={product.image || ''} className="w-full h-full object-cover" />
                           <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded">MODERATION</div>
                       </div>
                       
                       <div className="flex-1">
                           <div className="flex justify-between items-start">
                               <div>
                                   <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
                                   <div className="text-sm text-slate-500 mb-2">Категория ID: <span className="font-mono bg-slate-100 px-1 rounded">{product.categoryId}</span> • Продавец ID: {product.sellerId}</div>
                               </div>
                               <div className="text-right">
                                   <div className="text-xl font-bold text-slate-900">{product.price.toLocaleString()} ₽</div>
                                   <div className="text-sm text-slate-500">{product.stock} тонн</div>
                               </div>
                           </div>
                           
                           <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 mb-4">
                               <p className="font-bold text-slate-900 mb-1">Описание:</p>
                               {product.description}
                           </div>

                           <div className="flex flex-wrap gap-2 mb-4">
                               {Object.entries(product.specifications).map(([k, v]) => (
                                   <span key={k} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">
                                       <b>{k}:</b> {v}
                                   </span>
                               ))}
                           </div>

                           <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                               <button 
                                   onClick={() => handleModeration(product.id, 'ACTIVE')}
                                   className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 flex items-center"
                               >
                                   <Check className="w-4 h-4 mr-2" /> Одобрить
                               </button>
                               <button 
                                   onClick={() => handleModeration(product.id, 'REJECTED')}
                                   className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-200 hover:bg-red-100 flex items-center"
                               >
                                   <X className="w-4 h-4 mr-2" /> Отклонить
                               </button>
                               <Link to={`/product/${product.id}`} target="_blank" className="ml-auto text-blue-600 text-sm hover:underline flex items-center">
                                   Предпросмотр <ExternalLink className="w-3 h-3 ml-1" />
                               </Link>
                           </div>
                       </div>
                   </div>
               ))
           )}
       </div>
    </div>
  );
};
