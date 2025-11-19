import React from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { AlertCircle, CheckCircle, Clock, FileText, Trophy, TrendingDown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks, currentUser, team } = useApp();

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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl border border-nazir-800 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="relative w-16 h-16 rounded-full border-4 border-slate-50 shadow-md object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-nazir-dark">أهلاً يا هندسة، {currentUser.name} 👋</h1>
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
    </div>
  );
};