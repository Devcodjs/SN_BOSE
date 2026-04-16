import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import API from '../../services/api';
import PageWrapper from '../../components/layout/PageWrapper';
import { StatusBadge, CategoryBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import KPICard from '../../components/charts/KPICard';
import { SkeletonStats, SkeletonRow } from '../../components/ui/Skeleton';
import { BarChart3, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/* ─── tiny reusable select ──────────────────────────────────────────────── */
function FilterSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        fontSize: '13px',
        padding: '8px 14px',
        borderRadius: '8px',
        border: '1px solid #bae6fd',
        background: '#fff',
        color: '#0c4a6e',
        cursor: 'pointer',
        minWidth: '150px',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        paddingRight: '30px',
      }}
    >
      {children}
    </select>
  );
}

/* ─── page label ────────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: '11px',
      fontWeight: 500,
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '12px',
    }}>
      {children}
    </p>
  );
}

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [filters, setFilters]     = useState({ status: '', category: '', priority: '' });
  const [page, setPage]           = useState(1);
  const [modal, setModal]         = useState(null);
  const [modalForm, setModalForm] = useState({ status: '', comment: '', departmentId: '' });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => API.get('/admin/stats').then(r => r.data.data),
  });

  const { data: depts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => API.get('/admin/departments').then(r => r.data.data),
  });

  const { data: issuesResp, isLoading, isError, error } = useQuery({
    queryKey: ['admin-issues', page, filters.status, filters.category, filters.priority],
    queryFn: async () => {
      const params = { page, limit: 12 };
      if (filters.status)   params.status   = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      const res = await API.get('/admin/issues', { params });
      return res.data;
    },
  });

  if (isError) console.error('Admin issues error:', error);

  const assignMut = useMutation({
    mutationFn: ({ id, departmentId, comment }) =>
      API.patch(`/admin/issues/${id}/assign`, { departmentId, comment }),
    onSuccess: () => {
      toast.success('Issue assigned');
      setModal(null);
      qc.invalidateQueries({ queryKey: ['admin-issues'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status, comment }) =>
      API.patch(`/admin/issues/${id}/status`, { status, comment }),
    onSuccess: () => {
      toast.success('Status updated');
      setModal(null);
      qc.invalidateQueries({ queryKey: ['admin-issues'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const issues    = issuesResp?.data       || [];
  const pagination = issuesResp?.pagination;

  /* ── status colour map for table rows ── */
  const statusDot = {
    Pending:     '#f59e0b',
    'In Progress': '#0ea5e9',
    Resolved:    '#10b981',
    Rejected:    '#f43f5e',
  };

  return (
    <PageWrapper>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '44px 24px 80px',
      }}>

        {/* ══ PAGE HEADER ═════════════════════════════════════════════════ */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '36px',
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 500,
              color: '#0c4a6e',
              marginBottom: '6px',
            }}>
              Admin dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Manage and resolve citizen complaints
            </p>
          </div>

          <Link to="/admin/analytics" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: '#fff',
              border: '1px solid #bae6fd',
              borderRadius: '10px',
              fontSize: '13px', fontWeight: 500,
              color: '#0369a1',
              cursor: 'pointer',
            }}>
              <BarChart3 size={15} color="#0284c7" />
              View analytics
            </button>
          </Link>
        </div>

        {/* ══ KPI CARDS ═══════════════════════════════════════════════════ */}
        <div style={{ marginBottom: '36px' }}>
          <SectionLabel>Overview</SectionLabel>
          {statsLoading ? (
            <SkeletonStats />
          ) : stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
              gap: '16px',
            }}>
              {/* Total */}
              <div style={kpiStyle('#f0f9ff', '#bae6fd')}>
                <div style={kpiIconStyle('#e0f2fe')}>
                  <span style={{ fontSize: '18px' }}>📋</span>
                </div>
                <div>
                  <p style={kpiVal}>{stats.total}</p>
                  <p style={kpiLbl}>Total issues</p>
                </div>
              </div>
              {/* Pending */}
              <div style={kpiStyle('#fffbeb', '#fde68a')}>
                <div style={kpiIconStyle('#fef3c7')}>
                  <span style={{ fontSize: '18px' }}>🕐</span>
                </div>
                <div>
                  <p style={kpiVal}>{stats.pending}</p>
                  <p style={kpiLbl}>Pending</p>
                </div>
              </div>
              {/* In Progress */}
              <div style={kpiStyle('#f0f9ff', '#bae6fd')}>
                <div style={kpiIconStyle('#e0f2fe')}>
                  <span style={{ fontSize: '18px' }}>🔧</span>
                </div>
                <div>
                  <p style={kpiVal}>{stats.inProgress}</p>
                  <p style={kpiLbl}>In progress</p>
                </div>
              </div>
              {/* Resolution rate */}
              <div style={kpiStyle('#f0fdf4', '#bbf7d0')}>
                <div style={kpiIconStyle('#dcfce7')}>
                  <span style={{ fontSize: '18px' }}>✅</span>
                </div>
                <div>
                  <p style={kpiVal}>{stats.resolutionRate}%</p>
                  <p style={kpiLbl}>Resolution rate</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ FILTERS ═════════════════════════════════════════════════════ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          padding: '14px 18px',
          background: '#f8fcff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginRight: '4px' }}>
            <Filter size={14} color="#0284c7" />
            <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 500 }}>Filter</span>
          </div>

          <FilterSelect
            value={filters.status}
            onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
          >
            <option value="">All statuses</option>
            {['Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={filters.category}
            onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}
          >
            <option value="">All categories</option>
            {['Roads', 'Water', 'Garbage', 'Electricity', 'Sanitation', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </FilterSelect>

          {/* Clear button — only when a filter is active */}
          {(filters.status || filters.category || filters.priority) && (
            <button
              onClick={() => { setFilters({ status: '', category: '', priority: '' }); setPage(1); }}
              style={{
                fontSize: '12px', color: '#dc2626',
                background: '#fff5f5', border: '1px solid #fecaca',
                borderRadius: '8px', padding: '7px 12px',
                cursor: 'pointer', fontWeight: 500,
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ══ ISSUES TABLE ════════════════════════════════════════════════ */}
        <div style={{ marginBottom: '24px' }}>
          <SectionLabel>All issues</SectionLabel>
          <div style={{
            background: '#fff',
            border: '1px solid #bae6fd',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {isLoading ? (
              <div style={{ padding: '8px 0' }}>
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
            ) : issues.length === 0 ? (
              <div style={{
                padding: '64px 24px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '28px', marginBottom: '10px' }}>📭</p>
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>No issues found</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f0f9ff', borderBottom: '1px solid #bae6fd' }}>
                      {['Issue', 'Category', 'Status', 'Priority', 'Reporter', 'Age', 'Actions'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: 500,
                          color: '#0369a1',
                          textTransform: 'uppercase',
                          letterSpacing: '0.07em',
                          whiteSpace: 'nowrap',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((iss, idx) => (
                      <tr
                        key={iss._id}
                        style={{
                          borderBottom: idx < issues.length - 1 ? '1px solid #f0f9ff' : 'none',
                          transition: 'background 0.12s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fcff'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Title */}
                        <td style={{ padding: '14px 16px', maxWidth: '260px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                              background: statusDot[iss.status] || '#94a3b8',
                            }} />
                            <Link
                              to={`/issues/${iss._id}`}
                              style={{
                                fontSize: '13px', fontWeight: 500,
                                color: '#0c4a6e',
                                textDecoration: 'none',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {iss.title}
                            </Link>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <CategoryBadge category={iss.category} />
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <StatusBadge status={iss.status} />
                        </td>

                        {/* Priority */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <PriorityBadge priority={iss.priority} />
                        </td>

                        {/* Reporter */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: '#e0f2fe',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px', fontWeight: 500, color: '#0369a1',
                              flexShrink: 0,
                            }}>
                              {iss.submittedBy?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span style={{ fontSize: '13px', color: '#334155', whiteSpace: 'nowrap' }}>
                              {iss.submittedBy?.name}
                            </span>
                          </div>
                        </td>

                        {/* Age */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {formatDistanceToNow(new Date(iss.createdAt), { addSuffix: true })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {iss.status === 'Pending' && (
                              <button
                                onClick={() => {
                                  setModal({ type: 'assign', issue: iss });
                                  setModalForm({ departmentId: '', comment: '' });
                                }}
                                style={{
                                  fontSize: '12px', fontWeight: 500,
                                  padding: '6px 14px',
                                  background: '#e0f2fe',
                                  color: '#0369a1',
                                  border: '1px solid #bae6fd',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Assign
                              </button>
                            )}
                            {!['Resolved', 'Rejected'].includes(iss.status) && (
                              <button
                                onClick={() => {
                                  setModal({ type: 'status', issue: iss });
                                  setModalForm({ status: '', comment: '' });
                                }}
                                style={{
                                  fontSize: '12px', fontWeight: 500,
                                  padding: '6px 14px',
                                  background: '#f0fdf4',
                                  color: '#065f46',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Update
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ══ PAGINATION ══════════════════════════════════════════════════ */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
          }}>
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page <= 1}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '8px 14px',
                background: '#fff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '13px', color: page <= 1 ? '#cbd5e1' : '#0369a1',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontWeight: 500,
              }}
            >
              <ChevronLeft size={14} /> Prev
            </button>

            {/* Page numbers */}
            {[...Array(pagination.totalPages)].map((_, i) => {
              const p = i + 1;
              const active = p === page;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '8px',
                    fontSize: '13px', fontWeight: 500,
                    border: active ? 'none' : '1px solid #bae6fd',
                    background: active ? '#0ea5e9' : '#fff',
                    color: active ? '#fff' : '#0369a1',
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= pagination.totalPages}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '8px 14px',
                background: '#fff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '13px', color: page >= pagination.totalPages ? '#cbd5e1' : '#0369a1',
                cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 500,
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ══ MODAL ═══════════════════════════════════════════════════════ */}
        <Modal
          isOpen={!!modal}
          onClose={() => setModal(null)}
          title={modal?.type === 'assign' ? '📌 Assign issue' : '📊 Update status'}
        >
          {modal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Issue title chip */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '13px', color: '#0c4a6e', fontWeight: 500,
              }}>
                {modal.issue.title}
              </div>

              {/* Assign: department select */}
              {modal.type === 'assign' && depts && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                    Department
                  </label>
                  <select
                    value={modalForm.departmentId}
                    onChange={e => setModalForm(f => ({ ...f, departmentId: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      fontSize: '13px',
                      border: '1px solid #bae6fd', borderRadius: '10px',
                      background: '#fff', color: '#0c4a6e',
                      outline: 'none', cursor: 'pointer',
                    }}
                  >
                    <option value="">Select department</option>
                    {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              {/* Status: status select */}
              {modal.type === 'status' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                    New status
                  </label>
                  <select
                    value={modalForm.status}
                    onChange={e => setModalForm(f => ({ ...f, status: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      fontSize: '13px',
                      border: '1px solid #bae6fd', borderRadius: '10px',
                      background: '#fff', color: '#0c4a6e',
                      outline: 'none', cursor: 'pointer',
                    }}
                  >
                    <option value="">Select status</option>
                    {modal.issue.status !== 'In Progress' && (
                      <option value="In Progress">In Progress</option>
                    )}
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}

              {/* Comment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                  Note (optional)
                </label>
                <textarea
                  value={modalForm.comment}
                  onChange={e => setModalForm(f => ({ ...f, comment: e.target.value }))}
                  rows={3}
                  placeholder="Add a note for the citizen..."
                  style={{
                    width: '100%', padding: '10px 14px',
                    fontSize: '13px', lineHeight: 1.65,
                    border: '1px solid #bae6fd', borderRadius: '10px',
                    background: '#fff', color: '#334155',
                    outline: 'none', resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Footer buttons */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '10px',
                paddingTop: '4px',
              }}>
                <button
                  onClick={() => setModal(null)}
                  style={{
                    padding: '9px 20px', borderRadius: '9px',
                    fontSize: '13px', fontWeight: 500,
                    background: '#f8fafc', color: '#64748b',
                    border: '1px solid #e2e8f0', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={assignMut.isPending || statusMut.isPending}
                  onClick={() =>
                    modal.type === 'assign'
                      ? assignMut.mutate({ id: modal.issue._id, departmentId: modalForm.departmentId, comment: modalForm.comment })
                      : statusMut.mutate({ id: modal.issue._id, status: modalForm.status, comment: modalForm.comment })
                  }
                  style={{
                    padding: '9px 22px', borderRadius: '9px',
                    fontSize: '13px', fontWeight: 500,
                    background: assignMut.isPending || statusMut.isPending ? '#7dd3fc' : '#0ea5e9',
                    color: '#fff', border: 'none',
                    cursor: assignMut.isPending || statusMut.isPending ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  {assignMut.isPending || statusMut.isPending
                    ? 'Saving…'
                    : modal.type === 'assign' ? 'Assign' : 'Update'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageWrapper>
  );
}

/* ─── KPI card style helpers ────────────────────────────────────────────── */
const kpiStyle = (bg, border) => ({
  display: 'flex', alignItems: 'center', gap: '14px',
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: '14px',
  padding: '20px 22px',
});

const kpiIconStyle = (bg) => ({
  width: '44px', height: '44px', flexShrink: 0,
  background: bg, borderRadius: '12px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

const kpiVal = {
  fontSize: '24px', fontWeight: 500, color: '#0c4a6e',
  margin: '0 0 3px', lineHeight: 1,
};

const kpiLbl = {
  fontSize: '12px', color: '#64748b', margin: 0,
};