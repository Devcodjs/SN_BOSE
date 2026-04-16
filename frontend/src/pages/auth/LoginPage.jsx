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
const IconLogin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7ab8d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7ab8d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const GoogleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const features = [
  { icon: <IconPin />, text: 'GPS-powered issue reporting' },
  { icon: <IconShield />, text: 'Real-time resolution tracking' },
  { icon: <IconTree />, text: 'Tree planting rewards program' },
];

const stats = [
  { num: '12K+', lbl: 'Issues resolved' },
  { num: '4.8★', lbl: 'App rating' },
  { num: '38', lbl: 'Cities active' },
];

/* ─── styles as a JS object map ─── */
const s = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f8ff',
    padding: '2.5rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: 960,
    background: '#ffffff',
    borderRadius: 24,
    border: '1px solid #c9e2f7',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(14,165,233,0.10)',
  },
  left: {
    width: '42%',
    background: '#0ea5e9',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '3rem 2.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  leftBubble1: {
    position: 'absolute', top: -80, right: -80,
    width: 200, height: 200, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    pointerEvents: 'none',
  },
  leftBubble2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 150, height: 150, borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    pointerEvents: 'none',
  },
  brandIcon: {
    width: 52, height: 52, borderRadius: 14,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  brandH1: {
    fontSize: 28, fontWeight: 600, color: '#ffffff',
    margin: '0 0 0.5rem', lineHeight: 1.2,
  },
  brandP: {
    fontSize: 14, color: 'rgba(255,255,255,0.82)',
    lineHeight: 1.7, margin: 0,
  },
  featuresWrap: { marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: 12 },
  feature: { display: 'flex', alignItems: 'center', gap: 12 },
  featIcon: {
    width: 34, height: 34, borderRadius: 9,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  featText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: 0 },
  testimonial: {
    marginTop: '2rem',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: '1.1rem 1.25rem',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  testimonialQ: {
    fontSize: 13, color: 'rgba(255,255,255,0.88)',
    lineHeight: 1.6, fontStyle: 'italic', margin: 0,
  },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 },
  avatar: {
    width: 28, height: 28, borderRadius: '50%',
    background: 'rgba(255,255,255,0.22)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 600, color: '#ffffff',
  },
  authorName: { fontSize: 12, color: 'rgba(255,255,255,0.68)', margin: 0 },
  statsRow: { display: 'flex', gap: '1.75rem', marginTop: '2.25rem' },
  statNum: { fontSize: 20, fontWeight: 600, color: '#ffffff', margin: 0 },
  statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: 2 },
  right: {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '3rem 2.5rem',
  },
  formWrap: { width: '100%', maxWidth: 380 },
  eyebrow: {
    fontSize: 12, fontWeight: 600, color: '#0ea5e9',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
  },
  formH2: { fontSize: 26, fontWeight: 600, color: '#1a5f7a', margin: '0 0 0.35rem' },
  formSub: { fontSize: 14, color: '#5a8fa3', margin: 0 },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fff5f5', border: '1px solid #fca5a5',
    borderRadius: 10, padding: '10px 14px',
    fontSize: 13, color: '#e05252', marginBottom: '1.25rem',
  },
  socialRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '1.5rem 0' },
  socialBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '10px 12px', borderRadius: 10,
    border: '1.5px solid #c9e2f7', background: '#f8fcff',
    fontSize: 13, fontWeight: 500, color: '#2a7fa8',
    cursor: 'pointer',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 1.5rem' },
  dividerLine: { flex: 1, height: 1, background: '#daeef9' },
  dividerText: { fontSize: 12, color: '#8bbdd4' },
  label: {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#2a7fa8', marginBottom: 6,
  },
  input: {
    width: '100%', padding: '11px 14px',
    borderRadius: 10, border: '1.5px solid #c9e2f7',
    background: '#f8fcff', fontSize: 14, color: '#1a5f7a',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  pwWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
    display: 'flex', alignItems: 'center',
  },
  forgotRow: { textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1.25rem' },
  forgotLink: { fontSize: 13, color: '#0ea5e9', textDecoration: 'none' },
  submitBtn: {
    width: '100%', padding: '12px',
    background: '#0ea5e9', border: 'none',
    borderRadius: 10, color: '#ffffff',
    fontSize: 15, fontWeight: 600,
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  signupRow: { marginTop: '1.5rem', textAlign: 'center', fontSize: 13, color: '#5a8fa3' },
  signupLink: { color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
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
            {/* Brand */}
            <div style={s.brandIcon}><IconBuilding /></div>
            <h1 style={s.brandH1}>CivicPulse</h1>
            <p style={s.brandP}>
              Report civic issues, track resolutions, and earn rewards for making your city better.
            </p>

            {/* Feature list */}
            <div style={s.featuresWrap}>
              {features.map((f, i) => (
                <div key={i} style={s.feature}>
                  <div style={s.featIcon}>{f.icon}</div>
                  <span style={s.featText}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div style={s.testimonial}>
              <p style={s.testimonialQ}>
                "Reported a broken streetlight and it was fixed in 3 days. This app actually works!"
              </p>
              <div style={s.testimonialAuthor}>
                <div style={s.avatar}>PR</div>
                <span style={s.authorName}>Priya R. — Bengaluru citizen</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ ...s.statsRow, position: 'relative', zIndex: 1 }}>
            {stats.map((st, i) => (
              <div key={i}>
                <p style={s.statNum}>{st.num}</p>
                <p style={s.statLbl}>{st.lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={s.right}>
          <div style={s.formWrap}>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={s.eyebrow}>Welcome back</p>
              <h2 style={s.formH2}>Sign in to your account</h2>
              <p style={s.formSub}>Good to see you again — let's get things done.</p>
            </div>

            {/* Error */}
            {error && (
              <div style={s.errorBox}>
                <IconAlert />
                {error}
              </div>
            )}

            {/* Social buttons */}
            <div style={s.socialRow}>
              <button style={s.socialBtn} type="button">
                <GoogleLogo /> Google
              </button>
              <button style={s.socialBtn} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
            </div>

            {/* Divider */}
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerText}>or continue with email</span>
              <div style={s.dividerLine} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={s.label} htmlFor="email">Email address</label>
                <input
                  id="email" type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={s.input}
                  onFocus={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#c9e2f7'; e.target.style.background = '#f8fcff'; }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '0.6rem' }}>
                <label style={s.label} htmlFor="password">Password</label>
                <div style={s.pwWrap}>
                  <input
                    id="password" type={showPw ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ ...s.input, paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#c9e2f7'; e.target.style.background = '#f8fcff'; }}
                  />
                  <button type="button" style={s.eyeBtn} onClick={() => setShowPw(!showPw)}>
                    {showPw ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div style={s.forgotRow}>
                <Link to="/forgot-password" style={s.forgotLink}>Forgot password?</Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ ...s.submitBtn, opacity: loading ? 0.75 : 1 }}
              >
                <IconLogin />
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p style={s.signupRow}>
              Don't have an account?{' '}
              <Link to="/register" style={s.signupLink}>Create one — it's free</Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}