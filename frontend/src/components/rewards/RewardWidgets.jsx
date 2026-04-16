/**
 * EcoComponents.jsx
 * ─────────────────────────────────────────────────────────────
 * Three production-grade components:
 *   • TreeCounter      — animated tree count display
 *   • BadgeDisplay     — earned badge showcase with spring animation
 *   • CertificateCard  — downloadable certificate link card
 *
 * Aesthetic: "Forest Atelier" — rich forest greens, warm parchment,
 * earthy ambers. Playfair Display headings + DM Sans body.
 * Tactile depth via layered shadows and subtle grain texture.
 *
 * Dependencies:
 *   npm install framer-motion lucide-react
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';
import { TreePine, Award, Flag, Download, Sparkles } from 'lucide-react';
import { motion, useSpring, useMotionValue, animate } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   Injected global styles
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .eco-root * { box-sizing: border-box; }
  .eco-root {
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Tree counter number animation ── */
  @keyframes eco-pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.06); }
  }

  /* ── Badge shimmer ── */
  @keyframes eco-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* ── Grain overlay on tree counter ── */
  .eco-grain::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.6;
  }

  /* ── Certificate hover ── */
  .eco-cert-link:hover .eco-cert-arrow {
    transform: translateX(4px);
  }
  .eco-cert-arrow {
    transition: transform 0.22s ease;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   Design tokens
═══════════════════════════════════════════════════════════════ */
const T = {
  /* Blues */
  forest:      '#0c4a6e',
  forestMid:   '#0284c7',
  leaf:        '#0ea5e9',
  mint:        '#bae6fd',
  misty:       '#f0f9ff',
  parchment:   '#f8fafc',

  /* Ambers / accents (Converted to Blue & White) */
  amber:       '#0284c7',
  amberLight:  '#f0f9ff',
  gold:        '#0ea5e9',

  /* Neutrals */
  ink:         '#0f172a',
  inkMid:      '#334155',
  stone:       '#64748b',
  cream:       '#ffffff',

  /* Shadows */
  shadowGreen: 'rgba(2, 132, 199, 0.18)',
  shadowAmber: 'rgba(2, 132, 199, 0.16)',
};

/* ═══════════════════════════════════════════════════════════════
   Custom SVG Components
═══════════════════════════════════════════════════════════════ */
const IndianFlag = ({ size = 24 }) => (
  <div style={{
    width: size * 1.5,
    height: size,
    borderRadius: '2px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    flexShrink: 0
  }}>
    <svg width="100%" height="100%" viewBox="0 0 900 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#FF9933"/>
      <rect y="200" width="900" height="200" fill="#FFFFFF"/>
      <rect y="400" width="900" height="200" fill="#138808"/>
      <g transform="translate(450,300)">
        <circle r="85" fill="none" stroke="#000080" strokeWidth="8"/>
        <circle r="12" fill="#000080"/>
        <g stroke="#000080" strokeWidth="3">
          {[...Array(24)].map((_, i) => (
            <line key={i} x1="0" y1="0" x2="80" y2="0" transform={`rotate(${i * 15})`} />
          ))}
        </g>
      </g>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   1. TreeCounter
═══════════════════════════════════════════════════════════════ */

/** Animates a number from 0 → target */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return ctrl.stop;
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

export function TreeCounter({ count = 0 }) {
  return (
    <div className="eco-root">
      <style>{GLOBAL_CSS}</style>

      <div
        className="eco-grain"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: `linear-gradient(135deg, ${T.forest} 0%, ${T.forestMid} 60%, ${T.leaf} 100%)`,
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: `0 8px 32px ${T.shadowGreen}, 0 2px 8px rgba(0,0,0,0.12)`,
          overflow: 'hidden',
        }}
      >
        {/* Decorative circle behind icon */}
        <div style={{
          position: 'absolute',
          top: '-28px', right: '-28px',
          width: '120px', height: '120px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40px', right: '60px',
          width: '90px', height: '90px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Icon / Image bubble */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
          style={{
            position: 'relative',
            flexShrink: 0,
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.14)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=120&q=80"
            alt="Tree"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '13px' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-8px',
            background: T.forestMid,
            borderRadius: '50%',
            padding: '4px',
            border: '2px solid #fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}>
            <TreePine size={14} color="#fff" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: '36px',
              lineHeight: 1,
              color: '#fff',
              letterSpacing: '-0.5px',
              marginBottom: '5px',
            }}
          >
            <AnimatedNumber value={count} />
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: T.mint,
            }}
          >
            Trees Planted
          </motion.p>
        </div>

        {/* Subtle sparkle accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          style={{ marginLeft: 'auto', opacity: 0.6 }}
        >
          <Sparkles size={20} color={T.mint} />
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. BadgeDisplay
═══════════════════════════════════════════════════════════════ */

const BADGE_COLORS = [
  { bg: ['#082f49', '#0369a1'], border: '#38bdf8', icon: '#e0f2fe' },
  { bg: ['#0c4a6e', '#0284c7'], border: '#7dd3fc', icon: '#f0f9ff' },
  { bg: ['#075985', '#0ea5e9'], border: '#bae6fd', icon: '#ffffff' },
  { bg: ['#0369a1', '#38bdf8'], border: '#e0f2fe', icon: '#ffffff' },
  { bg: ['#0284c7', '#7dd3fc'], border: '#f0f9ff', icon: '#ffffff' },
];

export function BadgeDisplay({ badges = [] }) {
  if (!badges.length) return null;

  return (
    <div className="eco-root">
      <style>{GLOBAL_CSS}</style>

      {/* Section heading */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          height: '1px',
          flex: 1,
          background: `linear-gradient(90deg, ${T.leaf} 0%, transparent 100%)`,
        }} />
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: T.stone,
        }}>
          Earned Badges
        </p>
        <div style={{
          height: '1px',
          flex: 1,
          background: `linear-gradient(90deg, transparent 0%, ${T.leaf} 100%)`,
        }} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {badges.map((badge, i) => {
          const color = BADGE_COLORS[i % BADGE_COLORS.length];
          return (
            <motion.div
              key={badge}
              initial={{ scale: 0, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{
                delay: i * 0.12,
                type: 'spring',
                stiffness: 260,
                damping: 18,
              }}
              title={badge}
              style={{
                position: 'relative',
                width: '76px',
                height: '76px',
                borderRadius: '20px',
                background: `linear-gradient(145deg, ${color.bg[0]}, ${color.bg[1]})`,
                border: `2px solid ${color.border}40`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'default',
                boxShadow: `0 6px 20px ${color.bg[0]}55, inset 0 1px 0 rgba(255,255,255,0.15)`,
                overflow: 'hidden',
              }}
            >
              {/* Inner glow ring */}
              <div style={{
                position: 'absolute',
                inset: '4px',
                borderRadius: '14px',
                border: `1px solid ${color.border}30`,
                pointerEvents: 'none',
              }} />

              <IndianFlag size={20} />

              {/* Badge number */}
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                color: color.icon,
                opacity: 0.75,
                fontFamily: "'DM Sans', sans-serif",
                textTransform: 'uppercase',
              }}>
                #{i + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Tooltip labels below */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
        {badges.map((badge, i) => (
          <div key={badge} style={{ width: '76px' }}>
            <p style={{
              fontSize: '10.5px',
              fontWeight: '600',
              color: T.stone,
              textAlign: 'center',
              letterSpacing: '0.2px',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {badge}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. CertificateCard
═══════════════════════════════════════════════════════════════ */

export function CertificateCard({ url }) {
  return (
    <div className="eco-root">
      <style>{GLOBAL_CSS}</style>

      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="eco-cert-link"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '22px 24px',
          background: T.cream,
          borderRadius: '18px',
          border: `1.5px solid ${T.amberLight}`,
          textDecoration: 'none',
          boxShadow: `0 4px 24px ${T.shadowAmber}, 0 1px 4px rgba(0,0,0,0.06)`,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Warm gradient wash */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '180px', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.07))',
          pointerEvents: 'none',
        }} />

        {/* Icon block */}
        <motion.div
          whileHover={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.5 }}
          style={{
            flexShrink: 0,
            width: '58px',
            height: '58px',
            borderRadius: '15px',
            background: `linear-gradient(145deg, ${T.amber}, ${T.gold})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 16px ${T.shadowAmber}, inset 0 1px 0 rgba(255,255,255,0.25)`,
          }}
        >
          <Award size={28} color="#fff" strokeWidth={1.8} />
        </motion.div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: '16px',
            color: T.ink,
            marginBottom: '4px',
            lineHeight: 1.2,
          }}>
            Responsible Citizen Certificate
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={12} color={T.amber} strokeWidth={2} />
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: T.amber,
              letterSpacing: '0.3px',
            }}>
              Download PDF
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div className="eco-cert-arrow" style={{
          flexShrink: 0,
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: T.amberLight,
          border: `1px solid ${T.gold}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7.5 4l3.5 3-3.5 3" stroke={T.amber} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Demo — shows all three on a parchment background
═══════════════════════════════════════════════════════════════ */
export default function EcoDemo() {
  const demoUrl = '#certificate';
  const demoBadges = ['Pioneer', 'Planter', 'Champion', 'Guardian', 'Hero'];

  return (
    <>
      <style>{`
        body { margin: 0; background: #f1f5f9; }
        .eco-demo-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #f8fafc 0%, #e0f2fe 50%, #f8fafc 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .eco-demo-card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border-radius: 28px;
          padding: 36px 32px;
          box-shadow:
            0 20px 60px rgba(2, 132, 199, 0.10),
            0 4px 16px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          gap: 32px;
          border: 1px solid rgba(2, 132, 199, 0.08);
        }
        .eco-demo-title {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: 22px;
          color: #0c4a6e;
          letter-spacing: -0.3px;
          text-align: center;
          margin-bottom: -16px;
        }
        .eco-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #bae6fd, transparent);
        }
      `}</style>

      <div className="eco-demo-page">
        <div className="eco-demo-card">

          <p className="eco-demo-title">💎 Your Impact Dashboard</p>

          <div className="eco-divider" />

          <TreeCounter count={1847} />

          <div className="eco-divider" />

          <BadgeDisplay badges={demoBadges} />

          <div className="eco-divider" />

          <CertificateCard url={demoUrl} />

        </div>
      </div>
    </>
  );
}