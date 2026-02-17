
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, User } from '../types';
import { mockBackend } from '../services/mockBackend';
import { MOCK_USERS } from '../constants';
import { ShieldCheck, MapPin, Calculator, FileText, Share2, Star, Truck, Phone } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  
  // Calculator State
  const [calcLength, setCalcLength] = useState<number>(100); // meters
  const [weightResult, setWeightResult] = useState<number>(0);

  useEffect(() => {
    // In a real app, backend would return product + seller info join
    const foundProduct = mockBackend['products'].find(p => p.id === id);
    if (foundProduct) {
        setProduct(foundProduct);
        const foundSeller = MOCK_USERS.find(u => u.id === foundProduct.sellerId);
        setSeller(foundSeller || null);
    }
  }, [id]);

  useEffect(() => {
    // Simple mock calculation logic based on generic steel density ~7.85 g/cm3
    // Assume 12mm bar for calculation logic if diameter exists, else random factor
    if (calcLength > 0) {
        // Mock weight factor: 0.888 kg/m for 12mm rebar
        const factor = 0.888; 
        setWeightResult(calcLength * factor);
    }
  }, [calcLength]);

  if (!product) return <div className="p-10 text-center">Загрузка или товар не найден...</div>;

  return (
    <div className="pb-12 space-y-8">
       {/* Breadcrumbs */}
       <div className="text-sm text-slate-400 flex items-center">
            <Link to="/" className="hover:text-blue-600">Главная</Link>
            <span className="mx-2">/</span>
            <Link to="/catalog" className="hover:text-blue-600">Каталог</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Images & Specs */}
          <div className="lg:col-span-2 space-y-8">
             {/* Main Card */}
             <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                   <div className="w-full md:w-1/2 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                      <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover min-h-[300px]" />
                   </div>
                   <div className="flex-1 flex flex-col">
                      <div className="mb-4">
                         {product.stock < 50 && (
                            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded mb-2">Осталось мало</span>
                         )}
                         <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
                         <div className="text-slate-500 text-sm mb-4">{product.description}</div>
                         <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                            <span className="flex items-center bg-slate-100 px-2 py-1 rounded"><MapPin className="w-4 h-4 mr-1"/> {product.region || 'Россия'}</span>
                            <span className="flex items-center bg-slate-100 px-2 py-1 rounded"><FileText className="w-4 h-4 mr-1"/> {product.gost || 'ГОСТ'}</span>
                         </div>
                      </div>

                      <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                         <div>
                            <p className="text-sm text-slate-500">Оптовая цена</p>
                            <div className="flex items-baseline gap-2">
                               <span className="text-3xl font-bold text-slate-900">{product.price.toLocaleString('ru-RU')} ₽</span>
                               <span className="text-slate-400">/ т</span>
                            </div>
                         </div>
                         <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                            Связаться с поставщиком
                         </button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Specifications Table */}
             <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Характеристики</h2>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-slate-100">
                         {Object.entries(product.specifications).map(([key, val]) => (
                            <tr key={key} className="hover:bg-slate-50">
                               <td className="py-3 px-4 text-slate-500 font-medium w-1/3">{key}</td>
                               <td className="py-3 px-4 text-slate-900">{val}</td>
                            </tr>
                         ))}
                         {product.gost && (
                            <tr className="hover:bg-slate-50">
                               <td className="py-3 px-4 text-slate-500 font-medium">Стандарт (ГОСТ/ТУ)</td>
                               <td className="py-3 px-4 text-slate-900">{product.gost}</td>
                            </tr>
                         )}
                         <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-slate-500 font-medium">Регион отгрузки</td>
                            <td className="py-3 px-4 text-slate-900">{product.region}</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Calculator Mock */}
             <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <Calculator className="w-6 h-6 text-blue-400" />
                      <h2 className="text-xl font-bold">Калькулятор металла</h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                         <label className="block text-sm text-slate-400 mb-2">Длина (метров)</label>
                         <input 
                            type="number" 
                            value={calcLength}
                            onChange={(e) => setCalcLength(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                         />
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex flex-col justify-center">
                         <span className="text-sm text-slate-400">Примерный вес:</span>
                         <div className="text-3xl font-bold text-blue-400">
                            {weightResult.toFixed(2)} <span className="text-lg text-slate-500">кг</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Seller & Trust */}
          <div className="space-y-6">
             {/* Seller Card */}
             <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Продавец</h3>
                {seller ? (
                    <div>
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                             {seller.companyName ? seller.companyName[0] : seller.name[0]}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 leading-tight">{seller.companyName || seller.name}</p>
                             <p className="text-xs text-slate-500 mt-1">На платформе {seller.yearsOnPlatform || 1} лет</p>
                          </div>
                       </div>
                       
                       <div className="flex gap-2 mb-6">
                          {seller.isVerified && (
                             <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-1" /> Проверен
                             </span>
                          )}
                          {seller.rating && (
                             <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" /> {seller.rating}
                             </span>
                          )}
                       </div>

                       <div className="space-y-3">
                          <button className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                             <Phone className="w-4 h-4" /> Показать телефон
                          </button>
                          <button className="w-full py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                             Написать сообщение
                          </button>
                       </div>
                    </div>
                ) : (
                    <p>Информация о продавце недоступна</p>
                )}
             </div>

             {/* Delivery Info */}
             <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-3">
                   <Truck className="w-5 h-5 text-slate-400 mt-1" />
                   <div>
                      <h4 className="font-bold text-slate-900">Доставка и оплата</h4>
                      <p className="text-sm text-slate-500 mt-2">
                         Возможна доставка автотранспортом и Ж/Д вагонами. Самовывоз со склада в г. {product.region}.
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                         Оплата: Безналичный расчет с НДС.
                      </p>
                   </div>
                </div>
             </div>

             {/* Share */}
             <button className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition-colors py-2">
                <Share2 className="w-4 h-4" /> Поделиться карточкой
             </button>
          </div>
       </div>
    </div>
  );
};
