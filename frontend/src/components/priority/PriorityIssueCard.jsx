import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getPriorityLevel } from '../../config/priorityConfig';
import PriorityProgressBar from './PriorityProgressBar';

const categoryIcon = {
  Roads: '🛣️', Water: '💧', Garbage: '🗑️', Electricity: '⚡', Sanitation: '🧹', Other: '📋',
};

const statusColor = {
  Pending: '#d97706',
  'In Progress': '#2563eb',
  Resolved: '#16a34a',
  Rejected: '#dc2626',
};

/**
 * Dedicated card for the redesigned Priority Queue grid.
 *
 * Deliberately separate from components/issues/IssueCard.jsx (which the
 * citizen dashboard still uses) so this redesign doesn't change anything
 * outside the Priority Queue page.
 */
export default function PriorityIssueCard({ issue, index = 0 }) {
  const img = issue.images?.[0] || issue.image;
  const level = getPriorityLevel(issue.priorityScore || 0);
  const initials = (issue.submittedBy?.name || 'C')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-gray-300/80 transition-shadow duration-200 overflow-hidden flex flex-col"
    >
      <Link to={`/issues/${issue._id}`} className="flex flex-col flex-1 no-underline text-inherit">
        {/* Image */}
        {img ? (
          <div className="h-[152px] overflow-hidden bg-gray-100 shrink-0">
            <img
              src={img}
              alt={issue.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        ) : (
          <div className="h-[152px] bg-gray-50 flex items-center justify-center shrink-0">
            <span className="text-[12px] font-medium text-gray-400">No image</span>
          </div>
        )}

        <div className="flex flex-col gap-3 p-4 flex-1">
          {/* Severity + score — the most prominent row on the card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: level.color, boxShadow: `0 0 0 3px ${level.color}20` }}
              />
              <span
                className="text-[11px] font-bold tracking-wide"
                style={{ color: level.textColor }}
              >
                {level.label}
              </span>
            </div>
            <span
              className="text-lg font-bold font-mono tabular-nums leading-none"
              style={{ color: level.textColor }}
            >
              {Math.round(issue.priorityScore || 0)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
            {issue.title}
          </h3>

          {/* Category + status — small, subtle pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-md bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-600">
              {categoryIcon[issue.category] || '📋'} {issue.category}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-md bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-600">
              <span
                className="w-[6px] h-[6px] rounded-full shrink-0"
                style={{ backgroundColor: statusColor[issue.status] || '#94a3b8' }}
              />
              {issue.status}
            </span>
          </div>

          {/* Priority score bar */}
          <PriorityProgressBar score={issue.priorityScore} showLabel height="h-1.5" />

          <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-2.5">
            {/* Time + upvotes */}
            <div className="flex items-center justify-between text-[12px] text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-primary-600">
                <ThumbsUp size={12} />
                {issue.upvoteCount || 0}
              </span>
            </div>

            {/* Reporter — compact, visually secondary */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                {initials}
              </div>
              <span className="text-[11.5px] font-medium text-gray-500 truncate">
                {issue.submittedBy?.name || 'Citizen'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
