import { getPriorityLevel, PRIORITY_LEVELS } from '../../config/priorityConfig';
import { motion } from 'framer-motion';

export default function PriorityBadge({ score, label, className = '' }) {
  // Use score if available, otherwise fallback to label matching
  let level = PRIORITY_LEVELS.MEDIUM;
  
  if (score !== undefined && score !== null) {
    level = getPriorityLevel(score);
  } else if (label) {
    const key = label.toUpperCase();
    if (PRIORITY_LEVELS[key]) level = PRIORITY_LEVELS[key];
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border shadow-sm ${className}`}
      style={{
        backgroundColor: level.background,
        borderColor: level.border,
        color: level.textColor,
      }}
    >
      <span className="text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        {level.icon}
      </span>
      <span className="text-xs font-bold tracking-wide">
        {level.label}
      </span>
      {score !== undefined && (
        <>
          <div className="w-[1px] h-3.5 opacity-30 mx-0.5" style={{ backgroundColor: level.textColor }} />
          <span className="text-[11px] font-black font-mono">
            {score}
          </span>
        </>
      )}
    </motion.div>
  );
}
