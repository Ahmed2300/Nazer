
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, LogIn, Hash, ArrowRight, LogOut } from 'lucide-react';

export const TeamSelection: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => {
  const { currentUser, userTeams, selectTeam, joinTeamById, signOut } = useApp();
  const [joinId, setJoinId] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinId) return;
    setLoading(true);
    setError('');
    
    const success = await joinTeamById(joinId);
    if (!success) {
      setError('الكتيبة دي مش موجودة. اتأكد من الـ Channel ID.');
    } else {
      setShowJoinModal(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
             <img src={currentUser?.avatar} alt="Profile" className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" />
             <div>
                <h1 className="text-3xl font-black text-slate-800">أهلاً يا {currentUser?.name}</h1>
                <p className="text-slate-500 font-medium">اختار الكتيبة (الروم) اللي عايز تدخلها</p>
             </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
               onClick={() => setShowJoinModal(true)}
               className="bg-white border border-slate-200 hover:border-nazir-500 hover:text-nazir-500 text-slate-600 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
               <LogIn size={20} /> انضمام لكتيبة
            </button>
            <button 
               onClick={onCreateNew}
               className="bg-nazir-dark hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10"
            >
               <Plus size={20} /> تأسيس كتيبة جديدة
            </button>
            <button 
               onClick={signOut}
               className="bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 font-bold py-3 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm"
               title="تسجيل خروج"
            >
               <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        {userTeams.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {userTeams.map(team => (
               <div 
                  key={team.id} 
                  onClick={() => selectTeam(team.id)}
                  className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-nazir-500 cursor-pointer transition-all group relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-nazir-500 transition-colors"></div>
                  <div className="flex items-start justify-between mb-4">
                     <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-nazir-500 transition-colors overflow-hidden">
                        {team.image ? (
                           <img src={team.image} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                           <Users size={24} />
                        )}
                     </div>
                     <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg dir-ltr">{team.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{team.name}</h3>
                  <p className="text-sm text-slate-400 mb-6">{team.memberCount} عميل في القسم</p>
                  
                  <div className="flex justify-end">
                    <span className="text-nazir-500 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                        دخول <ArrowRight size={16} />
                    </span>
                  </div>
               </div>
             ))}
           </div>
        ) : (
           <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <Users size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-700 mb-2">لسا مفيش كتايب</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">أنت لسه مدخلتش أي تيم. ابدأ بإنشاء كتيبة جديدة أو انضم لكتيبة موجودة.</p>
              <button 
                 onClick={onCreateNew}
                 className="bg-nazir-500 hover:bg-nazir-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-nazir-500/20 transition-all"
              >
                 تأسيس أول كتيبة
              </button>
           </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">انضمام لكتيبة موجودة</h3>
                    <form onSubmit={handleJoin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Channel / Group ID</label>
                            <div className="relative">
                                <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={joinId}
                                    onChange={e => setJoinId(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 text-slate-800 focus:border-nazir-500 focus:outline-none dir-ltr"
                                    placeholder="-100123456"
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
                        
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowJoinModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">إلغاء</button>
                            <button type="submit" disabled={loading} className="flex-1 bg-nazir-dark text-white font-bold py-3 rounded-xl disabled:opacity-50">
                                {loading ? 'جاري البحث...' : 'دخول'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
    