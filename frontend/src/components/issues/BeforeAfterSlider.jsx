import { useState, useRef } from 'react';
import { ArrowLeftRight } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  };

  const handleDown = () => { dragging.current = true; };
  const handleUp = ()   => { dragging.current = false; };
  const handleMove = (e) => {
    if (!dragging.current) return;
    updatePosition(e.touches ? e.touches[0].clientX : e.clientX);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Slider container */}
      <div
        ref={containerRef}
        onMouseDown={handleDown} onMouseUp={handleUp}
        onMouseLeave={handleUp} onMouseMove={handleMove}
        onTouchStart={handleDown} onTouchEnd={handleUp} onTouchMove={handleMove}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '16px',
          overflow: 'hidden',
          userSelect: 'none',
          cursor: 'col-resize',
          border: '1px solid #bae6fd',
          background: '#e0f2fe',
        }}
      >
        {/* After — bottom layer */}
        <img
          src={afterImage}
          alt={afterLabel}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Before — top layer, clipped */}
        <div
          style={{
            position: 'absolute', inset: 0,
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Before label */}
        <span style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(7, 89, 133, 0.82)',
          color: '#fff',
          fontSize: '11px', fontWeight: 500,
          padding: '4px 10px',
          borderRadius: '99px',
          letterSpacing: '0.03em',
          backdropFilter: 'blur(6px)',
        }}>
          {beforeLabel}
        </span>

        {/* After label */}
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(2, 132, 199, 0.82)',
          color: '#fff',
          fontSize: '11px', fontWeight: 500,
          padding: '4px 10px',
          borderRadius: '99px',
          letterSpacing: '0.03em',
          backdropFilter: 'blur(6px)',
        }}>
          {afterLabel}
        </span>

        {/* Divider line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          width: '2px',
          background: '#fff',
          left: `${position}%`,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }} />

        {/* Handle knob */}
        <div style={{
          position: 'absolute',
          top: '50%', left: `${position}%`,
          transform: 'translate(-50%, -50%)',
          width: '44px', height: '44px',
          background: '#fff',
          borderRadius: '50%',
          border: '2px solid #0ea5e9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(14,165,233,0.25)',
          pointerEvents: 'none',
        }}>
          <ArrowLeftRight size={16} color="#0284c7" />
        </div>
      </div>

      {/* Progress bar hint */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 4px',
      }}>
        <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 500, minWidth: '36px' }}>
          {Math.round(position)}%
        </span>
        <div style={{
          flex: 1, height: '4px',
          background: '#e0f2fe',
          borderRadius: '99px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${position}%`,
            height: '100%',
            background: '#0ea5e9',
            borderRadius: '99px',
            transition: 'width 0.05s',
          }} />
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', minWidth: '36px', textAlign: 'right' }}>
          {Math.round(100 - position)}%
        </span>
      </div>
    </div>
  );
}