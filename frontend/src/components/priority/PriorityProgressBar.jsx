import { motion } from 'framer-motion';
import { getPriorityLevel, PRIORITY_LEVELS } from '../../config/priorityConfig';

// Real threshold boundaries from priorityConfig — marking these on the
// track shows *why* a score sits in a given band, rather than the ticks
// being arbitrary decoration.
const THRESHOLDS = [PRIORITY_LEVELS.MEDIUM.min, PRIORITY_LEVELS.HIGH.min, PRIORITY_LEVELS.CRITICAL.min];

export default function PriorityProgressBar({ score, showLabel = false, height = 'h-2' }) {
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const level = getPriorityLevel(safeScore);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-gray-500">Priority score</span>
          <span className="font-bold font-mono tabular-nums" style={{ color: level.textColor }}>
            {safeScore}<span className="text-gray-400 font-medium">/100</span>
          </span>
        </div>
      )}

      <div className={`relative w-full bg-gray-100 rounded-full overflow-hidden ${height} border border-gray-200/70`}>
        {THRESHOLDS.map(t => (
          <span
            key={t}
            className="absolute top-0 bottom-0 w-px bg-white/60 z-10"
            style={{ left: `${t}%` }}
          />
        ))}

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full relative z-0"
          style={{
            backgroundColor: level.color,
            boxShadow: `0 0 6px ${level.color}60`,
          }}
        />
      </div>
    </div>
  );
}