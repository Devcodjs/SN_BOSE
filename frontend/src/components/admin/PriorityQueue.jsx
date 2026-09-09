import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../services/api';
import PriorityIssueCard from '../priority/PriorityIssueCard';
import PriorityLegend from '../priority/PriorityLegend';
import PriorityInfoPopover from '../priority/PriorityInfoPopover.jsx';
import { SkeletonCard } from '../ui/Skeleton';
import { TrendingUp, CheckCircle2, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRIORITY_LEVELS } from '../../config/priorityConfig';

const FILTERS = [
  { key: 'all', label: 'All', color: null },
  { key: 'critical', label: 'Critical', color: PRIORITY_LEVELS.CRITICAL.color },
  { key: 'high', label: 'High', color: PRIORITY_LEVELS.HIGH.color },
  { key: 'medium', label: 'Medium', color: PRIORITY_LEVELS.MEDIUM.color },
  { key: 'low', label: 'Low', color: PRIORITY_LEVELS.LOW.color },
];

const SORT_OPTIONS = [
  { key: 'priority', label: 'Priority' },
  { key: 'newest', label: 'Newest' },
  { key: 'upvotes', label: 'Most upvoted' },
];

export default function PriorityQueue() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, critical, high, medium, low
  const [sortBy, setSortBy] = useState('priority');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Debounce the search box so we're not hammering the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading } = useQuery({
    queryKey: ['adminIssues', 'priorityQueue', filter, sortBy, search, page],
    queryFn: async () => {
      let url = `/admin/issues?page=${page}&limit=12&isDuplicate=false&status=Pending`;
      url += sortBy === 'newest' ? '' : `&sort=${sortBy}`;
      if (filter !== 'all') {
        url += `&priority=${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
      }
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await API.get(url);
      return res.data;
    }
  });

  // Lightweight counts for each filter tab — reuses the same endpoint
  // (limit=1, we only need pagination.totalItems), no backend changes.
  const { data: countsData } = useQuery({
    queryKey: ['adminIssues', 'priorityQueueCounts'],
    queryFn: async () => {
      const results = await Promise.all(
        FILTERS.map(f => {
          const p = f.key === 'all' ? '' : `&priority=${f.label}`;
          return API.get(`/admin/issues?page=1&limit=1&isDuplicate=false&status=Pending${p}`);
        })
      );
      const counts = {};
      FILTERS.forEach((f, i) => { counts[f.key] = results[i].data?.pagination?.totalItems ?? 0; });
      return counts;
    },
    staleTime: 30000,
  });

  const issues = data?.data || [];
  const pagination = data?.pagination;
  const totalActive = countsData?.all ?? pagination?.totalItems;

  return (
    <div className="flex flex-col gap-5">
      {/* ── PAGE HEADER ── */}
      <div
        className="bg-white rounded-xl border border-gray-200/80 flex items-start justify-between gap-4 flex-wrap"
        style={{ padding: '3mm' }}
      >
        <div>
          <h2 className="text-[26px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <TrendingUp size={22} className="text-primary-600" />
            Priority Queue
          </h2>
          <p className="text-[13px] text-gray-500 mt-1 max-w-xl">
            AI-ranked community reports based on severity, corroboration, upvotes and report age.
          </p>
          <div className="mt-2">
            <PriorityInfoPopover />
          </div>
        </div>

        {typeof totalActive === 'number' && (
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-gray-900 font-mono tabular-nums">{totalActive}</div>
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Active issues</div>
          </div>
        )}
      </div>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
        {FILTERS.map(f => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[9px] text-[13px] font-semibold whitespace-nowrap transition-colors border ${
                active
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {f.color && (
                <span
                  className="w-[7px] h-[7px] rounded-full shrink-0"
                  style={{ backgroundColor: active ? '#fff' : f.color }}
                />
              )}
              {f.label}
              <span className={active ? 'text-white/80' : 'text-gray-400'}>
                {countsData ? countsData[f.key] ?? 0 : '…'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── COMPACT PRIORITY OVERVIEW ── */}
      <PriorityLegend />

      {/* ── TOOLBAR ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search issues..."
            className="w-full pl-10 pr-3.5 py-2.5 text-[13px] rounded-[9px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-shadow"
          />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[13px] text-gray-400 whitespace-nowrap">
            {pagination?.totalItems ?? 0} issues · Sorted by {SORT_OPTIONS.find(o => o.key === sortBy)?.label.toLowerCase()}
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="appearance-none pl-3.5 pr-9 py-2.5 text-[13px] font-medium rounded-[9px] border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.key} value={o.key}>Sort by: {o.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
          <CheckCircle2 size={40} className="text-emerald-400 mb-3 opacity-60" />
          <h3 className="text-[15px] font-bold text-gray-900">No issues found</h3>
          <p className="text-[13px] text-gray-500 max-w-md mt-1.5">
            There are no issues matching this priority level{search ? ' or search' : ''} right now.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {issues.map((issue, i) => (
              <PriorityIssueCard key={issue._id} issue={issue} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="text-[13px] font-medium text-gray-500">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
