import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, Forfeit } from '../types';
import { generateJudgement } from '../services/geminiService';
import { Gavel, AlertTriangle, Skull, Upload, CheckCircle2, Send, RefreshCw, Check } from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';

export const JudgementHall: React.FC = () => {
  const { tasks, team, assignForfeits, selectForfeit, submitProof, updateTaskStatus } = useApp();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [proofFiles, setProofFiles] = useState<Record<string, string>>({});

  const overdueTasks = tasks.filter(t => t.status === TaskStatus.OVERDUE);
  const judgementPendingTasks = tasks.filter(t => t.status === TaskStatus.JUDGEMENT_PENDING);
  const forfeitActiveTasks = tasks.filter(t => t.status === TaskStatus.FORFEIT_ASSIGNED);

  const handleSummonJudgement = async (task: Task) => {
    setLoadingId(task.id);
    try {
      // Find the user to pass their name for gender detection
      const assignee = team.members.find(m => m.id === task.assigneeId);
      const assigneeName = assignee ? assignee.name : 'المتهم';
      
      const forfeits = await generateJudgement(task, assigneeName);
      
      // This will now Auto-Publish to Telegram (silent flag removed from context)
      assignForfeits(task.id, forfeits);
    } catch (e) {
      alert('الناظر بيشرب قهوة وسيجارة، جرب كمان شوية.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleFileUpload = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProofFiles(prev => ({ ...prev, [taskId]: url }));
    }
  };

  const handleSubmitProof = (taskId: string) => {
    if (proofFiles[taskId]) {
      submitProof(taskId, proofFiles[taskId]);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-white rounded-2xl p-10 border border-red-100 overflow-hidden shadow-lg group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-bl-full z-0"></div>
        <div className="absolute top-0 left-0 opacity-5 transform -translate-x-10 -translate-y-10 text-red-600">
          <Gavel size={250} />
        </div>
        <div className="relative z-10">
            <h1 className="text-4xl font-black text-nazir-dark mb-3">المجلس التأديبي <span className="text-red-600">(سلخانة الناظر)</span></h1>
            <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-medium">
            دخلت برجلك يا بطل. هنا مفيش رحمة. الناظر مش بس هيعاقبك، الناظر هيفضحك ويخليك "تريند" في المكتب. 
            استعد لدفع ثمن تأخيرك من كرامتك.
            </p>
        </div>
      </div>

      {/* 1. Overdue Tasks */}
      <section>
        <h3 className="text-2xl font-bold text-nazir-dark mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
          <AlertTriangle className="text-red-500" /> 
          قضايا تنتظر النطق بالحكم
          <span className="text-sm font-normal text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">({overdueTasks.length})</span>
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {overdueTasks.length === 0 && (
            <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 bg-white">
              مفيش حد متأخر النهاردة.. شكلكم مرعوبين من الفضيحة!
            </div>
          )}
          {overdueTasks.map(task => (
            <div key={task.id} className="bg-white border border-red-100 p-6 rounded-2xl shadow-md hover:border-red-300 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-red-500"></div>
              <div className="flex justify-between items-start mb-4 pl-2">
                <StatusBadge status={task.status} />
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded border border-red-100">كارثة: {task.severity}</span>
              </div>
              <h4 className="font-bold text-xl text-slate-800 mb-2">{task.title}</h4>
              <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{task.description}</p>
              
              <button
                onClick={() => handleSummonJudgement(task)}
                disabled={loadingId === task.id}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
              >
                {loadingId === task.id ? (
                  <>
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span className="text-sm">الناظر بيسن سكاكينه...</span>
                  </>
                ) : (
                  <>
                    <Gavel size={20} /> استدعاء الناظر
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Select Forfeit */}
      {judgementPendingTasks.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-nazir-dark mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
            <Skull className="text-purple-600" /> 
            لحظة الذل (اختار عقابك)
          </h3>
          <div className="space-y-8">
            {judgementPendingTasks.map(task => (
              <div key={task.id} className="bg-white border border-purple-100 p-8 rounded-2xl relative shadow-lg">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6 gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-purple-700">المتهم في قضية: {task.title}</h4>
                      <p className="text-base text-slate-500 mt-1">
                          تم إرسال الخيارات للمتهم وللجروب تلقائياً. في انتظار اختيار العقاب.
                      </p>
                    </div>

                    {/* Control Bar */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleSummonJudgement(task)}
                            disabled={loadingId === task.id}
                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-nazir-dark hover:border-slate-300 rounded-xl font-bold flex items-center gap-2 transition-all text-sm shadow-sm disabled:opacity-50"
                        >
                            {loadingId === task.id ? <div className="animate-spin w-4 h-4 border-2 border-slate-400 rounded-full border-t-transparent" /> : <RefreshCw size={16} />}
                            تغيير القاضي
                        </button>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl border border-green-100 font-bold text-sm">
                            <Check size={16} /> تم الإرسال تلقائياً
                         </div>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {task.generatedForfeits?.map((forfeit, idx) => (
                    <div 
                      key={forfeit.id}
                      onClick={() => selectForfeit(task.id, forfeit.id)}
                      className="cursor-pointer bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-purple-50 p-6 rounded-xl transition-all flex flex-col gap-3 group shadow-sm hover:-translate-y-1"
                    >
                      <div className="flex justify-between">
                        <span className="text-xs font-bold bg-white text-purple-600 px-3 py-1 rounded-full shadow-sm border border-purple-100">طريقة الإذلال رقم {idx + 1}</span>
                      </div>
                      <h5 className="font-bold text-xl text-slate-800 group-hover:text-purple-800 mt-2">{forfeit.title}</h5>
                      <p className="text-sm text-slate-500 leading-relaxed">{forfeit.description}</p>
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <p className="text-xs text-purple-600/80 italic flex items-center gap-2 font-semibold">
                           🔥 قصف جبهة: "{forfeit.wittiness}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Active Forfeits */}
      {forfeitActiveTasks.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-nazir-dark mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
            <Upload className="text-orange-500" /> 
            توثيق الفضيحة (الإثبات)
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {forfeitActiveTasks.map(task => (
              <div key={task.id} className="bg-white border border-orange-100 p-6 rounded-2xl relative overflow-hidden shadow-lg">
                <div className="absolute top-0 left-0 p-4 opacity-5 text-orange-500">
                  <Skull size={150} />
                </div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <StatusBadge status={task.status} />
                  </div>
                  <h4 className="font-bold text-xl text-slate-800 mb-2">{task.title}</h4>
                  
                  <div className="bg-orange-50 rounded-xl p-5 my-5 border border-orange-200">
                    <span className="text-xs text-orange-600 font-bold block mb-2 uppercase tracking-wider">العقاب المختار</span>
                    <p className="text-lg text-slate-800 font-bold mb-1">{task.selectedForfeit?.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{task.selectedForfeit?.description}</p>
                  </div>

                  {proofFiles[task.id] ? (
                    <div className="space-y-4 animate-fade-in">
                       <div className="h-48 w-full bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 relative group">
                          <img src={proofFiles[task.id]} alt="Proof" className="h-full w-auto object-contain" />
                       </div>
                       <button 
                        onClick={() => handleSubmitProof(task.id)}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all transform active:scale-95"
                       >
                        <CheckCircle2 size={18} /> تسليم للأرشيف
                       </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group bg-slate-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-slate-400 group-hover:text-orange-500 transition-colors" />
                        <p className="text-sm text-slate-500 font-medium">ارفع دليل تنفيذ العقاب</p>
                        <p className="text-xs text-slate-400 mt-1 group-hover:text-slate-600">صورة أو فيديو يثبت إنك اتفضحـ.. قصدي نفذت الحكم</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(task.id, e)} />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};