
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { mockBackend } from '../services/mockBackend';
import { Search, Filter, ChevronDown, ChevronRight, ShoppingCart, Info, MapPin } from 'lucide-react';

export const BuyerCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('price_asc');
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Collapsible Filters State
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  useEffect(() => {
    // Sync URL params
    const categoryId = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    setSelectedCategory(categoryId);
    if (searchQuery) setSearch(searchQuery);
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [prods, cats] = await Promise.all([
        mockBackend.getProducts({ categoryId: selectedCategory || undefined, search }),
        mockBackend.getCategories()
      ]);
      
      // Simple client-side sort
      let sorted = [...prods];
      if (sort === 'price_asc') sorted.sort((a,b) => a.price - b.price);
      if (sort === 'price_desc') sorted.sort((a,b) => b.price - a.price);
      if (sort === 'newest') sorted.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setProducts(sorted);
      setCategories(cats);
      setIsLoading(false);
    };
    loadData();
  }, [selectedCategory, search, sort]);

  const rootCategories = categories.filter(c => !c.parentId);

  const handleCategoryClick = (id: string | null) => {
    setSelectedCategory(id);
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Breadcrumbs & Title */}
      <div>
         <div className="text-sm text-slate-400 mb-2 flex items-center">
            <Link to="/" className="hover:text-blue-600">Главная</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-slate-800 font-medium">Каталог металлопроката</span>
         </div>
         <h1 className="text-3xl font-bold text-slate-900">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Весь металлопрокат'}
         </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* Sticky Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
           <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* Filter: Categories */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <button 
                   onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                   className="flex items-center justify-between w-full mb-4 font-bold text-slate-900"
                 >
                    <span>Категории</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                 </button>
                 
                 {isCategoryOpen && (
                   <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      <button
                        onClick={() => handleCategoryClick(null)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          !selectedCategory ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Все категории
                      </button>
                      {rootCategories.map(cat => (
                        <div key={cat.id}>
                          <button
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex justify-between items-center ${
                              selectedCategory === cat.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {cat.name}
                          </button>
                          {/* Subcategories */}
                          {categories.filter(c => c.parentId === cat.id).map(sub => (
                             <button
                             key={sub.id}
                             onClick={() => handleCategoryClick(sub.id)}
                             className={`w-full text-left pl-8 pr-3 py-1.5 text-sm rounded-md transition-colors border-l-2 ml-3 border-transparent ${
                               selectedCategory === sub.id ? 'border-blue-500 text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-900 hover:border-slate-300'
                             }`}
                           >
                             {sub.name}
                           </button>
                          ))}
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Mock Specs Filters */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Параметры</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Диаметр / Толщина</label>
                        <div className="grid grid-cols-2 gap-2">
                           <input type="number" placeholder="От" className="border border-slate-200 rounded px-2 py-1.5 text-sm" />
                           <input type="number" placeholder="До" className="border border-slate-200 rounded px-2 py-1.5 text-sm" />
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Марка стали</label>
                        <select className="w-full border border-slate-200 rounded px-2 py-2 text-sm bg-white">
                           <option>Все марки</option>
                           <option>Ст3сп5</option>
                           <option>09Г2С</option>
                           <option>А500С</option>
                        </select>
                     </div>
                  </div>
              </div>
           </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
             
             <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-slate-500 whitespace-nowrap">Сортировка:</span>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white w-full sm:w-auto"
                >
                   <option value="price_asc">Сначала дешевле</option>
                   <option value="price_desc">Сначала дороже</option>
                   <option value="newest">Новинки</option>
                </select>
             </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {products.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
                     <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                     </div>
                     <h3 className="text-lg font-medium text-slate-900">Товары не найдены</h3>
                     <p className="text-slate-500 max-w-sm mx-auto mt-2">Попробуйте изменить параметры фильтрации или поисковый запрос.</p>
                  </div>
               ) : (
                  products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col group relative">
       {/* Image */}
       <Link to={`/product/${product.id}`} className="block relative h-40 bg-slate-100 overflow-hidden">
          <img 
            src={product.image || 'https://via.placeholder.com/300'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {product.region && (
             <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> {product.region}
             </div>
          )}
       </Link>

       <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
             <div className="text-xs text-slate-500 mb-1">{product.gost || 'ГОСТ не указан'}</div>
             <Link to={`/product/${product.id}`}>
               <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px]">
                  {product.name}
               </h3>
             </Link>
          </div>

          {/* Specs Table Mini */}
          <div className="space-y-1 mb-4 text-xs">
             {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-dotted border-slate-200 pb-0.5">
                   <span className="text-slate-500">{key}</span>
                   <span className="font-medium text-slate-700">{val}</span>
                </div>
             ))}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
             <div>
                <span className="block text-xs text-slate-400">Цена за тонну</span>
                <span className="text-lg font-bold text-slate-900">{product.price.toLocaleString('ru-RU')} ₽</span>
             </div>
             <Link to={`/product/${product.id}`} className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
             </Link>
          </div>
       </div>
    </div>
  );
};
