import React from 'react';
import './StatusTimeline.css';

const statusConfig = {
  Pending: { icon: '🕐', color: '#f59e0b', bg: '#fef3c7' },
  'In Progress': { icon: '🔧', color: '#3b82f6', bg: '#dbeafe' },
  Resolved: { icon: '✅', color: '#10b981', bg: '#d1fae5' },
  Rejected: { icon: '❌', color: '#f43f5e', bg: '#ffe4e6' },
};

const StatusTimeline = ({ statusLogs = [] }) => {
  if (statusLogs.length === 0) {
    return (
      <div className="timeline-empty">
        <p>No status history available</p>
      </div>
    );
  }

  return (
    <div className="status-timeline" id="status-timeline">
      {statusLogs.map((log, index) => {
        const config = statusConfig[log.toStatus] || statusConfig.Pending;
        const isLast = index === statusLogs.length - 1;

        return (
          <div
            key={log._id || index}
            className={`timeline-item ${isLast ? 'timeline-item-active' : ''}`}
          >
            {/* Line connector */}
            {!isLast && <div className="timeline-line" />}

            {/* Dot */}
            <div
              className="timeline-dot"
              style={{ background: config.bg, borderColor: config.color }}
            >
              <span>{config.icon}</span>
            </div>

            {/* Content */}
            <div className="timeline-content">
              <div className="timeline-header">
                <span
                  className="timeline-status"
                  style={{ color: config.color }}
                >
                  {log.toStatus}
                </span>
                <span className="timeline-date">
                  {new Date(log.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {log.fromStatus && (
                <p className="timeline-transition">
                  {log.fromStatus} → {log.toStatus}
                </p>
              )}

              {log.note && (
                <p className="timeline-note">{log.note}</p>
              )}

              {log.changedBy && (
                <span className="timeline-user">
                  By: {log.changedBy.name} ({log.changedBy.role})
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
