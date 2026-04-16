const statusMap = {
  Pending:       'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected:      'bg-red-50 text-red-700 border-red-200',
};
const categoryMap = {
  Roads: '🛣️', Water: '💧', Garbage: '🗑️', Electricity: '⚡', Sanitation: '🧹', Other: '📋',
};
const priorityMap = {
  Low: 'bg-gray-100 text-gray-600', Medium: 'bg-blue-50 text-blue-600',
  High: 'bg-orange-50 text-orange-600', Critical: 'bg-red-50 text-red-700 font-bold',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border ${statusMap[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-50 text-primary-700 border border-primary-200">
      {categoryMap[category] || '📋'} {category}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg ${priorityMap[priority] || ''}`}>
      {priority}
    </span>
  );
}
