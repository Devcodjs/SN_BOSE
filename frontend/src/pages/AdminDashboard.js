import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './pages.css';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(null); // { type: 'assign'|'status', issue }

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;

      const [issuesRes, statsRes] = await Promise.all([
        API.get('/admin/issues', { params }),
        API.get('/admin/stats'),
      ]);

      setIssues(issuesRes.data.data);
      setPagination(issuesRes.data.pagination);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters, page]);

  const handleAssign = async (issueId, note) => {
    setActionLoading(issueId);
    try {
      await API.patch(`/admin/issues/${issueId}/assign`, { note });
      setShowModal(null);
      fetchData();
    } catch (err) {
      console.error('Failed to assign:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (issueId, status, note) => {
    setActionLoading(issueId);
    try {
      await API.patch(`/admin/issues/${issueId}/status`, { status, note });
      setShowModal(null);
      fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !stats) return <LoadingSpinner message="Loading admin panel..." />;

  return (
    <div className="page-wrapper" id="admin-dashboard">
      <div className="container-custom">
        {/* Header */}
        <div className="dashboard-header">
          <div className="page-header">
            <h1>⚙️ Admin Dashboard</h1>
            <p>Manage and resolve citizen complaints</p>
          </div>
          <Link to="/admin/analytics" className="btn-primary" id="btn-analytics">
            📊 View Analytics
          </Link>
        </div>

        {/* Stat Cards */}
        {stats && (
          <div className="grid-4 admin-stats" style={{ marginBottom: '28px' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>📋</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Issues</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>🕐</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>🔧</div>
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>✅</div>
              <div className="stat-value">{stats.resolved}</div>
              <div className="stat-label">Resolved ({stats.resolutionRate}%)</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filter-bar">
          <select
            value={filters.status}
            onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
            id="admin-filter-status"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
            id="admin-filter-category"
          >
            <option value="">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => { setFilters({ ...filters, priority: e.target.value }); setPage(1); }}
            id="admin-filter-priority"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Issues Table */}
        <div className="card admin-table-card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
              Loading issues...
            </div>
          ) : issues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No issues found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table" id="admin-issues-table">
                <thead>
                  <tr>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Reporter</th>
                    <th>Upvotes</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => {
                    const statusClass = issue.status?.toLowerCase().replace(' ', '-');
                    const priorityClass = issue.priority?.toLowerCase();
                    return (
                      <tr key={issue._id} className="animate-fade-in">
                        <td>
                          <Link to={`/issues/${issue._id}`} className="table-issue-title">
                            {issue.title}
                          </Link>
                        </td>
                        <td>
                          <span className="badge-category">{issue.category}</span>
                        </td>
                        <td>
                          <span className={`badge-status badge-${statusClass}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-status badge-priority-${priorityClass}`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="table-reporter">
                          {issue.reportedBy?.name || 'Unknown'}
                        </td>
                        <td>
                          <span className="upvote-badge">👍 {issue.upvoteCount}</span>
                        </td>
                        <td className="table-date">
                          {new Date(issue.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td>
                          <div className="table-actions">
                            {issue.status === 'Pending' && (
                              <button
                                className="btn-primary btn-sm"
                                onClick={() => setShowModal({ type: 'assign', issue })}
                                disabled={actionLoading === issue._id}
                              >
                                Assign
                              </button>
                            )}
                            {issue.status !== 'Resolved' && issue.status !== 'Rejected' && (
                              <button
                                className="btn-success btn-sm"
                                onClick={() => setShowModal({ type: 'status', issue })}
                                disabled={actionLoading === issue._id}
                              >
                                Update
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="pagination-bar">
            <button
              className="btn-secondary btn-sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="btn-secondary btn-sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              Next →
            </button>
          </div>
        )}

        {/* Modals */}
        {showModal && <ActionModal
          modal={showModal}
          onClose={() => setShowModal(null)}
          onAssign={handleAssign}
          onStatusUpdate={handleStatusUpdate}
          loading={actionLoading}
        />}
      </div>
    </div>
  );
};

/**
 * Action Modal — for assigning and updating status
 */
const ActionModal = ({ modal, onClose, onAssign, onStatusUpdate, loading }) => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modal.type === 'assign') {
      onAssign(modal.issue._id, note);
    } else {
      if (!status) return;
      onStatusUpdate(modal.issue._id, status, note);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <h3>
          {modal.type === 'assign' ? '📌 Assign Issue' : '📊 Update Status'}
        </h3>
        <p style={{ color: 'var(--gray-500)', marginBottom: '20px', fontSize: '0.9rem' }}>
          <strong>{modal.issue.title}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          {modal.type === 'status' && (
            <div className="form-group">
              <label htmlFor="modal-status">New Status</label>
              <select
                id="modal-status"
                className="form-control-custom"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
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

          <div className="form-group">
            <label htmlFor="modal-note">Note (optional)</label>
            <textarea
              id="modal-note"
              className="form-control-custom"
              placeholder="Add a note about this action..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : modal.type === 'assign' ? 'Assign to Me' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
