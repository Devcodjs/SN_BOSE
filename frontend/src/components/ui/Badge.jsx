const statusMap = {
  Pending:       'bg-amber-500/10 text-amber-700 border-amber-200/80',
  'In Progress': 'bg-blue-500/10 text-blue-700 border-blue-200/80',
  Resolved:      'bg-emerald-500/10 text-emerald-700 border-emerald-200/80',
  Rejected:      'bg-red-500/10 text-red-700 border-red-200/80',
};

const categoryMap = {
  Roads: '🛣️', Water: '💧', Garbage: '🗑️', Electricity: '⚡', Sanitation: '🧹', Other: '📋',
};

const priorityMap = {
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
  Medium: 'bg-sky-50 text-sky-700 border-sky-200',
  High: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
  Critical: 'bg-red-50 text-red-700 border-red-200 font-bold animate-pulse',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${statusMap[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'Resolved' ? 'bg-emerald-500' :
        status === 'In Progress' ? 'bg-blue-500' :
        status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
      }`} />
      {status}
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
      <span className="text-xs">{categoryMap[category] || '📋'}</span> {category}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${priorityMap[priority] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {priority}
    </span>
  );
}

