import React from 'react';
import { TaskStatus } from '../../types';

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles = {
    [TaskStatus.PENDING]: 'bg-slate-100 text-slate-600 border-slate-200',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-700 border-blue-200',
    [TaskStatus.COMPLETED]: 'bg-teal-50 text-teal-700 border-teal-200',
    [TaskStatus.OVERDUE]: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
    [TaskStatus.JUDGEMENT_PENDING]: 'bg-purple-50 text-purple-700 border-purple-200',
    [TaskStatus.FORFEIT_ASSIGNED]: 'bg-orange-50 text-orange-700 border-orange-200',
    [TaskStatus.RESOLVED]: 'bg-green-50 text-green-700 border-green-200',
  };

  const labels = {
    [TaskStatus.PENDING]: 'لسه مجتش',
    [TaskStatus.IN_PROGRESS]: 'شغالين عليها',
    [TaskStatus.COMPLETED]: 'خلصت يا ريس',
    [TaskStatus.OVERDUE]: 'مصيبة (متأخرة)',
    [TaskStatus.JUDGEMENT_PENDING]: 'في مكتب الناظر',
    [TaskStatus.FORFEIT_ASSIGNED]: 'لابس في عقاب',
    [TaskStatus.RESOLVED]: 'عفا الله عما سلف',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]} whitespace-nowrap shadow-sm`}>
      {labels[status]}
    </span>
  );
};