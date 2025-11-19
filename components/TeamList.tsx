
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, MessageSquare, UserPlus, X, AtSign, Hash, User as UserIcon } from 'lucide-react';

export const TeamList: React.FC = () => {
  const { team, addMember, currentUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [chatId, setChatId] = useState('');

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && handle && chatId) {
      setIsAdding(true);
      await addMember(name.trim(), handle.trim(), chatId.trim());
      setIsAdding(false);
      setShowAddModal(false);
      setName('');
      setHandle('');
      setChatId('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl p-10 border border-nazir-800 text-center relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-nazir-dark mb-3">الكتيبة: {team.name}</h2>
          <p className="text-slate-500 text-lg font-medium">الناظر بيراقب {team.members.length} من العملاء في القسم.</p>
          <div className="flex justify-center gap-4 mt-8">
            <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-lg shadow-sky-500/20 transform hover:-translate-y-0.5">
                <MessageSquare size={20} /> جروب الواتس/تيليجرام
            </button>
            {currentUser?.role === 'ADMIN' && (
              <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-nazir-dark hover:bg-slate-800 text-white px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-lg shadow-slate-900/10 transform hover:-translate-y-0.5"
              >
                  <UserPlus size={20} /> تجنيد عضو جديد
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 opacity-50 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {team.members.map(member => (
          <div key={member.id} className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-5 hover:border-nazir-500/50 transition-colors shadow-sm hover:shadow-md group">
            <div className="relative">
               <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full border-4 border-slate-50 group-hover:border-white transition-all object-cover" />
               {member.role === 'ADMIN' && (
                 <div className="absolute -bottom-1 -left-1 bg-nazir-500 text-white rounded-full p-1 border-2 border-white" title="Admin">
                   <Shield size={14} fill="currentColor" />
                 </div>
               )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-slate-800">{member.name}</h3>
              </div>
              <p className="text-sm text-slate-500 font-mono dir-ltr text-right">{member.telegramHandle}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-50 text-teal-700 px-3 py-1 rounded border border-slate-200">
                  نقاط السمعة: {member.reputationScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal - Only rendered if showAddModal is true, which is only possible for Admins */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative border border-slate-100">
                <button 
                    onClick={() => setShowAddModal(false)}
                    className="absolute top-4 left-4 text-slate-400 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>
                
                <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">تجنيد عضو جديد</h3>
                
                <form onSubmit={handleAddMember} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">الاسم</label>
                        <div className="relative">
                            <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-10 text-slate-800 focus:border-nazir-500 focus:outline-none focus:bg-white transition-colors"
                                placeholder="مثال: كريم كود"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">يوزر تيليجرام</label>
                        <div className="relative">
                            <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={handle}
                                onChange={e => setHandle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-10 text-slate-800 focus:border-nazir-500 focus:outline-none focus:bg-white transition-colors"
                                placeholder="@username"
                                dir="ltr"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Telegram Chat ID</label>
                        <div className="relative">
                            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={chatId}
                                onChange={e => setChatId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-10 text-slate-800 focus:border-nazir-500 focus:outline-none focus:bg-white transition-colors"
                                placeholder="12345678"
                                dir="ltr"
                                required
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            مهم عشان البوت يبعتله رسايل خاصة وصورته تظهر.
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isAdding}
                        className="w-full bg-nazir-dark hover:bg-slate-800 text-white font-bold py-3 rounded-xl mt-2 transition-colors shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isAdding ? (
                           <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             جاري التجنيد وسحب الصورة...
                           </>
                        ) : (
                          "ضم للكتيبة"
                        )}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
