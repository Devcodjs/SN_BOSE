import React from 'react';
import { Link } from 'react-router-dom';
import './IssueCard.css';

const categoryIcons = {
  Roads: '🛣️',
  Garbage: '🗑️',
  Water: '💧',
  Electricity: '⚡',
  Sanitation: '🚿',
  Other: '📋',
};

const IssueCard = ({ issue }) => {
  const statusClass = issue.status?.toLowerCase().replace(' ', '-');
  const priorityClass = issue.priority?.toLowerCase();

  return (
    <Link to={`/issues/${issue._id}`} className="issue-card" id={`issue-card-${issue._id}`}>
      {/* Image */}
      {issue.image && (
        <div className="issue-card-image">
          <img src={issue.image} alt={issue.title} loading="lazy" />
        </div>
      )}

      {/* Content */}
      <div className="issue-card-body">
        {/* Tags row */}
        <div className="issue-card-tags">
          <span className="badge-category">
            {categoryIcons[issue.category] || '📋'} {issue.category}
          </span>
          <span className={`badge-status badge-${statusClass}`}>
            {issue.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="issue-card-title">{issue.title}</h3>

        {/* Description preview */}
        <p className="issue-card-desc">
          {issue.description?.length > 100
            ? issue.description.substring(0, 100) + '...'
            : issue.description}
        </p>

        {/* Footer */}
        <div className="issue-card-footer">
          <div className="issue-card-meta">
            {issue.location?.address && (
              <span className="meta-item">📍 {issue.location.address}</span>
            )}
            <span className="meta-item">
              🕐 {new Date(issue.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="issue-card-stats">
            <span className="upvote-badge" title="Upvotes">
              👍 {issue.upvoteCount || 0}
            </span>
            {issue.priority && (
              <span className={`badge-status badge-priority-${priorityClass}`}>
                {issue.priority}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
