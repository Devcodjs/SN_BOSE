import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { PRIORITY_WEIGHTS } from '../../config/priorityConfig';

/**
 * Small "How priority is calculated ⓘ" trigger + popover.
 * Surfaces the real weighting used by the AI Priority Engine
 * (mirrored from backend/src/config/priorityConfig.js) so the page
 * visually communicates that ranking is computed, not manual —
 * without needing to invent any new backend logic.
 */
export default function PriorityInfoPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-primary-600 transition-colors"
      >
        <Info size={13} />
        How priority is calculated
      </button>

      {open && (
        <div className="absolute z-20 top-full left-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl p-4">
          <p className="text-[12px] font-semibold text-gray-900 mb-3">
            AI Priority Score
          </p>
          <div className="space-y-2.5">
            {PRIORITY_WEIGHTS.map(w => (
              <div key={w.key}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-gray-600">{w.label}</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {Math.round(w.weight * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${w.weight * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            Every report is scored 0–100 from these signals, then sorted so the
            most urgent, corroborated, and upvoted issues surface first.
          </p>
        </div>
      )}
    </div>
  );
}
