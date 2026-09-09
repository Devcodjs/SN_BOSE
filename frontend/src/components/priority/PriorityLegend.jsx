import { PRIORITY_LEVELS } from '../../config/priorityConfig';

/**
 * Compact, single-strip priority overview.
 *
 * This replaces the four large description cards that used to dominate the
 * top of the Priority Queue page. All the same information survives — the
 * label and score range for every level — just reduced to dots, labels and
 * numbers instead of full paragraph explanations inside big colored boxes.
 * The longer descriptions now live in the "How priority is calculated"
 * popover (see PriorityInfoPopover) so nothing is actually lost.
 */
export default function PriorityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-white px-5 py-3 rounded-xl border border-gray-200/80">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 shrink-0">
        Priority overview
      </span>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {Object.values(PRIORITY_LEVELS).map((level) => (
          <div key={level.label} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-[13px] font-semibold text-gray-700">
              {level.label.charAt(0) + level.label.slice(1).toLowerCase()}
            </span>
            <span className="text-[12px] font-mono tabular-nums text-gray-400">
              {level.min}–{level.max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
