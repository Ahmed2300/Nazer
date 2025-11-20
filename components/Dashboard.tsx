
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { AlertCircle, CheckCircle, Clock, FileText, Trophy, TrendingDown, Edit2, X, Save, Upload } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks, currentUser, team, updateUserProfile } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (currentUser) {
        setEditName(currentUser.name);
        setEditPreview(currentUser.avatar);
    }
  }, [currentUser, isEditProfileOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setEditFile(file);
        setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    setIsSavingProfile(true);
    await updateUserProfile(editName.trim(), editFile || undefined);
    setIsSavingProfile(false);
    setIsEditProfileOpen(false);
  };

  if (!currentUser) return null;

  // Stats Calculation
  const pending = tasks.filter(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS).length;
  const completed = tasks.filter(t => t.status === TaskStatus.RESOLVED || t.status === TaskStatus.COMPLETED).length;
  const overdue = tasks.filter(t => t.status === TaskStatus.OVERDUE || t.status === TaskStatus.JUDGEMENT_PENDING).length;

  // Sort team members by score
  const sortedTeam = [...team.members].sort((a, b) => b.reputationScore - a.reputationScore);

  const data = [
    { name: 'لسه بدري', value: pending, color: '#f59e0b' }, // Amber
    { name: 'تمام يا ريس', value: completed, color: '#0d9488' }, // Teal
    { name: 'يا سواد الحلل', value: overdue, color: '#dc2626' }, // Red
  ];

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl border border-nazir-800 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => setIsEditProfileOpen(true)}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="relative w-16 h-16 rounded-full border-4 border-slate-50 shadow-md object-cover transition-transform transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Edit2 size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-nazir-dark">أهلاً يا هندسة، {currentUser.name} 👋</h1>
                <button 
                    onClick={() => setIsEditProfileOpen(true)}
                    className="p-1.5 text-slate-400 hover:text-nazir-500 hover:bg-slate-100 rounded-lg transition-colors"
                    title="تعديل الملف الشخصي"
                >
                    <Edit2 size={16} />
                </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-sm font-bold">سمعتك في الشركة:</span> 
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-sm ${currentUser.reputationScore >= 0 ? 'text-teal-700 bg-teal-50 border border-teal-100' : 'text-red-700 bg-red-50 border border-red-100'}`}>
                    {currentUser.reputationScore} نقطة
                </span>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2">
          <FileText size={18} className="text-nazir-500" />
          طباعة التقرير
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-nazir-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
            <Clock size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold">شغالين عليها</p>
            <p className="text-3xl font-black text-nazir-dark mt-1 font-mono">{pending}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-nazir-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 bg-teal-50 rounded-xl text-teal-600 border border-teal-100">
            <CheckCircle size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold">خلصانة بشياكة</p>
            <p className="text-3xl font-black text-nazir-dark mt-1 font-mono">{completed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-nazir-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 bg-red-50 rounded-xl text-red-600 border border-red-100">
            <AlertCircle size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold">في خطر (تأخير)</p>
            <p className="text-3xl font-black text-nazir-dark mt-1 font-mono">{overdue}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="bg-white p-8 rounded-2xl border border-nazir-800 shadow-sm lg:col-span-1">
          <h3 className="font-bold text-xl text-nazir-dark mb-6 flex items-center gap-2">
            <Trophy className="text-yellow-500 fill-yellow-500" size={20} />
            لوحة الشرف
          </h3>
          <div className="space-y-3">
            {sortedTeam.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                     <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" />
                     {index === 0 && <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">1st</div>}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-nazir-dark">{member.name}</p>
                    <p className="text-xs text-slate-400 dir-ltr text-right">{member.telegramHandle}</p>
                  </div>
                </div>
                <div className="text-right">
                   <span className={`font-mono font-bold text-sm ${member.reputationScore < 0 ? 'text-red-600' : 'text-teal-600'}`}>
                     {member.reputationScore}
                   </span>
                   {member.reputationScore < 0 && <TrendingDown size={14} className="inline mr-1 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Area */}
        <div className="bg-white p-8 rounded-2xl border border-nazir-800 shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="font-bold text-xl text-nazir-dark mb-8">حالة المهام</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right', color: '#1e293b' }}
                  itemStyle={{ color: '#1e293b', fontFamily: 'Cairo', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
             {data.map((item, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                 <span className="text-sm font-medium text-slate-500">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
                <button 
                    onClick={() => setIsEditProfileOpen(false)}
                    className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">تعديل الملف الشخصي</h3>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                    
                    {/* Image Upload */}
                    <div className="flex flex-col items-center justify-center gap-4">
                         <div className="relative w-24 h-24 rounded-full ring-4 ring-slate-50 overflow-hidden shadow-lg">
                             <img src={editPreview || ""} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                         <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2 transition-colors border border-slate-200">
                             <Upload size={16} /> رفع صورة جديدة
                             <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                         </label>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">اسمك (الشهرة)</label>
                        <input 
                            type="text" 
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-nazir-500 focus:outline-none font-bold text-lg text-center"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="opacity-60">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Telegram User</label>
                            <input type="text" value={currentUser.telegramHandle} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-500 text-sm cursor-not-allowed font-mono text-center" dir="ltr" />
                         </div>
                         <div className="opacity-60">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Telegram ID</label>
                            <input type="text" value={currentUser.telegramChatId} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-500 text-sm cursor-not-allowed font-mono text-center" dir="ltr" />
                         </div>
                    </div>
                    
                    <p className="text-xs text-center text-slate-400 bg-slate-50 p-2 rounded-lg">
                        ⚠️ لا يمكن تغيير بيانات التيليجرام لأنها مرتبطة بهويتك.
                    </p>

                    <button 
                        type="submit"
                        disabled={isSavingProfile}
                        className="w-full bg-nazir-dark hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-900/10 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSavingProfile ? (
                           <>
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             جاري الحفظ...
                           </>
                        ) : (
                           <>
                             <Save size={18} /> حفظ التغييرات
                           </>
                        )}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
