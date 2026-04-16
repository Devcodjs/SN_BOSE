import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StatusBadge, CategoryBadge, PriorityBadge } from '../ui/Badge';
import { ThumbsUp, MapPin, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const token = {
  // Surface
  cardBg:         '#ffffff',
  cardBorder:     '1px solid #e8edf5',
  cardRadius:     '16px',
  imageBg:        '#f0f4f8',

  // Text
  titleColor:     '#0f172a',
  titleHover:     '#1d4ed8',
  metaColor:      '#64748b',
  subtleColor:    '#94a3b8',

  // Divider
  dividerColor:   '#f1f5f9',

  // Upvote chip
  upvoteText:     '#1d4ed8',
  upvoteBg:       '#eff6ff',
  upvoteBorder:   '#bfdbfe',

  // Author chip
  authorBg:       '#f8fafc',
  authorBorder:   '#e2e8f0',
  authorText:     '#334155',

  // No-image placeholder
  placeholderBg:  '#f0f4f8',
};

/* ─────────────────────────────────────────────
   STYLE MAP
───────────────────────────────────────────── */
const s = {
  /* Outer card wrapper */
  card: {
    backgroundColor: token.cardBg,
    borderRadius: token.cardRadius,
    border: token.cardBorder,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },

  /* Link wraps entire card */
  link: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textDecoration: 'none',
    color: 'inherit',
  },

  /* ── IMAGE AREA ── */
  imageWrap: {
    height: '196px',
    overflow: 'hidden',
    backgroundColor: token.imageBg,
    flexShrink: 0,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s ease',
  },

  /* No-image placeholder */
  placeholder: {
    height: '196px',
    backgroundColor: token.placeholderBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  placeholderInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  placeholderIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  placeholderText: {
    fontSize: '12px',
    color: token.subtleColor,
    fontWeight: '500',
  },

  /* ── BODY ── */
  body: {
    padding: '20px 20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flex: 1,
  },

  /* Badge row */
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    alignItems: 'center',
  },

  /* Title */
  title: {
    fontSize: '15px',
    fontWeight: '700',
    color: token.titleColor,
    lineHeight: '1.45',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    transition: 'color 0.18s ease',
  },

  /* Meta row (location + time) */
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: '500',
    color: token.metaColor,
    minWidth: 0,
  },
  metaItemText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '160px',
  },

  /* ── FOOTER ── */
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '14px 20px',
    marginTop: '4px',
    borderTop: `1px solid ${token.dividerColor}`,
  },

  /* Author chip */
  authorChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '5px 10px 5px 6px',
    borderRadius: '20px',
    backgroundColor: token.authorBg,
    border: `1px solid ${token.authorBorder}`,
    minWidth: 0,
    overflow: 'hidden',
  },
  authorAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  authorName: {
    fontSize: '12px',
    fontWeight: '600',
    color: token.authorText,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '120px',
  },

  /* Upvote chip */
  upvoteChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 12px',
    borderRadius: '20px',
    backgroundColor: token.upvoteBg,
    border: `1px solid ${token.upvoteBorder}`,
    fontSize: '12px',
    fontWeight: '700',
    color: token.upvoteText,
    flexShrink: 0,
    transition: 'background-color 0.18s ease',
  },
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function IssueCard({ issue, index = 0 }) {
  const img = issue.images?.[0] || issue.image;
  const initials = (issue.submittedBy?.name || 'C')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      whileHover={{
        y: -5,
        boxShadow: '0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)',
      }}
      style={s.card}
    >
      <Link
        to={`/issues/${issue._id}`}
        style={s.link}
        onMouseEnter={e => {
          const title = e.currentTarget.querySelector('[data-title]');
          if (title) title.style.color = token.titleHover;
          const img = e.currentTarget.querySelector('[data-img]');
          if (img) img.style.transform = 'scale(1.06)';
        }}
        onMouseLeave={e => {
          const title = e.currentTarget.querySelector('[data-title]');
          if (title) title.style.color = token.titleColor;
          const img = e.currentTarget.querySelector('[data-img]');
          if (img) img.style.transform = 'scale(1)';
        }}
      >
        {/* ── IMAGE / PLACEHOLDER ── */}
        {img ? (
          <div style={s.imageWrap}>
            <img
              data-img
              src={img}
              alt={issue.title}
              style={s.image}
              loading="lazy"
            />
          </div>
        ) : (
          <div style={s.placeholder}>
            <div style={s.placeholderInner}>
              <div style={s.placeholderIcon}>📍</div>
              <span style={s.placeholderText}>No image</span>
            </div>
          </div>
        )}

        {/* ── BODY ── */}
        <div style={s.body}>

          {/* Badge row */}
          <div style={s.badgeRow}>
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
            {issue.priority && <PriorityBadge priority={issue.priority} />}
          </div>

          {/* Title */}
          <h3 data-title style={s.title}>
            {issue.title}
          </h3>

          {/* Meta row */}
          <div style={s.metaRow}>
            {issue.location?.address && (
              <span style={s.metaItem}>
                <MapPin size={13} color="#94a3b8" />
                <span style={s.metaItemText}>{issue.location.address}</span>
              </span>
            )}
            <span style={s.metaItem}>
              <Clock size={13} color="#94a3b8" />
              {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={s.footer}>
          {/* Author chip */}
          <div style={s.authorChip}>
            <div style={s.authorAvatar}>{initials}</div>
            <span style={s.authorName}>
              {issue.submittedBy?.name || 'Citizen'}
            </span>
          </div>

          {/* Upvote chip */}
          <div style={s.upvoteChip}>
            <ThumbsUp size={13} />
            {issue.upvoteCount || 0}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}