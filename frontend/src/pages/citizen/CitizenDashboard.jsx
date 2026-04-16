import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import IssueCard from '../../components/issues/IssueCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { Plus, Filter, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────── Status colour map ─────────────── */
const STATUS_META = {
  '':            { color: '#2563eb', bg: '#eff6ff',  border: '#bfdbfe' },
  'Pending':     { color: '#ca8a04', bg: '#fefce8',  border: '#fef08a' },
  'In Progress': { color: '#2563eb', bg: '#eff6ff',  border: '#bfdbfe' },
  'Resolved':    { color: '#16a34a', bg: '#f0fdf4',  border: '#bbf7d0' },
  'Rejected':    { color: '#dc2626', bg: '#fef2f2',  border: '#fecaca' },
};

const filters = [
  { label: 'All Reports', value: '' },
  { label: 'Pending',     value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Resolved',    value: 'Resolved' },
  { label: 'Rejected',    value: 'Rejected' },
];

/* ─────────────── Tiny reusable stat pill ─────────────── */
function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '4px', padding: '14px 24px',
      background: '#f8fafc', borderRadius: '14px',
      border: '1px solid #f1f5f9', minWidth: '90px',
    }}>
      <span style={{ fontSize: '22px', fontWeight: 800, color: color || '#0f172a', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

/* ─────────────── Page ─────────────── */
export default function CitizenDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [page, setPage]     = useState(1);

  const { data: resp, isLoading } = useQuery({
    queryKey: ['my-issues', status, page],
    queryFn: async () => {
      const params = { page, limit: 9 };
      if (status) params.status = status;
      const res = await API.get('/issues/my', { params });
      return res.data;
    },
  });

  const issues     = resp?.data       || [];
  const pagination = resp?.pagination;
  const stats      = resp?.stats      || {};   // optional – pass from API if available

  return (
    <PageWrapper style={{
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)',
      padding: '3.5rem 0 5rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%', maxWidth: '1024px',
          padding: '0 1.5rem',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '2rem',
        }}
      >

        {/* ══════════════════════════════════════
            1. HERO / PROFILE HEADER CARD
        ══════════════════════════════════════ */}
        <div style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 60px -10px rgba(59,130,246,0.09)',
          overflow: 'hidden',
        }}>
          {/* Top accent stripe */}
          <div style={{
            height: '6px',
            background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 50%, #93c5fd 100%)',
          }} />

          <div style={{
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '1.5rem', textAlign: 'center',
          }}>
            {/* Avatar + online dot */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', fontWeight: 800, color: '#fff',
                border: '4px solid #fff',
                boxShadow: '0 0 0 3px #bfdbfe',
              }}>
                <Avatar name={user?.name || ''} size="2xl" />
              </div>
              {/* Online indicator */}
              <div style={{
                position: 'absolute', bottom: '4px', right: '4px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#22c55e', border: '3px solid #fff',
              }} />
            </div>

            {/* Name & subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h1 style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800,
                color: '#0f172a', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1,
              }}>
                My Dashboard
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0, fontWeight: 400 }}>
                Welcome back,{' '}
                <strong style={{ color: '#1e40af', fontWeight: 700 }}>
                  {user?.name?.split(' ')[0]}
                </strong>
                {' '}· Track your civic impact
              </p>
            </div>

            {/* Optional stats row */}
            {(stats.total !== undefined) && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <StatPill label="Total"       value={stats.total     ?? 0} color="#0f172a" />
                <StatPill label="Pending"     value={stats.pending   ?? 0} color="#ca8a04" />
                <StatPill label="In Progress" value={stats.inProgress?? 0} color="#2563eb" />
                <StatPill label="Resolved"    value={stats.resolved  ?? 0} color="#16a34a" />
              </div>
            )}

            {/* CTA Button */}
            <Link to="/issues/new" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', borderRadius: '14px',
                background: '#2563eb', color: '#fff',
                border: 'none', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', letterSpacing: '0.01em',
                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.35)'; }}
              >
                <Plus size={18} strokeWidth={3} /> Report New Issue
              </button>
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════
            2. FILTER BAR CARD
        ══════════════════════════════════════ */}
        <div style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center',
          gap: '1rem', flexWrap: 'wrap',
        }}>
          {/* Filter icon label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#64748b', fontWeight: 700, fontSize: '13px',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            borderRight: '1.5px solid #f1f5f9', paddingRight: '1rem',
            whiteSpace: 'nowrap',
          }}>
            <Filter size={15} strokeWidth={2.5} /> Filter by
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
            {filters.map(f => {
              const active = status === f.value;
              const meta   = STATUS_META[f.value] || STATUS_META[''];
              return (
                <button
                  key={f.value}
                  onClick={() => { setStatus(f.value); setPage(1); }}
                  style={{
                    padding: '8px 18px', borderRadius: '999px',
                    border: active ? `1.5px solid ${meta.border}` : '1.5px solid #f1f5f9',
                    background: active ? meta.bg : '#f8fafc',
                    color: active ? meta.color : '#64748b',
                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    transition: 'all 0.15s',
                    transform: active ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: active ? `0 2px 8px ${meta.border}` : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Count badge */}
          {!isLoading && (
            <div style={{
              marginLeft: 'auto', padding: '7px 16px',
              background: '#f8fafc', borderRadius: '999px',
              border: '1px solid #f1f5f9',
              fontSize: '13px', fontWeight: 700, color: '#475569',
              whiteSpace: 'nowrap',
            }}>
              {pagination?.total ?? issues.length} result{(pagination?.total ?? issues.length) !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            3. CONTENT AREA
        ══════════════════════════════════════ */}
        <div style={{ width: '100%' }}>

          {/* Loading skeletons */}
          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>

          ) : issues.length === 0 ? (

            /* ── Empty State ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#ffffff',
                borderRadius: '24px',
                border: '2px dashed #cbd5e1',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                padding: 'clamp(3rem, 8vw, 6rem) 2rem',
                gap: '1rem',
              }}
            >
              <div style={{
                width: '80px', height: '80px', borderRadius: '22px',
                background: '#eff6ff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transform: 'rotate(4deg)', marginBottom: '8px',
              }}>
                <ClipboardList size={36} color="#2563eb" />
              </div>
              <h3 style={{
                fontSize: '1.75rem', fontWeight: 800, color: '#0f172a',
                margin: 0, letterSpacing: '-0.02em',
              }}>
                No reports found
              </h3>
              <p style={{ color: '#64748b', maxWidth: '400px', margin: '4px 0 16px', lineHeight: 1.65, fontSize: '15px' }}>
                {status === ''
                  ? "You haven't reported any civic issues yet. Help improve your community by submitting your first report."
                  : `You don't have any issues currently marked as "${status}".`}
              </p>
              {status === '' ? (
                <Link to="/issues/new" style={{ textDecoration: 'none' }}>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '13px 28px', borderRadius: '13px',
                    background: '#0f172a', color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.18)',
                  }}>
                    <Plus size={18} strokeWidth={3} /> Start a Report
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => { setStatus(''); setPage(1); }}
                  style={{
                    padding: '12px 26px', borderRadius: '13px',
                    border: '1.5px solid #e2e8f0', background: '#fff',
                    color: '#475569', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                  }}
                >
                  Clear Filters
                </button>
              )}
            </motion.div>

          ) : (

            /* ── Populated Grid ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

              {/* Section heading */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {status === '' ? 'All Reports' : `${status} Reports`}
                </h2>
                <span style={{
                  fontSize: '13px', fontWeight: 600, color: '#64748b',
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                  borderRadius: '999px', padding: '4px 14px',
                }}>
                  {pagination?.total ?? issues.length} total
                </span>
              </div>

              {/* Cards grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1.5rem',
              }}>
                {issues.map((issue, i) => (
                  <IssueCard key={issue._id} issue={issue} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '1rem', flexWrap: 'wrap',
                  background: '#ffffff', borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  padding: '1rem 1.5rem',
                }}>
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page <= 1}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '9px 20px', borderRadius: '11px',
                      border: '1.5px solid #e2e8f0', background: page <= 1 ? '#f8fafc' : '#fff',
                      color: page <= 1 ? '#cbd5e1' : '#374151',
                      fontWeight: 700, fontSize: '14px',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} /> Previous
                  </button>

                  {/* Page numbers */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === '...' ? (
                          <span key={`dot-${idx}`} style={{ padding: '9px 6px', color: '#94a3b8', fontWeight: 600, fontSize: '14px' }}>…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            style={{
                              width: '38px', height: '38px', borderRadius: '10px',
                              border: p === page ? 'none' : '1.5px solid #f1f5f9',
                              background: p === page ? '#2563eb' : '#f8fafc',
                              color: p === page ? '#fff' : '#374151',
                              fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            {p}
                          </button>
                        )
                      )
                    }
                  </div>

                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= pagination.totalPages}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '9px 20px', borderRadius: '11px',
                      border: '1.5px solid #e2e8f0',
                      background: page >= pagination.totalPages ? '#f8fafc' : '#fff',
                      color: page >= pagination.totalPages ? '#cbd5e1' : '#374151',
                      fontWeight: 700, fontSize: '14px',
                      cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Next <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </motion.div>
    </PageWrapper>
  );
}