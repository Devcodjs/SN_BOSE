import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/* ─── tiny inline icons (no black, stroke only) ─── */
const IconBuilding = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 7v14M21 7v14M6 21V11m4 10V7m4 14V11m4 10V7M3 7l9-4 9 4"/>
  </svg>
);
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconTree = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 22M9.18 22C8.29 17.28 6 15 3 14M3 6c5.33 1 8.67 4.67 10 8"/>
  </svg>
);
const IconUserPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const features = [
  { icon: <IconShield />, text: 'Free for all citizens' },
  { icon: <IconPin />, text: 'GPS-powered reporting' },
  { icon: <IconTree />, text: 'Earn rewards & certificates' },
];

/* ─── styles as a JS object map (Navy & Azure Blue Theme) ─── */
const s = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc', // Clean slate-50 background
    padding: '2.5rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: 960,
    background: '#ffffff',
    borderRadius: 24,
    border: '1px solid #e2e8f0',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(15, 23, 42, 0.08)', // Subtle slate shadow
  },
  left: {
    width: '42%',
    background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', // Deep Navy to Royal Blue
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem 2.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  leftBubble1: {
    position: 'absolute', top: -80, right: -80,
    width: 200, height: 200, borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    pointerEvents: 'none',
  },
  leftBubble2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 150, height: 150, borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    pointerEvents: 'none',
  },
  brandIcon: {
    width: 52, height: 52, borderRadius: 14,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  brandH1: {
    fontSize: 32, fontWeight: 600, color: '#ffffff',
    margin: '0 0 0.5rem', lineHeight: 1.2,
  },
  brandP: {
    fontSize: 15, color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7, margin: 0,
  },
  featuresWrap: { marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: 16 },
  feature: { display: 'flex', alignItems: 'center', gap: 12 },
  featIcon: {
    width: 38, height: 38, borderRadius: 10,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  featText: { fontSize: 14, color: 'rgba(255,255,255,0.95)', margin: 0 },
  right: {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '3rem 2.5rem',
  },
  formWrap: { width: '100%', maxWidth: 400 },
  eyebrow: {
    fontSize: 12, fontWeight: 700, color: '#2563eb', // Vibrant Blue
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
  },
  formH2: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }, // Slate 900
  formSub: { fontSize: 14, color: '#64748b', margin: 0 }, // Slate 500
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 10, padding: '10px 14px',
    fontSize: 13, color: '#ef4444', marginBottom: '1.25rem',
  },
  label: {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#0f172a', marginBottom: 6, // Slate 900
  },
  labelOpt: {
    color: '#94a3b8', fontWeight: 400, marginLeft: 4,
  },
  input: {
    width: '100%', padding: '11px 14px',
    borderRadius: 10, border: '1.5px solid #bfdbfe', // Blue 200
    background: '#eff6ff', // Blue 50
    fontSize: 14, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'all 0.2s',
  },
  inputGroup: { marginBottom: '1.1rem' },
  gridRow: { 
    display: 'grid', gridTemplateColumns: '1fr 1fr', 
    gap: '12px', marginBottom: '1.1rem' 
  },
  pwWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
    display: 'flex', alignItems: 'center',
  },
  submitBtn: {
    width: '100%', padding: '12px', marginTop: '0.5rem',
    background: '#2563eb', border: 'none', // Solid Blue 600
    borderRadius: 10, color: '#ffffff',
    fontSize: 15, fontWeight: 600,
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all 0.2s',
  },
  loginRow: { marginTop: '1.5rem', textAlign: 'center', fontSize: 13, color: '#64748b' },
  loginLink: { color: '#2563eb', fontWeight: 700, textDecoration: 'none' },
};

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/dashboard');
    } catch (err) { 
      setError(err.response?.data?.message || 'Registration failed'); 
    } finally { 
      setLoading(false); 
    }
  };

  // Helper for inline focus styling updated to Blue colors
  const handleFocus = (e) => {
    e.target.style.borderColor = '#2563eb'; // Blue 600
    e.target.style.background = '#ffffff';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#bfdbfe'; // Blue 200
    e.target.style.background = '#eff6ff'; // Blue 50
  };

  return (
    <div style={s.page}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={s.card}
      >

        {/* ── LEFT PANEL ── */}
        <div style={s.left}>
          <div style={s.leftBubble1} />
          <div style={s.leftBubble2} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={s.brandIcon}><IconBuilding /></div>
            <h1 style={s.brandH1}>Join CivicPulse</h1>
            <p style={s.brandP}>
              Create your account and start making a difference in your local community today.
            </p>

            <div style={s.featuresWrap}>
              {features.map((f, i) => (
                <div key={i} style={s.feature}>
                  <div style={s.featIcon}>{f.icon}</div>
                  <span style={s.featText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={s.right}>
          <div style={s.formWrap}>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={s.eyebrow}>Start your journey</p>
              <h2 style={s.formH2}>Create an Account</h2>
              <p style={s.formSub}>Fill in your details to get started.</p>
            </div>

            {/* Error */}
            {error && (
              <div style={s.errorBox}>
                <IconAlert />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div style={s.inputGroup}>
                <label style={s.label} htmlFor="name">Full Name</label>
                <input
                  id="name" name="name" type="text" required
                  value={form.name} onChange={handleChange}
                  placeholder="Rahul Sharma"
                  style={s.input}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              {/* Email Address */}
              <div style={s.inputGroup}>
                <label style={s.label} htmlFor="email">Email Address</label>
                <input
                  id="email" name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  style={s.input}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              {/* Phone */}
              <div style={s.inputGroup}>
                <label style={s.label} htmlFor="phone">
                  Phone <span style={s.labelOpt}>(optional)</span>
                </label>
                <input
                  id="phone" name="phone" type="text"
                  value={form.phone} onChange={handleChange}
                  placeholder="+91 9876543210"
                  style={s.input}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              {/* Passwords Row */}
              <div style={s.gridRow}>
                {/* Password */}
                <div>
                  <label style={s.label} htmlFor="password">Password</label>
                  <div style={s.pwWrap}>
                    <input
                      id="password" name="password" type={showPw ? 'text' : 'password'} required
                      value={form.password} onChange={handleChange}
                      placeholder="Min 6 chars"
                      style={{ ...s.input, paddingRight: 40 }}
                      onFocus={handleFocus} onBlur={handleBlur}
                    />
                    <button type="button" style={s.eyeBtn} onClick={() => setShowPw(!showPw)}>
                      {showPw ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={s.label} htmlFor="confirm">Confirm</label>
                  <div style={s.pwWrap}>
                    <input
                      id="confirm" name="confirm" type={showConfirmPw ? 'text' : 'password'} required
                      value={form.confirm} onChange={handleChange}
                      placeholder="Re-enter"
                      style={{ ...s.input, paddingRight: 40 }}
                      onFocus={handleFocus} onBlur={handleBlur}
                    />
                    <button type="button" style={s.eyeBtn} onClick={() => setShowConfirmPw(!showConfirmPw)}>
                      {showConfirmPw ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ ...s.submitBtn, opacity: loading ? 0.75 : 1 }}
                onMouseOver={e => !loading && (e.target.style.background = '#1d4ed8')} // Blue 700
                onMouseOut={e => !loading && (e.target.style.background = '#2563eb')} // Blue 600
              >
                <IconUserPlus />
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            <p style={s.loginRow}>
              Already have an account?{' '}
              <Link to="/login" style={s.loginLink}>Sign in</Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}