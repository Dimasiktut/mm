
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Upload, 
  MessageSquare, 
  BarChart, 
  Megaphone, 
  Wallet, 
  Building, 
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface SellerLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Дашборд', path: '/seller' },
  { icon: Package, label: 'Мои товары', path: '/seller/products' },
  { icon: Upload, label: 'Импорт Excel', path: '/seller/import' },
  { icon: MessageSquare, label: 'Заявки (Лиды)', path: '/seller/orders', badge: '3' },
  { icon: BarChart, label: 'Статистика', path: '/seller/stats' },
  { icon: Megaphone, label: 'Продвижение', path: '/seller/promo' },
  { icon: Wallet, label: 'Финансы', path: '/seller/finance' },
  { icon: Building, label: 'Профиль компании', path: '/seller/profile' },
  { icon: Settings, label: 'Настройки', path: '/seller/settings' },
];

export const SellerLayout: React.FC<SellerLayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      
      {/* Dark Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="text-white font-bold text-xl flex items-center">
             <span className="text-blue-500 mr-2">Metal</span>Market
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
           <nav className="space-y-1 px-3">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                    `}
                  >
                    <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                       <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2">
                         {item.badge}
                       </span>
                    )}
                  </Link>
                );
              })}
           </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                 {user.companyName?.[0] || user.name[0]}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">{user.companyName || user.name}</p>
                 <p className="text-xs text-slate-500 truncate">ID: {user.id}</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
           {/* Breadcrumbs (Simple simulation) */}
           <div className="flex items-center text-sm text-slate-500">
              <span className="font-medium text-slate-800">Кабинет</span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="capitalize">{location.pathname.split('/').pop() || 'Дашборд'}</span>
           </div>

           <div className="flex items-center gap-6">
              {/* Search (In-cabinet) */}
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Поиск..." 
                    className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                 />
              </div>

              {/* Balance */}
              <div className="hidden md:flex flex-col items-end mr-4 border-r border-slate-200 pr-6">
                 <span className="text-xs text-slate-500">Баланс</span>
                 <span className="text-sm font-bold text-slate-900">
                    {user.balance ? user.balance.toLocaleString('ru-RU') : '0'} ₽
                 </span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
           </div>
        </header>

        {/* Content Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
           {children}
        </main>

      </div>
    </div>
  );
};
