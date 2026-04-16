import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  Pending: {
    icon: Clock,
    iconColor: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    badge: '#fef3c7',
    badgeText: '#92400e',
    dot: '#f59e0b',
  },
  'In Progress': {
    icon: AlertCircle,
    iconColor: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    badge: '#e0f2fe',
    badgeText: '#0369a1',
    dot: '#0ea5e9',
  },
  Resolved: {
    icon: CheckCircle2,
    iconColor: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    badge: '#dcfce7',
    badgeText: '#065f46',
    dot: '#10b981',
  },
  Rejected: {
    icon: XCircle,
    iconColor: '#dc2626',
    bg: '#fff1f2',
    border: '#fecdd3',
    badge: '#ffe4e6',
    badgeText: '#9f1239',
    dot: '#f43f5e',
  },
};

const DEFAULT_CONFIG = {
  icon: Clock,
  iconColor: '#64748b',
  bg: '#f8fafc',
  border: '#e2e8f0',
  badge: '#f1f5f9',
  badgeText: '#475569',
  dot: '#94a3b8',
};

export default function StatusTimeline({ updates = [] }) {
  if (!updates.length) {
    return (
      <div style={{
        padding: '32px 24px',
        textAlign: 'center',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}>
        <Clock size={28} color="#cbd5e1" style={{ marginBottom: '10px' }} />
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>No updates yet</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {updates.map((u, i) => {
        const cfg = STATUS_CONFIG[u.toStatus] || DEFAULT_CONFIG;
        const Icon = cfg.icon;
        const isLast = i === updates.length - 1;

        return (
          <motion.div
            key={u._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            style={{ display: 'flex', gap: '16px', paddingBottom: isLast ? 0 : '4px' }}
          >
            {/* Left: icon + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              {/* Icon circle */}
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1,
              }}>
                <Icon size={16} color={cfg.iconColor} />
              </div>
              {/* Connector line */}
              {!isLast && (
                <div style={{
                  width: '1.5px',
                  flex: 1,
                  minHeight: '28px',
                  background: '#e0f2fe',
                  margin: '4px 0',
                }} />
              )}
            </div>

            {/* Right: card */}
            <div style={{
              flex: 1,
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: '12px',
              padding: '16px 18px',
              marginBottom: isLast ? 0 : '8px',
            }}>
              {/* Top row: status badge + date */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px', marginBottom: '8px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: cfg.badge,
                  color: cfg.badgeText,
                  fontSize: '11px', fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '99px',
                  letterSpacing: '0.02em',
                }}>
                  <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: cfg.dot,
                    flexShrink: 0,
                  }} />
                  {u.toStatus}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {format(new Date(u.createdAt), 'dd MMM yyyy, hh:mm a')}
                </span>
              </div>

              {/* Comment */}
              {u.comment && (
                <p style={{
                  fontSize: '13px', color: '#334155',
                  lineHeight: 1.65, margin: '0 0 8px',
                }}>
                  {u.comment}
                </p>
              )}

              {/* Updated by */}
              {u.updatedBy && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '99px',
                  padding: '3px 10px',
                  marginBottom: u.proofImage ? '10px' : 0,
                }}>
                  <div style={{
                    width: '18px', height: '18px',
                    borderRadius: '50%',
                    background: '#0ea5e9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', color: '#fff', fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {u.updatedBy.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#475569' }}>
                    {u.updatedBy.name}
                  </span>
                  <span style={{
                    fontSize: '10px', color: '#94a3b8',
                    background: '#f1f5f9',
                    padding: '1px 7px', borderRadius: '99px',
                  }}>
                    {u.updatedBy.role}
                  </span>
                </div>
              )}

              {/* Proof image */}
              {u.proofImage && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Proof attached
                  </p>
                  <img
                    src={u.proofImage}
                    alt="Resolution proof"
                    style={{
                      width: '100px', height: '72px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: `1px solid ${cfg.border}`,
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}