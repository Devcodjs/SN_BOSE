import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import IssueCard from '../components/IssueCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './pages.css';

const CitizenDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchMyIssues = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (statusFilter) params.status = statusFilter;

      const res = await API.get('/issues/my/issues', { params });
      setIssues(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
    // eslint-disable-next-line
  }, [statusFilter, page]);

  const statusCounts = {
    all: pagination?.totalItems || 0,
  };

  return (
    <div className="page-wrapper" id="citizen-dashboard">
      <div className="container-custom">
        {/* Header */}
        <div className="dashboard-header">
          <div className="page-header">
            <h1>📋 My Reported Issues</h1>
            <p>Track the status of issues you've reported</p>
          </div>
          <Link to="/issues/create" className="btn-primary" id="btn-create-issue">
            ➕ Report New Issue
          </Link>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            id="filter-status"
          >
            <option value="">All Statuses</option>
            <option value="Pending">🕐 Pending</option>
            <option value="In Progress">🔧 In Progress</option>
            <option value="Resolved">✅ Resolved</option>
            <option value="Rejected">❌ Rejected</option>
          </select>

          <span className="filter-count">
            {statusCounts.all} issue{statusCounts.all !== 1 ? 's' : ''} total
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading your issues..." />
        ) : issues.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-icon">📝</div>
            <h3>No issues reported yet</h3>
            <p>Start by reporting a civic issue in your area</p>
            <Link to="/issues/create" className="btn-primary" style={{ marginTop: '20px' }}>
              Report Your First Issue
            </Link>
          </div>
        ) : (
          <>
            <div className="issues-grid animate-fade-in">
              {issues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} />
              ))}
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
          </>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
