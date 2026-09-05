import { motion } from 'framer-motion';
import { getPriorityLevel } from '../../config/priorityConfig';

export default function PriorityProgressBar({ score, showLabel = false, height = 'h-2' }) {
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const level = getPriorityLevel(safeScore);
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-gray-600">Priority Score</span>
          <span style={{ color: level.textColor }} className="font-bold">{safeScore}/100</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${height} border border-gray-200/50`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: level.color,
            boxShadow: `0 0 8px ${level.color}40`
          }}
        />
      </div>
    </div>
  );
}
