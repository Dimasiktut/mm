
import React, { useEffect, useState } from 'react';
import { User, Lead } from '../types';
import { mockBackend } from '../services/mockBackend';
import { Phone, Calendar, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';

export const SellerOrders: React.FC<{ user: User }> = ({ user }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
     mockBackend.getLeads().then(setLeads);
  }, []);

  const getStatusColor = (status: Lead['status']) => {
     switch(status) {
         case 'NEW': return 'bg-blue-100 text-blue-700';
         case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700';
         case 'DONE': return 'bg-emerald-100 text-emerald-700';
         default: return 'bg-slate-100 text-slate-600';
     }
  };

  const getStatusIcon = (status: Lead['status']) => {
     switch(status) {
         case 'NEW': return <Clock className="w-3 h-3 mr-1" />;
         case 'IN_PROGRESS': return <Clock className="w-3 h-3 mr-1" />;
         case 'DONE': return <CheckCircle className="w-3 h-3 mr-1" />;
         default: return <XCircle className="w-3 h-3 mr-1" />;
     }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Заявки (Лиды)</h1>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {leads.map(lead => (
             <div key={lead.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-start mb-4">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold flex items-center ${getStatusColor(lead.status)}`}>
                      {getStatusIcon(lead.status)} {lead.status}
                   </span>
                   <span className="text-xs text-slate-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> {lead.date}
                   </span>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-1">{lead.productName}</h3>
                <div className="text-sm text-slate-500 mb-4">Объем: <span className="text-slate-900 font-medium">{lead.amount} т</span> • Сумма: ~{(lead.totalPrice || 0).toLocaleString()} ₽</div>

                <div className="pt-4 border-t border-slate-100">
                   <p className="text-xs text-slate-400 uppercase font-bold mb-2">Контакт покупателя</p>
                   <div className="flex justify-between items-center">
                      <div>
                         <p className="font-medium text-slate-900 text-sm">{lead.buyerName}</p>
                         <p className="text-sm text-slate-500">{lead.buyerPhone}</p>
                      </div>
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                         <Phone className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="mt-4 flex gap-2">
                   {lead.status === 'NEW' && (
                       <button className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          Взять в работу
                       </button>
                   )}
                   {lead.status === 'IN_PROGRESS' && (
                       <button className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                          Завершить
                       </button>
                   )}
                   <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};
