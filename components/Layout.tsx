
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
  LogOut,
  Loader2
} from 'lucide-react';
import { User, Role } from '../types';
import { mockBackend } from '../services/mockBackend';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onLogin: (user: User) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('BUYER');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
        let loggedUser: User;
        if (isRegistering) {
            loggedUser = await mockBackend.register(email, password, selectedRole, name, companyName);
        } else {
            loggedUser = await mockBackend.login(email, password);
        }
        
        onLogin(loggedUser);
        setIsLoginModalOpen(false);
        resetForm();

        // Redirect logic
        if (loggedUser.role === 'SELLER') navigate('/seller');
        else if (loggedUser.role === 'ADMIN') navigate('/admin');
        else navigate('/catalog');

    } catch (err: any) {
        console.error(err);
        setAuthError(err.message || 'Ошибка авторизации. Проверьте данные.');
    } finally {
        setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setCompanyName('');
    setAuthError(null);
  };

  const handleProfileClick = () => {
    if (user) {
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
            
            <Link to="/" className="flex items-center flex-shrink-0 group">
                <div className="bg-blue-600 p-2 rounded-lg mr-2 group-hover:bg-blue-700 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-none">МеталлМаркет</h1>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">B2B Платформа</span>
                </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 font-medium text-sm text-slate-600">
                <Link to="/catalog" className="hover:text-blue-600 transition-colors">Каталог</Link>
                <Link to="/promos" className="hover:text-blue-600 transition-colors text-red-500">Акции %</Link>
                <Link to="/suppliers" className="hover:text-blue-600 transition-colors">Поставщики</Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors md:hidden">
                    <Search className="w-6 h-6" />
                </button>

                <div className="hidden sm:flex items-center relative group cursor-pointer mr-2">
                     <ShoppingCart className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                </div>

                {user ? (
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <button 
                            onClick={handleProfileClick}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                                {user.email[0]}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="leading-none max-w-[100px] truncate">{user.name || user.email}</p>
                                <p className="text-[10px] text-slate-400 uppercase mt-0.5">{user.role === 'BUYER' ? 'Покупатель' : 'Продавец'}</p>
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
                        <span>Войти</span>
                    </button>
                )}

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
                <p className="text-sm">Крупнейший B2B маркетплейс металлопроката.</p>
            </div>
            {/* ... footer links ... */}
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; 2024 MetalMarket B2B. Все права защищены.
        </div>
      </footer>

      {/* AUTH MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">
                        {isRegistering ? 'Регистрация' : 'Вход в систему'}
                    </h3>
                    <button 
                        onClick={() => { setIsLoginModalOpen(false); resetForm(); }}
                        className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
                    {authError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {authError}
                        </div>
                    )}

                    {isRegistering && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                type="button" 
                                onClick={() => setSelectedRole('BUYER')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${selectedRole === 'BUYER' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                <UserIcon className="w-6 h-6" />
                                <span className="text-sm font-bold">Покупатель</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setSelectedRole('SELLER')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${selectedRole === 'SELLER' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                <Briefcase className="w-6 h-6" />
                                <span className="text-sm font-bold">Продавец</span>
                            </button>
                        </div>
                    )}

                    {isRegistering && (
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ваше имя</label>
                            <input 
                                required
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Иван Иванов"
                            />
                        </div>
                    )}

                    {isRegistering && selectedRole === 'SELLER' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Название компании</label>
                            <input 
                                required
                                type="text" 
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="ООО Северсталь"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email / Логин</label>
                        <input 
                            required
                            type="text" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="mail@example.com или admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                        <input 
                            required
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="******"
                            minLength={4}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Зарегистрироваться' : 'Войти')}
                    </button>

                    <div className="text-center pt-2">
                        <button 
                            type="button"
                            onClick={() => { setIsRegistering(!isRegistering); resetForm(); }}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
