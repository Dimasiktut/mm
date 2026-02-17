
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  Layers, 
  Filter, 
  Tags, 
  MessageSquare, 
  Upload, 
  AlertOctagon, 
  Wallet, 
  BarChart2, 
  Users, 
  Settings, 
  ScrollText,
  LogOut,
  Bell,
  Search,
  ShieldAlert
} from 'lucide-react';
import { User } from '../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Building2, label: 'Компании', path: '/admin/companies' },
  { icon: Package, label: 'Товары', path: '/admin/products' },
  { icon: Layers, label: 'Категории', path: '/admin/categories' },
  { icon: Filter, label: 'Фильтры', path: '/admin/filters' },
  { icon: Tags, label: 'Теги', path: '/admin/tags' },
  { icon: MessageSquare, label: 'Отзывы', path: '/admin/reviews' },
  { icon: Upload, label: 'Импорты Excel', path: '/admin/imports' },
  { icon: AlertOctagon, label: 'Жалобы', path: '/admin/complaints' },
  { icon: Wallet, label: 'Платежи', path: '/admin/finance' },
  { icon: BarChart2, label: 'Аналитика', path: '/admin/analytics' },
  { icon: Users, label: 'Пользователи', path: '/admin/users' },
  { icon: Settings, label: 'Настройки', path: '/admin/settings' },
  { icon: ScrollText, label: 'Логи', path: '/admin/logs' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* Sidebar - Dark Theme */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
           <ShieldAlert className="w-6 h-6 text-red-500 mr-2" />
           <span className="text-white font-bold text-lg tracking-wider">ADMIN<span className="text-slate-500">PANEL</span></span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
           <p className="px-6 text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Модули</p>
           <nav className="space-y-0.5 px-3">
              {MENU_ITEMS.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                    `}
                  >
                    <item.icon className={`w-4 h-4 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
           </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center font-bold border border-red-600/30">
                 A
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">Super Admin</p>
                 <p className="text-[10px] text-slate-500 truncate">admin@metalmarket.ru</p>
              </div>
              <button onClick={onLogout} className="ml-auto text-slate-500 hover:text-white">
                  <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
           <div className="flex items-center gap-4 w-1/3">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                 type="text" 
                 placeholder="Быстрый поиск (ID, Название, Email)..." 
                 className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
              />
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-xs font-bold text-slate-600">System Online</span>
              </div>
              
              <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
           </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-8">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
};
