
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SellerLayout } from './components/SellerLayout';
import { ExcelUploader } from './components/ExcelUploader';
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerProducts } from './pages/SellerProducts';
import { SellerOrders } from './pages/SellerOrders';
import { SellerProfile } from './pages/SellerProfile';
import { BuyerCatalog } from './pages/BuyerCatalog';
import { BuyerHome } from './pages/BuyerHome';
import { ProductDetail } from './pages/ProductDetail';
import { AdminArchitecture } from './pages/AdminArchitecture';
import { User, Role } from './types';
import { mockBackend } from './services/mockBackend';

const ProtectedRoute: React.FC<{ user: User | null; allowedRoles?: Role[]; children: React.ReactNode }> = ({ user, allowedRoles, children }) => {
    if (!user) return <Navigate to="/" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return <>{children}</>;
};

const AppContent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on load
        const initSession = async () => {
            try {
                const sessionUser = await mockBackend.getSession();
                setUser(sessionUser);
            } catch (e) {
                console.error("Session check failed", e);
            } finally {
                setIsLoading(false);
            }
        };
        initSession();
    }, []);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = async () => {
        await mockBackend.logout();
        setUser(null);
    };

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <Routes>
            {/* PUBLIC & BUYER AREA */}
            <Route element={<Layout user={user} onLogout={handleLogout} onLogin={handleLogin}><Outlet /></Layout>}>
                <Route path="/" element={<BuyerHome />} />
                <Route path="/catalog" element={<BuyerCatalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/promos" element={<div className="p-8 text-center text-slate-500">Страница акций</div>} />
                <Route path="/suppliers" element={<div className="p-8 text-center text-slate-500">Список поставщиков</div>} />
                <Route path="/delivery" element={<div className="p-8 text-center text-slate-500">Информация о доставке</div>} />
                <Route path="/about" element={<div className="p-8 text-center text-slate-500">О компании</div>} />
                
                {/* Buyer Account */}
                <Route path="/orders" element={
                    <ProtectedRoute user={user} allowedRoles={['BUYER']}>
                         <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm min-h-[400px]">
                            <h2 className="text-2xl font-bold mb-4">Мои заказы</h2>
                            <p className="text-slate-500">История заказов пуста.</p>
                         </div>
                    </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                 <Route path="/admin" element={
                     <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
                        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm min-h-[400px]">
                            <h2 className="text-2xl font-bold mb-4">Панель администратора</h2>
                        </div>
                    </ProtectedRoute>
                } />
                 <Route path="/admin/architecture" element={
                     <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
                        <AdminArchitecture />
                    </ProtectedRoute>
                } />
            </Route>

            {/* SELLER AREA */}
            <Route path="/seller" element={
                <ProtectedRoute user={user} allowedRoles={['SELLER']}>
                    <SellerLayout user={user} onLogout={handleLogout}><Outlet /></SellerLayout>
                </ProtectedRoute>
            }>
                <Route index element={user && <SellerDashboard user={user} />} />
                <Route path="products" element={user && <SellerProducts user={user} />} />
                <Route path="orders" element={user && <SellerOrders user={user} />} />
                <Route path="profile" element={user && <SellerProfile user={user} />} />
                <Route path="import" element={user && <div className="space-y-6"><h2 className="text-2xl font-bold text-slate-900">Массовый импорт товаров</h2><ExcelUploader sellerId={user.id} /></div>} />
                <Route path="*" element={<div className="p-10 text-slate-400">Раздел в разработке</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
