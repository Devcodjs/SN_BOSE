const dayLabels = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function HeatmapGrid({ data = [] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getColor = (count) => {
    if (!count) return 'bg-gray-100';
    const intensity = count / maxCount;
    if (intensity > 0.75) return 'bg-primary-600';
    if (intensity > 0.5) return 'bg-primary-400';
    if (intensity > 0.25) return 'bg-primary-200';
    return 'bg-primary-100';
  };

  const getCount = (day, hour) => {
    const cell = data.find(d => d.day === day && d.hour === hour);
    return cell?.count || 0;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header: hours */}
        <div className="flex gap-0.5 mb-1 pl-12">
          {hours.map(h => (
            <div key={h} className="flex-1 text-center text-[10px] text-gray-400">{h % 3 === 0 ? `${h}h` : ''}</div>
          ))}
        </div>
        {/* Rows: days */}
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <div key={day} className="flex gap-0.5 mb-0.5 items-center">
            <span className="w-10 text-xs text-gray-500 text-right pr-2">{dayLabels[day]}</span>
            {hours.map(hour => {
              const count = getCount(day, hour);
              return (
                <div
                  key={hour}
                  className={`flex-1 aspect-square rounded-sm ${getColor(count)} transition-colors`}
                  title={`${dayLabels[day]} ${hour}:00 — ${count} issues`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
