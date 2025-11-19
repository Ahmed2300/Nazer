
import React, { useState } from 'react';
import { User, AtSign, Hash, Info, LogIn } from 'lucide-react';

interface AuthProps {
  onRegister: (name: string, handle: string, chatId: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && handle && chatId) {
      setLoading(true);
      await onRegister(name, handle.startsWith('@') ? handle : `@${handle}`, chatId);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 p-10 rounded-3xl shadow-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-nazir-dark rounded-2xl mx-auto flex items-center justify-center text-3xl font-black text-white shadow-lg mb-4 rotate-3">
            ن
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">تسجيل الدخول</h2>
          <p className="text-slate-500">لو ليك حساب هيدخلك علطول، لو جديد هنسجلك.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اسمك (الشهرة)</label>
            <div className="relative group">
              <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-nazir-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pr-12 pl-4 text-slate-800 focus:border-nazir-500 focus:ring-1 focus:ring-nazir-500 focus:outline-none transition-all placeholder-slate-400 focus:bg-white"
                placeholder="مثال: أحمد جافاسكريبت"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">يوزر تيليجرام</label>
            <div className="relative group">
              <AtSign className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-nazir-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pr-12 pl-4 text-slate-800 focus:border-nazir-500 focus:ring-1 focus:ring-nazir-500 focus:outline-none transition-all placeholder-slate-400 focus:bg-white"
                placeholder="@username"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Telegram User ID</label>
            <div className="relative group">
              <Hash className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-nazir-500 transition-colors" size={20} />
              <input 
                type="number" 
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pr-12 pl-4 text-slate-800 focus:border-nazir-500 focus:ring-1 focus:ring-nazir-500 focus:outline-none transition-all placeholder-slate-400 focus:bg-white"
                placeholder="e.g. 123456789"
                dir="ltr"
                required
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mt-2 border border-blue-100 flex gap-3">
              <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                عشان البوت يعرفك، ابعت <code className="bg-white px-1 rounded text-slate-700 border border-slate-200">/start</code> للبوت ده: <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">@userinfobot</a> وهات الـ ID.
              </p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-nazir-dark hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/10 transition-all transform active:scale-95 text-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'جاري التحميل...' : <> <LogIn size={20} /> دخول / تسجيل </>}
          </button>
        </form>
      </div>
    </div>
  );
};
