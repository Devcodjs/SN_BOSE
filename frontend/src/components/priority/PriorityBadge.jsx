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

  const hasScore = score !== undefined && score !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`inline-flex items-center gap-1.5 pl-2 pr-2.5 py-[3px] rounded-full border ${className}`}
      style={{
        backgroundColor: level.background,
        borderColor: level.border,
      }}
    >
      {/* Status dot with soft halo — matches the dot convention already used
          for status indicators elsewhere in the admin table, so this reads
          as one consistent system rather than a new visual language. */}
      <span
        className="w-[7px] h-[7px] rounded-full shrink-0"
        style={{
          backgroundColor: level.color,
          boxShadow: `0 0 0 3px ${level.color}20`,
        }}
      />

      <span
        className="text-[11px] font-bold tracking-wide leading-none whitespace-nowrap"
        style={{ color: level.textColor }}
      >
        {level.label}
      </span>

      {hasScore && (
        <>
          <span
            className="w-px h-3 shrink-0"
            style={{ backgroundColor: level.textColor, opacity: 0.18 }}
          />
          <span
            className="text-[11px] font-semibold font-mono tabular-nums leading-none"
            style={{ color: level.textColor, opacity: 0.8 }}
          >
            {Math.round(score)}
          </span>
        </>
      )}
    </motion.div>
  );
}