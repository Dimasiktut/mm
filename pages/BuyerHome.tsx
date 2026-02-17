
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Truck, Package, Factory, TrendingUp } from 'lucide-react';
import { MOCK_CATEGORIES } from '../constants';

export const BuyerHome: React.FC = () => {
  const navigate = useNavigate();
  const rootCategories = MOCK_CATEGORIES.filter(c => !c.parentId);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search');
    if (query) navigate(`/catalog?search=${query}`);
  };

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=2000" 
            alt="Steel factory" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold tracking-wider uppercase">
                B2B Маркетплейс №1
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Маркетплейс <br/>
                <span className="text-blue-500">металлопроката</span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl">
                Прямые поставки от ведущих металлургических комбинатов и проверенных трейдеров. Оптовые цены, быстрая логистика, безопасные сделки.
              </p>
            </div>

            {/* Quick Search */}
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl flex shadow-lg max-w-lg">
               <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input 
                    name="search"
                    type="text" 
                    placeholder="Арматура А500С, Балка 20Б1..." 
                    className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none text-slate-800 placeholder:text-slate-400"
                 />
               </div>
               <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  Найти
               </button>
            </form>

            <div className="flex gap-4 text-sm font-medium text-slate-400">
               <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-blue-500">#Арматура</span>
               <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-blue-500">#Лист г/к</span>
               <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-blue-500">#Швеллер</span>
            </div>
          </div>
          
          {/* Stats / Graphic (Desktop only) */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
             <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                   <Factory className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">1,500+</h3>
                <p className="text-slate-400 text-sm">Проверенных поставщиков</p>
             </div>
             <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 mt-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                   <Package className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">50k+</h3>
                <p className="text-slate-400 text-sm">Товаров в наличии</p>
             </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <div className="flex justify-between items-end mb-8">
           <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Популярные категории</h2>
           <Link to="/catalog" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center">
              Весь каталог <ArrowRight className="w-4 h-4 ml-1" />
           </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {rootCategories.map((cat) => (
             <Link key={cat.id} to={`/catalog?category=${cat.id}`} className="group relative h-48 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-6">
                   <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                   <span className="text-slate-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Перейти в раздел</span>
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* Trust Blocks */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
         <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Почему профессионалы выбирают нас</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <Search className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-lg mb-2">Удобный поиск</h3>
               <p className="text-slate-500 text-sm">Интеллектуальный поиск по марке стали, ГОСТу и размерам за секунды.</p>
            </div>
            <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                  <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-lg mb-2">Проверенные поставщики</h3>
               <p className="text-slate-500 text-sm">Каждый продавец проходит строгую проверку службы безопасности и имеет рейтинг.</p>
            </div>
            <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                  <Truck className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-lg mb-2">Доставка по РФ</h3>
               <p className="text-slate-500 text-sm">Организуем логистику от склада до объекта в любой регион страны.</p>
            </div>
         </div>
      </section>

      {/* Seller CTA */}
      <section className="bg-slate-900 rounded-2xl overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800 -skew-x-12 transform translate-x-20 z-0 hidden md:block"></div>
         <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Продаете металлопрокат?</h2>
               <p className="text-slate-300 text-lg mb-8">
                  Разместите свои товары на крупнейшем B2B маркетплейсе. Загрузка прайс-листа из Excel за 2 минуты.
               </p>
               <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                  Стать поставщиком
               </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 w-full max-w-sm">
               <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                     <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <p className="text-white font-bold">Рост продаж</p>
                     <p className="text-green-400 text-xs">+35% в первый месяц</p>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-700 rounded w-full"></div>
                  <div className="h-2 bg-slate-700 rounded w-1/2"></div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
