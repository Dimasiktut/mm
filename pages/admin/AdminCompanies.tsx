
import React, { useEffect, useState } from 'react';
import { User, VerificationStatus } from '../../types';
import { mockBackend } from '../../services/mockBackend';
import { CheckCircle, XCircle, Shield, Building2, Search, MoreHorizontal, FileText } from 'lucide-react';

export const AdminCompanies: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const data = await mockBackend.getAllUsers('SELLER');
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (userId: string, status: VerificationStatus, isBlocked: boolean) => {
      if(!window.confirm(`Вы уверены, что хотите изменить статус на ${status}?`)) return;
      await mockBackend.updateUserStatus(userId, status, isBlocked);
      loadData();
  };

  const getStatusBadge = (status?: VerificationStatus) => {
      switch(status) {
          case 'VERIFIED': return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1"/> Подтвержден</span>;
          case 'PENDING': return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200 flex items-center w-fit"><Shield className="w-3 h-3 mr-1"/> На проверке</span>;
          case 'REJECTED': return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200 flex items-center w-fit"><XCircle className="w-3 h-3 mr-1"/> Отклонен</span>;
          case 'BLOCKED': return <span className="px-2 py-1 rounded bg-slate-800 text-white text-xs font-bold flex items-center w-fit">Заблокирован</span>;
          default: return <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs font-bold">Новый</span>;
      }
  };

  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(filter.toLowerCase()) || 
     u.companyName?.toLowerCase().includes(filter.toLowerCase()) ||
     u.email.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">Компании и Верификация</h1>
             <p className="text-slate-500">Управление юридическими лицами и статусами поставщиков</p>
          </div>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex gap-4">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Поиск по названию, ИНН или email..." 
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
             <div className="flex gap-2">
                 <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Фильтр: На проверке</button>
             </div>
          </div>

          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                   <th className="px-6 py-4">Компания / Пользователь</th>
                   <th className="px-6 py-4">Реквизиты (ИНН)</th>
                   <th className="px-6 py-4">Статус</th>
                   <th className="px-6 py-4">Документы</th>
                   <th className="px-6 py-4 text-right">Действия</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                   <tr><td colSpan={5} className="p-6 text-center">Загрузка...</td></tr>
                ) : filteredUsers.length === 0 ? (
                   <tr><td colSpan={5} className="p-6 text-center text-slate-500">Ничего не найдено</td></tr>
                ) : (
                   filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                  {user.companyName?.[0] || <Building2 className="w-5 h-5"/>}
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900">{user.companyName || 'Без названия'}</p>
                                  <p className="text-xs text-slate-400">{user.name} • {user.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 font-mono text-slate-600">
                            {user.inn || <span className="text-red-400 italic">Не указан</span>}
                         </td>
                         <td className="px-6 py-4">
                            {getStatusBadge(user.verificationStatus)}
                         </td>
                         <td className="px-6 py-4">
                            <button className="flex items-center text-blue-600 hover:underline text-xs">
                               <FileText className="w-3 h-3 mr-1" /> Сканы (0)
                            </button>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               {user.verificationStatus === 'PENDING' && (
                                   <>
                                     <button 
                                        onClick={() => handleStatusChange(user.id, 'VERIFIED', false)}
                                        className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200" title="Подтвердить"
                                     >
                                         <CheckCircle className="w-4 h-4" />
                                     </button>
                                     <button 
                                        onClick={() => handleStatusChange(user.id, 'REJECTED', false)}
                                        className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Отклонить"
                                     >
                                         <XCircle className="w-4 h-4" />
                                     </button>
                                   </>
                               )}
                               <button className="p-1.5 text-slate-400 hover:text-slate-600">
                                  <MoreHorizontal className="w-4 h-4" />
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
