import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart,
  ShieldCheck,
  Search,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Briefcase,
  Shield,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { User, Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onLogin: (role: Role) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginSelection = (role: Role) => {
    onLogin(role);
    setIsLoginModalOpen(false);
    // Redirect based on role
    if (role === 'SELLER') navigate('/seller');
    if (role === 'ADMIN') navigate('/admin');
    if (role === 'BUYER') navigate('/catalog');
  };

  const handleProfileClick = () => {
    if (user) {
        // Redirect to appropriate dashboard
        if (user.role === 'SELLER') navigate('/seller');
        else if (user.role === 'ADMIN') navigate('/admin');
        else navigate('/orders');
    } else {
        setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Bar (Contacts) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex space-x-6">
                <span className="flex items-center"><Phone className="w-3 h-3 mr-1"/> 8 (800) 555-35-35</span>
                <span className="hidden sm:inline">Москва, ул. Сталеваров, 24</span>
            </div>
            <div className="flex space-x-4">
                <Link to="/delivery" className="hover:text-white transition-colors">Доставка</Link>
                <Link to="/about" className="hover:text-white transition-colors">О компании</Link>
            </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
                <div className="bg-blue-600 p-2 rounded-lg mr-2 group-hover:bg-blue-700 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-none">МеталлМаркет</h1>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">B2B Платформа</span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 font-medium text-sm text-slate-600">
                <Link to="/catalog" className="hover:text-blue-600 transition-colors">Каталог</Link>
                <Link to="/promos" className="hover:text-blue-600 transition-colors text-red-500">Акции %</Link>
                <Link to="/suppliers" className="hover:text-blue-600 transition-colors">Поставщики</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search Trigger (Mobile only mostly, or expandable) */}
                <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors md:hidden">
                    <Search className="w-6 h-6" />
                </button>

                <div className="hidden sm:flex items-center relative group cursor-pointer mr-2">
                     <ShoppingCart className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                     <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        2
                     </span>
                </div>

                {user ? (
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <button 
                            onClick={handleProfileClick}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {user.name[0]}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="leading-none">{user.name.split(' ')[0]}</p>
                                <p className="text-[10px] text-slate-400 uppercase mt-0.5">{user.role}</p>
                            </div>
                        </button>
                        <button 
                            onClick={onLogout}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Выйти"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span>Кабинет</span>
                    </button>
                )}

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4">
            <Link to="/catalog" className="block py-2 text-slate-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Каталог</Link>
            <Link to="/promos" className="block py-2 text-red-500 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Акции</Link>
            <Link to="/suppliers" className="block py-2 text-slate-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Поставщики</Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <div className="flex items-center text-white mb-4">
                    <ShieldCheck className="w-6 h-6 mr-2 text-blue-500" />
                    <span className="font-bold text-xl">МеталлМаркет</span>
                </div>
                <p className="text-sm">Крупнейший B2B маркетплейс металлопроката в России. Объединяем производителей и строителей.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Покупателям</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/catalog" className="hover:text-white">Каталог продукции</Link></li>
                    <li><Link to="#" className="hover:text-white">Как сделать заказ</Link></li>
                    <li><Link to="#" className="hover:text-white">Доставка и оплата</Link></li>
                    <li><Link to="#" className="hover:text-white">Возврат товара</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Поставщикам</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link to="#" className="hover:text-white">Стать партнером</Link></li>
                    <li><Link to="#" className="hover:text-white">Тарифы размещения</Link></li>
                    <li><Link to="#" className="hover:text-white">Личный кабинет</Link></li>
                    <li><Link to="#" className="hover:text-white">Правила платформы</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Контакты</h4>
                <ul className="space-y-2 text-sm">
                    <li>support@metalmarket.ru</li>
                    <li>8 (800) 555-35-35</li>
                    <li>Москва, ул. Сталеваров, 24</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; 2024 MetalMarket B2B. Все права защищены.
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Вход в личный кабинет</h3>
                    <button 
                        onClick={() => setIsLoginModalOpen(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-3">
                    <p className="text-slate-500 text-sm mb-4">Выберите тип вашей учетной записи для продолжения:</p>
                    
                    <button 
                        onClick={() => handleLoginSelection('BUYER')}
                        className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div className="ml-4 text-left">
                            <h4 className="font-bold text-slate-900">Я Покупатель</h4>
                            <p className="text-xs text-slate-500 mt-1">Ищу металл, хочу оформить заказ</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleLoginSelection('SELLER')}
                        className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                    >
                        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="ml-4 text-left">
                            <h4 className="font-bold text-slate-900">Я Поставщик</h4>
                            <p className="text-xs text-slate-500 mt-1">Хочу разместить товары и продавать</p>
                        </div>
                    </button>

                    <div className="pt-4 mt-2 border-t border-slate-100 text-center">
                         <button 
                            onClick={() => handleLoginSelection('ADMIN')}
                            className="text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center w-full"
                         >
                            <Shield className="w-3 h-3 mr-1" /> Вход для администратора
                         </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
