import { PRIORITY_LEVELS } from '../../config/priorityConfig';

export default function PriorityLegend() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Object.values(PRIORITY_LEVELS).map((level) => (
        <div 
          key={level.label}
          className="flex flex-col gap-1 p-3 rounded-lg border"
          style={{
            backgroundColor: level.background,
            borderColor: level.border,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{level.icon}</span>
            <span className="text-xs font-bold tracking-wide" style={{ color: level.textColor }}>
              {level.label}
            </span>
          </div>
          <p className="text-[10px] leading-tight opacity-90 mt-1 font-medium" style={{ color: level.textColor }}>
            {level.description}
          </p>
          <div className="text-[10px] font-mono mt-auto pt-2 opacity-70" style={{ color: level.textColor }}>
            Score: {level.min}-{level.max}
          </div>
        </div>
      ))}
    </div>
  );
}
