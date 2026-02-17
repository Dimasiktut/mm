
import React, { useEffect, useState } from 'react';
import { Product, User, Category } from '../types';
import { mockBackend } from '../services/mockBackend';
import { Search, Filter, Edit, Trash2, Plus, X, Save, ChevronLeft, Image as ImageIcon } from 'lucide-react';

export const SellerProducts: React.FC<{ user: User }> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: '',
      region: user.region || 'Москва',
      gost: '',
      image: '',
      // Specs
      steelGrade: '',
      diameter: '',
      length: ''
  });

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
        mockBackend.getProducts({ sellerId: user.id }),
        mockBackend.getCategories()
    ]).then(([prodRes, catRes]) => {
        setProducts(prodRes);
        setCategories(catRes);
        setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          // Construct specifications object
          const specs: Record<string, string> = {};
          if (formData.steelGrade) specs['Марка стали'] = formData.steelGrade;
          if (formData.diameter) specs['Диаметр/Толщина'] = formData.diameter;
          if (formData.length) specs['Длина'] = formData.length;

          await mockBackend.createProduct({
              sellerId: user.id,
              name: formData.name,
              categoryId: formData.categoryId,
              price: Number(formData.price),
              stock: Number(formData.stock),
              description: formData.description,
              region: formData.region,
              gost: formData.gost,
              image: formData.image || 'https://images.unsplash.com/photo-1535063406549-defdccf96d18?auto=format&fit=crop&q=80&w=300', // Default image
              tags: [],
              specifications: specs
          });
          
          setIsCreating(false);
          setFormData({
            name: '', categoryId: '', price: '', stock: '', description: '', region: user.region || 'Москва', gost: '', image: '', steelGrade: '', diameter: '', length: ''
          });
          loadData(); // Refresh list
      } catch (error) {
          console.error("Failed to create product", error);
          alert("Ошибка при создании товара");
      }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  const rootCategories = categories.filter(c => !c.parentId);

  if (isCreating) {
      return (
          <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                  <button onClick={() => setIsCreating(false)} className="mr-4 p-2 hover:bg-slate-200 rounded-full transition-colors">
                      <ChevronLeft className="w-6 h-6 text-slate-600" />
                  </button>
                  <h1 className="text-2xl font-bold text-slate-900">Добавление нового товара</h1>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 space-y-8">
                      
                      {/* Basic Info */}
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Основная информация</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="col-span-2">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Название товара <span className="text-red-500">*</span></label>
                                  <input 
                                    required name="name" value={formData.name} onChange={handleInputChange}
                                    type="text" placeholder="Например: Арматура А500С d12 мм" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>

                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Категория <span className="text-red-500">*</span></label>
                                  <select 
                                    required name="categoryId" value={formData.categoryId} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                  >
                                      <option value="">Выберите категорию</option>
                                      {rootCategories.map(root => (
                                          <optgroup key={root.id} label={root.name}>
                                              {categories.filter(c => c.parentId === root.id).map(sub => (
                                                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                                              ))}
                                          </optgroup>
                                      ))}
                                  </select>
                              </div>

                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">ГОСТ / ТУ</label>
                                  <input 
                                    name="gost" value={formData.gost} onChange={handleInputChange}
                                    type="text" placeholder="Например: 34028-2016" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>

                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Цена (руб/т) <span className="text-red-500">*</span></label>
                                  <input 
                                    required name="price" type="number" value={formData.price} onChange={handleInputChange}
                                    placeholder="0" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>

                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Количество на складе (т) <span className="text-red-500">*</span></label>
                                  <input 
                                    required name="stock" type="number" value={formData.stock} onChange={handleInputChange}
                                    placeholder="0" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>

                              <div className="col-span-2">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
                                  <textarea 
                                    name="description" value={formData.description} onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Дополнительная информация о товаре, состоянии, производителе..."
                                  ></textarea>
                              </div>
                          </div>
                      </div>

                      {/* Specs */}
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Характеристики</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Марка стали</label>
                                  <input 
                                    name="steelGrade" value={formData.steelGrade} onChange={handleInputChange}
                                    type="text" placeholder="Ст3сп5, 09Г2С" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Диаметр / Толщина</label>
                                  <input 
                                    name="diameter" value={formData.diameter} onChange={handleInputChange}
                                    type="text" placeholder="12 мм" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Длина / Раскрой</label>
                                  <input 
                                    name="length" value={formData.length} onChange={handleInputChange}
                                    type="text" placeholder="11.7 м, 1500x6000" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Location & Media */}
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Логистика и Фото</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Регион склада</label>
                                  <input 
                                    name="region" value={formData.region} onChange={handleInputChange}
                                    type="text" 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center"><ImageIcon className="w-4 h-4 mr-1"/> Ссылка на изображение</label>
                                  <input 
                                    name="image" value={formData.image} onChange={handleInputChange}
                                    type="url" placeholder="https://..." 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsCreating(false)}
                        className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                      >
                          Отмена
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md shadow-blue-200"
                      >
                          <Save className="w-4 h-4 mr-2" /> Сохранить товар
                      </button>
                  </div>
              </form>
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Мои товары</h1>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
          >
             <Plus className="w-5 h-5 mr-2" /> Добавить товар
          </button>
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
                   <tr><td colSpan={6} className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
                      <p className="mb-2">У вас пока нет товаров</p>
                      <button onClick={() => setIsCreating(true)} className="text-blue-600 font-bold hover:underline">Создать первый товар</button>
                   </td></tr>
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
                            {categories.find(c => c.id === product.categoryId)?.name || product.categoryId}
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
