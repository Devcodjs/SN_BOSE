/**
 * LocationFormPage.jsx
 * Full-page location form using the MapPicker component.
 * Professional blue/white palette.
 *
 * Dependencies:
 *   npm install leaflet react-leaflet lucide-react
 *   Import this file in your app entry point.
 */

import { useState, useCallback } from 'react';
import { MapPin, User, Phone, Mail, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import MapPicker from '../../components/map/MapPicker'; // adjust path as needed

/* ═══════════════════════════════════════════════════════════════════════
   Global styles injected once
═══════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f8fafc;
    min-height: 100vh;
    color: #1e293b;
  }

  /* ── Input base ── */
  .lf-input {
    width: 100%;
    padding: 12px 16px;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    color: #334155;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: border-color 0.18s, box-shadow 0.18s;
    outline: none;
  }
  .lf-input::placeholder { color: #94a3b8; }
  .lf-input:hover  { border-color: #94a3b8; }
  .lf-input:focus  {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
  }

  /* ── Select ── */
  select.lf-input { cursor: pointer; appearance: none; }

  /* ── Textarea ── */
  textarea.lf-input { resize: vertical; min-height: 90px; }

  /* ── Submit button ── */
  .lf-submit {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: opacity 0.15s, transform 0.12s;
    box-shadow: 0 4px 16px rgba(14,165,233,0.25);
  }
  .lf-submit:hover:not(:disabled)  { opacity: 0.9; transform: translateY(-1px); }
  .lf-submit:active:not(:disabled) { transform: scale(0.98); }
  .lf-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f8fafc; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
`;

/* ═══════════════════════════════════════════════════════════════════════
   Design tokens (JS-side)
═══════════════════════════════════════════════════════════════════════ */
const T = {
  pageBg:        '#f8fafc',
  cardBg:        '#ffffff',
  sectionBg:     '#f1f5f9',
  sectionBorder: '#e2e8f0',
  labelColor:    '#475569',
  headingColor:  '#0f172a',
  accentBlue:    '#0ea5e9',
  accentAmber:   '#f59e0b',
  divider:       '#e2e8f0',
  mutedText:     '#64748b',
};

/* ═══════════════════════════════════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════════════════════════════════ */

/** Section card wrapper */
function Section({ label, icon: Icon, accent = false, children }) {
  return (
    <div style={{
      background: T.cardBg,
      border: `1.5px solid ${accent ? '#bae6fd' : T.sectionBorder}`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: accent
        ? '0 4px 28px rgba(14,165,233,0.1)'
        : '0 2px 12px rgba(0,0,0,0.03)',
    }}>
      {/* Section header strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 20px',
        background: accent
          ? 'linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%)'
          : '#f8fafc',
        borderBottom: `1px solid ${T.divider}`,
      }}>
        {Icon && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: accent ? '#e0f2fe' : '#f1f5f9',
          }}>
            <Icon size={15} color={accent ? '#0284c7' : T.labelColor} />
          </span>
        )}
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          color: accent ? '#0284c7' : T.labelColor,
        }}>
          {label}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

/** Label + input row */
function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12.5px',
        fontWeight: '600',
        color: T.labelColor,
        letterSpacing: '0.3px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {label}
        {required && <span style={{ color: T.accentAmber, fontSize: '14px', lineHeight: 1 }}>*</span>}
      </label>
      {children}
      {hint && (
        <span style={{ fontSize: '11.5px', color: T.mutedText }}>{hint}</span>
      )}
    </div>
  );
}

/** Two-column grid helper */
function Row({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    }}>
      {children}
    </div>
  );
}

/* ─── Success screen ──────────────────────────────────────────────────── */
function SuccessScreen({ data, onReset }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '24px',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: '#dcfce7',
        border: '2px solid #86efac',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CheckCircle2 size={36} color="#22c55e" />
      </div>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: T.headingColor, marginBottom: '8px' }}>
          Submission received!
        </h2>
        <p style={{ fontSize: '14px', color: T.mutedText, maxWidth: '340px' }}>
          Your location details have been saved successfully.
        </p>
      </div>

      {/* Summary card */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: T.cardBg,
        border: `1px solid ${T.sectionBorder}`,
        borderRadius: '14px',
        padding: '18px 22px',
        textAlign: 'left',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}>
        {[
          ['Name',      `${data.firstName} ${data.lastName}`],
          ['Email',     data.email],
          ['Phone',     data.phone || '—'],
          ['Category',  data.category || '—'],
          ['Latitude',  data.coords ? data.coords.latitude.toFixed(6) : '—'],
          ['Longitude', data.coords ? data.coords.longitude.toFixed(6) : '—'],
        ].map(([k, v]) => (
          <div key={k} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: `1px solid ${T.divider}`,
            fontSize: '13px',
          }}>
            <span style={{ color: T.labelColor, fontWeight: '500' }}>{k}</span>
            <span style={{
              color: T.headingColor,
              fontWeight: 500,
              fontFamily: k === 'Latitude' || k === 'Longitude' ? 'JetBrains Mono, monospace' : 'inherit',
            }}>{v}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        style={{
          padding: '10px 28px',
          background: 'transparent',
          border: `1.5px solid ${T.accentBlue}`,
          color: '#0284c7',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#e0f2fe'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        Submit another
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════════ */
export default function LocationFormPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    category:  '',
    notes:     '',
  });
  const [coords,    setCoords]    = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const set = useCallback((key) => (e) =>
    setForm(prev => ({ ...prev, [key]: e.target.value })), []);

  const canSubmit = form.firstName && form.lastName && form.email && coords;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setForm({ firstName:'', lastName:'', email:'', phone:'', category:'', notes:'' });
    setCoords(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{ minHeight: '100vh', background: T.pageBg }}>
          <SuccessScreen data={{ ...form, coords }} onReset={handleReset} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{ minHeight: '100vh', background: T.pageBg }}>

        {/* ── Top nav bar ── */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${T.divider}`,
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: T.headingColor, letterSpacing: '-0.2px' }}>
              GeoPoint
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: T.mutedText }}>
            <ChevronRight size={14} />
            <span>Location Registration</span>
          </div>
        </header>

        {/* ── Page hero ── */}
        <div style={{
          background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
          padding: '40px 24px 32px',
          borderBottom: `1px solid ${T.divider}`,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1.2px', color: '#0284c7', textTransform: 'uppercase', marginBottom: '10px' }}>
            Location Registration Form
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: T.headingColor, lineHeight: 1.2, marginBottom: '10px' }}>
            Register your location
          </h1>
          <p style={{ fontSize: '14px', color: T.mutedText, maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
            Fill in your contact details and pinpoint your location on the map below for accurate geo-tagging.
          </p>
        </div>

        {/* ── Form body ── */}
        <div style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '32px 20px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>

          {/* Step indicator */}
          {[
            { n: 1, label: 'Personal details' },
            { n: 2, label: 'Map location' },
            { n: 3, label: 'Submit' },
          ].reduce((acc, step, i, arr) => {
            const done = (step.n === 1 && form.firstName) ||
                         (step.n === 2 && coords) ||
                          step.n === 3;
            acc.push(
              <div key={step.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700',
                  background: done ? T.accentBlue : '#f1f5f9',
                  color: done ? '#fff' : T.mutedText,
                  border: done ? 'none' : `1.5px solid ${T.sectionBorder}`,
                  transition: 'background 0.3s',
                }}>
                  {step.n}
                </div>
                <span style={{ fontSize: '11px', color: done ? '#0284c7' : T.mutedText, fontWeight: '600', whiteSpace: 'nowrap' }}>
                  {step.label}
                </span>
              </div>
            );
            if (i < arr.length - 1) {
              acc.push(
                <div key={`d${i}`} style={{
                  flex: 1,
                  height: '1px',
                  background: T.divider,
                  marginTop: '15px',
                  maxWidth: '80px',
                }} />
              );
            }
            return acc;
          }, []).reduce((el) => (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '0',
              padding: '0 20px 4px',
            }}>
              {el}
            </div>
          ))}

          {/* ── Section 1 : Personal ── */}
          <Section label="Personal information" icon={User}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Row>
                <Field label="First name" required>
                  <input className="lf-input" placeholder="Arjun" value={form.firstName} onChange={set('firstName')} />
                </Field>
                <Field label="Last name" required>
                  <input className="lf-input" placeholder="Sharma" value={form.lastName} onChange={set('lastName')} />
                </Field>
              </Row>
              <Row>
                <Field label="Email address" required>
                  <input className="lf-input" type="email" placeholder="arjun@example.com" value={form.email} onChange={set('email')} />
                </Field>
                <Field label="Phone number">
                  <input className="lf-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                </Field>
              </Row>
            </div>
          </Section>

          {/* ── Section 2 : Category ── */}
          <Section label="Classification" icon={Mail}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Field label="Category" hint="Choose the type of location you are registering">
                <select className="lf-input" value={form.category} onChange={set('category')}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px',
                  }}>
                  <option value="">— Select a category —</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Government">Government</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Additional notes">
                <textarea className="lf-input" placeholder="Any relevant details about this location…" value={form.notes} onChange={set('notes')} />
              </Field>
            </div>
          </Section>

          {/* ── Section 3 : Map ── */}
          <Section label="Pin your location" icon={MapPin} accent>
            <MapPicker onChange={setCoords} />
            {!coords && (
              <p style={{ marginTop: '12px', fontSize: '12px', color: T.mutedText, textAlign: 'center' }}>
                ↑ Click anywhere on the map or use GPS to set your location
              </p>
            )}
          </Section>

          {/* ── Submit ── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <button
              className="lf-submit"
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Submitting…
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit registration
                </>
              )}
            </button>

            {!canSubmit && (
              <p style={{ fontSize: '12px', color: T.mutedText, textAlign: 'center' }}>
                {!form.firstName || !form.lastName || !form.email
                  ? '⚠ Please fill in your name and email to continue.'
                  : '⚠ Please pin a location on the map to submit.'}
              </p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{
          textAlign: 'center',
          padding: '20px',
          fontSize: '12px',
          color: T.mutedText,
          borderTop: `1px solid ${T.divider}`,
        }}>
          GeoPoint &copy; {new Date().getFullYear()} &mdash; All data handled securely
        </footer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
