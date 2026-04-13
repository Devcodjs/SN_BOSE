import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusTimeline from '../components/StatusTimeline';
import MapView from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import './pages.css';

const IssueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);

  const fetchIssue = async () => {
    try {
      const res = await API.get(`/issues/${id}`);
      setIssue(res.data.data);
    } catch (err) {
      console.error('Failed to fetch issue:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
    // eslint-disable-next-line
  }, [id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setUpvoting(true);
    try {
      const res = await API.post(`/issues/${id}/upvote`);
      setIssue((prev) => ({
        ...prev,
        upvoteCount: res.data.data.upvoteCount,
        hasUpvoted: res.data.data.upvoted,
      }));
    } catch (err) {
      console.error('Failed to upvote:', err);
    } finally {
      setUpvoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await API.delete(`/issues/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (loading) return <LoadingSpinner message="Loading issue details..." />;
  if (!issue) return null;

  const statusClass = issue.status?.toLowerCase().replace(' ', '-');
  const isOwner = user && issue.reportedBy?._id === user._id;

  return (
    <div className="page-wrapper" id="issue-detail-page">
      <div className="container-custom" style={{ maxWidth: '900px' }}>
        <div className="animate-slide-up">
          {/* Header */}
          <div className="detail-header">
            <div>
              <div className="detail-tags">
                <span className="badge-category">
                  {issue.category}
                </span>
                <span className={`badge-status badge-${statusClass}`}>
                  {issue.status}
                </span>
                {issue.priority && (
                  <span className={`badge-status badge-priority-${issue.priority?.toLowerCase()}`}>
                    {issue.priority}
                  </span>
                )}
              </div>
              <h1 className="detail-title">{issue.title}</h1>
              <div className="detail-meta">
                <span>
                  Reported by <strong>{issue.reportedBy?.name || 'Unknown'}</strong>
                </span>
                <span>•</span>
                <span>
                  {new Date(issue.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                {issue.assignedTo && (
                  <>
                    <span>•</span>
                    <span>
                      Assigned to <strong>{issue.assignedTo.name}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="detail-actions">
              {/* Upvote */}
              <button
                className={`upvote-btn ${issue.hasUpvoted ? 'upvoted' : ''}`}
                onClick={handleUpvote}
                disabled={upvoting}
                id="upvote-btn"
              >
                <span className="upvote-icon">👍</span>
                <span className="upvote-count">{issue.upvoteCount || 0}</span>
              </button>

              {/* Delete (owner or admin) */}
              {(isOwner || user?.role === 'admin') && (
                <button
                  className="btn-danger btn-sm"
                  onClick={handleDelete}
                  id="delete-issue-btn"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>

          {/* Main content — 2 columns */}
          <div className="detail-grid">
            {/* Left column */}
            <div className="detail-main">
              {/* Image */}
              {issue.image && (
                <div className="detail-image card">
                  <img src={issue.image} alt={issue.title} />
                </div>
              )}

              {/* Description */}
              <div className="card detail-section">
                <h3>📝 Description</h3>
                <p className="detail-description">{issue.description}</p>
              </div>

              {/* Location */}
              {issue.location?.address && (
                <div className="card detail-section">
                  <h3>📍 Location</h3>
                  <p style={{ marginBottom: '12px', color: 'var(--gray-600)' }}>
                    {issue.location.address}
                  </p>
                  <MapView
                    coordinates={issue.location.coordinates}
                    address={issue.location.address}
                    title={issue.title}
                  />
                </div>
              )}
            </div>

            {/* Right column — Timeline */}
            <div className="detail-sidebar">
              <div className="card detail-section">
                <h3>📊 Status Timeline</h3>
                <StatusTimeline statusLogs={issue.statusLogs || []} />
              </div>

              {/* Resolution info */}
              {issue.status === 'Resolved' && issue.resolvedAt && (
                <div className="card detail-section resolution-card">
                  <h3>✅ Resolved</h3>
                  <p>
                    This issue was resolved on{' '}
                    <strong>
                      {new Date(issue.resolvedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>
                  </p>
                  <p className="resolution-time">
                    Resolution time:{' '}
                    {Math.round(
                      (new Date(issue.resolvedAt) - new Date(issue.createdAt)) /
                        (1000 * 60 * 60)
                    )}{' '}
                    hours
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;
