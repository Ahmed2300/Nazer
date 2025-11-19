import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ListTodo, 
  Gavel, 
  Users, 
  LogOut,
  ArrowLeft
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitTeam?: () => void; // New prop
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onExitTeam }) => {
  const { currentUser, team, signOut } = useApp();
  
  const navItems = [
    { id: 'dashboard', label: 'مكتب الناظر', icon: LayoutDashboard },
    { id: 'tasks', label: 'كراسة الواجب', icon: ListTodo },
    { id: 'judgement', label: 'المجلس التأديبي', icon: Gavel, alert: true },
    { id: 'team', label: 'أعضاء هيئة التدريس', icon: Users },
  ];

  return (
    <div className="flex h-screen w-full bg-nazir-950 text-nazir-dark overflow-hidden font-sans selection:bg-nazir-500/20 selection:text-nazir-500">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 bg-white border-l border-nazir-800 flex flex-col transition-all duration-300 relative z-20 shadow-sm">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-6 border-b border-nazir-800">
          <div className="relative group">
            <img 
              src={team.image || "https://iili.io/fdrDZrB.png"} 
              alt="Team Logo" 
              className="w-12 h-12 rounded-xl shadow-md ml-3 object-cover border border-slate-100" 
            />
          </div>
          <div className="hidden lg:flex flex-col">
             <span className="font-black text-xl tracking-wide text-nazir-dark">الناظر</span>
             <span className="text-xs text-slate-500 font-medium truncate max-w-[140px]">{team.name}</span>
          </div>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-slate-100 text-nazir-500 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-nazir-500'
              }`}
            >
              <div className="relative">
                <item.icon size={24} className={activeTab === item.id ? 'stroke-2' : 'stroke-1.5'} />
                {item.alert && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white" />}
              </div>
              <span className="hidden lg:block font-bold text-base">{item.label}</span>
              {activeTab === item.id && (
                <div className="hidden lg:block mr-auto w-1.5 h-4 rounded-full bg-nazir-500" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-nazir-800 space-y-2">
          <button 
             onClick={onExitTeam}
             className="flex items-center justify-center lg:justify-start w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-nazir-dark transition-colors gap-3"
          >
             <ArrowLeft size={20} />
             <span className="hidden lg:block text-sm font-bold">تغيير الكتيبة</span>
          </button>
          <button 
            onClick={signOut}
            className="flex items-center justify-center lg:justify-start w-full p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors gap-3"
          >
            <LogOut size={20} />
            <span className="hidden lg:block text-sm font-bold">هروب (خروج)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50/50">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur border-b border-nazir-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-2xl font-extrabold text-nazir-dark tracking-tight">
            {navItems.find(n => n.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">نقاط السمعة</span>
               <span className={`text-lg font-black font-mono ${(currentUser?.reputationScore || 0) < 0 ? 'text-red-500' : 'text-nazir-turquoise'}`}>
                 {currentUser?.reputationScore || 0}
               </span>
             </div>
             <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-nazir-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <img 
                  src={currentUser?.avatar || "https://ui-avatars.com/api/?name=User&background=f1f5f9&color=1e293b"} 
                  alt="Profile" 
                  className="relative w-11 h-11 rounded-full ring-2 ring-white shadow-sm object-cover" 
                />
             </div>
          </div>
        </header>
        

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};