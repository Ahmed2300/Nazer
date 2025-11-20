
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, TaskSeverity } from '../types';
import { StatusBadge } from './ui/StatusBadge';
import { Plus, Calendar, MoreVertical, ChevronDown, CheckCircle2, AlertTriangle, Trash2, XCircle } from 'lucide-react';

export const TaskList: React.FC = () => {
  const { tasks, addTask, currentUser, team, updateTaskStatus, deleteTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Form State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    severity: TaskSeverity.MEDIUM,
    deadline: '',
    assigneeId: currentUser?.id || ''
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description || '',
      severity: newTask.severity || TaskSeverity.MEDIUM,
      deadline: new Date(newTask.deadline).toISOString(),
      status: TaskStatus.PENDING,
      assigneeId: newTask.assigneeId || currentUser?.id || 'unknown'
    };

    addTask(task);
    setShowForm(false);
    setNewTask({ 
      title: '', 
      description: '', 
      severity: TaskSeverity.MEDIUM, 
      deadline: '',
      assigneeId: currentUser?.id
    });
  };

  const toggleMenu = (taskId: string) => {
    if (openMenuId === taskId) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(taskId);
    }
  };

  const closeMenu = () => setOpenMenuId(null);

  return (
    <div className="space-y-6 relative min-h-[500px] animate-fade-in">
      {/* Overlay for closing menus */}
      {openMenuId && <div className="fixed inset-0 z-10" onClick={closeMenu}></div>}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-nazir-dark">كراسة الواجب (المهام)</h2>
          <p className="text-slate-500 text-sm mt-1">الواجبات اللي وراك يا بطل</p>
        </div>
        {isAdmin && (
            <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-nazir-dark hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10 active:transform active:scale-95"
            >
            <Plus size={22} /> مهمة جديدة
            </button>
        )}
      </div>

      {/* Creation Form - Only for Admins */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-white p-8 rounded-2xl border border-nazir-800 animate-fade-in space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-nazir-500 via-nazir-accent to-nazir-turquoise"></div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">عنوان المهمة</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 focus:border-nazir-500 focus:outline-none focus:ring-1 focus:ring-nazir-500 transition-all placeholder-slate-400"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="مثال: تصليح البج اللي في اللوجن"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">المتهم (المسؤول)</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 focus:border-nazir-500 focus:outline-none focus:ring-1 focus:ring-nazir-500 appearance-none cursor-pointer"
                  value={newTask.assigneeId}
                  onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}
                >
                  {team.members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ميعاد التسليم</label>
              <input 
                type="datetime-local" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 focus:border-nazir-500 focus:outline-none focus:ring-1 focus:ring-nazir-500"
                onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">مستوى المصيبة</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 focus:border-nazir-500 focus:outline-none focus:ring-1 focus:ring-nazir-500 appearance-none cursor-pointer"
                  value={newTask.severity}
                  onChange={e => setNewTask({...newTask, severity: e.target.value as TaskSeverity})}
                >
                  {Object.values(TaskSeverity).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">التفاصيل</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 focus:border-nazir-500 focus:outline-none focus:ring-1 focus:ring-nazir-500 h-32 resize-none placeholder-slate-400"
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              placeholder="اشرح بالتفصيل الممل عشان ميبقاش ليهم حجة..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-slate-500 hover:text-slate-700 font-bold transition-colors">فكك (إلغاء)</button>
            <button type="submit" className="px-8 py-3 bg-nazir-500 text-white font-bold rounded-lg hover:bg-yellow-600 shadow-lg shadow-nazir-500/20 transition-all">اعتمد يا ريس</button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-4 pb-20">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white">
            <p className="text-xl font-bold text-slate-600 mb-2">مفيش واجبات!</p>
            <p>تقدر تروح بدري النهاردة.</p>
          </div>
        ) : (
          tasks.map(task => {
            const assignee = team.members.find(m => m.id === task.assigneeId);
            const isMenuOpen = openMenuId === task.id;
            
            return (
              <div key={task.id} className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group hover:border-nazir-500/50 transition-all shadow-sm hover:shadow-md relative">
                <div className="flex items-start gap-5 w-full md:w-auto">
                  <div className={`mt-2 w-3 h-3 rounded-full flex-shrink-0 ${
                    task.severity === 'CRITICAL' ? 'bg-red-500 shadow-sm' : 
                    task.severity === 'HIGH' ? 'bg-orange-500' : 'bg-teal-500'
                  }`} title={`Severity: ${task.severity}`} />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-nazir-500 transition-colors">{task.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        <Calendar size={14} className="text-slate-400" /> {new Date(task.deadline).toLocaleDateString('ar-EG')}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        {assignee?.avatar && <img src={assignee.avatar} alt="" className="w-4 h-4 rounded-full" />}
                        <span className={task.assigneeId === currentUser?.id ? 'text-teal-600' : ''}>
                           {assignee ? assignee.name : task.assigneeId}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pl-2 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                  <StatusBadge status={task.status} />
                  
                  {/* Action Menu */}
                  <div className="relative z-20">
                    <button 
                        onClick={() => toggleMenu(task.id)}
                        className={`text-slate-400 hover:text-nazir-500 transition-colors p-2 hover:bg-slate-100 rounded-full ${isMenuOpen ? 'text-nazir-500 bg-slate-100' : ''}`}
                    >
                        <MoreVertical size={20} />
                    </button>
                    
                    {isMenuOpen && (
                        <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                            <button 
                                onClick={() => {
                                    updateTaskStatus(task.id, TaskStatus.COMPLETED);
                                    closeMenu();
                                }}
                                disabled={task.status === TaskStatus.COMPLETED || task.status === TaskStatus.RESOLVED}
                                className="w-full text-right px-4 py-3 text-sm font-bold text-teal-600 hover:bg-teal-50 flex items-center gap-3 border-b border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle2 size={16} /> خلصت بالدليل
                            </button>
                            <button 
                                onClick={() => {
                                    updateTaskStatus(task.id, TaskStatus.OVERDUE);
                                    closeMenu();
                                }}
                                disabled={task.status === TaskStatus.OVERDUE || task.status === TaskStatus.JUDGEMENT_PENDING || task.status === TaskStatus.RESOLVED}
                                className="w-full text-right px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 border-b border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <AlertTriangle size={16} /> استسلم (مصيبة)
                            </button>
                            
                            {/* DELETE BUTTON: ADMIN ONLY */}
                            {isAdmin && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent bubble up issues
                                        if(confirm('متأكد إنك عايز تمسحها؟ الناظر مبينساش.')) {
                                            deleteTask(task.id);
                                            closeMenu();
                                        }
                                    }}
                                    className="w-full text-right px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-red-500 flex items-center gap-3 transition-colors"
                                >
                                    <Trash2 size={16} /> مسح المهمة
                                </button>
                            )}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};