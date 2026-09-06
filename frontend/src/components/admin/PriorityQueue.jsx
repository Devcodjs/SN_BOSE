import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../services/api';
import IssueCard from '../issues/IssueCard';
import { SkeletonCard } from '../ui/Skeleton';
import { AlertTriangle, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import PriorityLegend from '../priority/PriorityLegend';

export default function PriorityQueue() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, critical, high, medium, low

  const { data, isLoading } = useQuery({
    queryKey: ['adminIssues', 'priorityQueue', filter, page],
    queryFn: async () => {
      let url = `/admin/issues?page=${page}&limit=12&sort=priority&isDuplicate=false&status=Pending`;
      if (filter !== 'all') {
        url += `&priority=${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
      }
      const res = await API.get(url);
      return res.data;
    }
  });

  const issues = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-7 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={22} className="text-primary-600" />
            Priority Queue
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Issues automatically sorted by AI Priority Engine (Severity + Corroboration + Upvotes + Age).
          </p>
        </div>

        <div className="flex gap-[18px] bg-gray-100 p-1 rounded-lg">
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md capitalize transition-all ${filter === f
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <PriorityLegend />

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
          <CheckCircle2 size={48} className="text-emerald-400 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-gray-900">Queue is Clear</h3>
          <p className="text-gray-500 max-w-md mt-2">
            There are no pending {filter !== 'all' ? filter : ''} priority issues requiring attention right now.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {issues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 font-semibold disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 font-semibold disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}