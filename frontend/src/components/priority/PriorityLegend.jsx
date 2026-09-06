import { PRIORITY_LEVELS } from '../../config/priorityConfig';

export default function PriorityLegend() {
  return (
    // gap-3 → gap-4: the four cards were touching almost edge-to-edge at
    // narrower widths; a full 16px gutter gives each one clear separation.
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.values(PRIORITY_LEVELS).map((level) => (
        <div
          key={level.label}
          className="flex flex-col h-full gap-3 p-4 rounded-xl border shadow-sm transition-shadow duration-150 hover:shadow-[0_4px_14px_-4px_rgba(0,0,0,0.12)]"
          style={{
            backgroundColor: level.background,
            borderColor: level.border,
          }}
        >
          {/* Label row */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: level.color,
                boxShadow: `0 0 0 3px ${level.color}20`,
              }}
            />
            <span
              className="text-xs font-bold tracking-wide"
              style={{ color: level.textColor }}
            >
              {level.label}
            </span>
          </div>

          {/* Description — flex-1 so every card's divider lines up at the
              bottom regardless of how many lines the description wraps to */}
          <p
            className="text-[11px] leading-relaxed font-medium flex-1"
            style={{ color: level.textColor, opacity: 0.82 }}
          >
            {level.description}
          </p>

          {/* Score range, separated by a real divider rather than just
              spacing, so it reads as a distinct data point */}
          <div
            className="flex items-baseline justify-between text-[10px] font-mono font-semibold tabular-nums pt-2.5 border-t"
            style={{ color: level.textColor, opacity: 0.75, borderColor: level.border }}
          >
            <span className="tracking-wide" style={{ opacity: 0.75 }}>SCORE</span>
            <span>{level.min}–{level.max}</span>
          </div>
        </div>
      ))}
    </div>
  );
}