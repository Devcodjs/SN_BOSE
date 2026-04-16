import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Shared Styles (Corporate Navy & Azure Theme) ---
const s = {
  section: { padding: '80px 24px' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  headingText: { fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 700, marginBottom: '12px' }, // Blue 600
  headingTitle: { fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.02em' }, // Slate 900
  headingDesc: { fontSize: '15px', color: '#475569', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }, // Slate 600
  gridAuto: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' },
};

function StatItem({ value, label }) {
  return (
    <div style={{ flex: '1 1 200px', padding: '32px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '36px', fontWeight: 700, color: '#fff', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function StepCard({ num, title, desc, icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '40px 32px', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.03)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '120px', fontWeight: 800, color: '#f8fafc', zIndex: 0, lineHeight: 1 }}>{num.replace('Step ', '')}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '6px 14px', borderRadius: '99px', marginBottom: '24px', textTransform: 'uppercase' }}>{num}</div>
        <div style={{ width: '54px', height: '54px', background: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#2563eb' }}>{icon}</div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.75 }}>{desc}</p>
      </div>
    </div>
  );
}

function FeatCard({ title, desc, icon }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '32px 24px', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid transparent', cursor: 'default' }}
         onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.border = '1px solid #bfdbfe'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.08)'; }}
         onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#2563eb' }}>{icon}</div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

const steps = [
  {
    num: 'Step 01', title: 'Report issue', desc: "Snap a photo, drop a pin on the map, and write a brief description. We route it automatically.",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
  },
  {
    num: 'Step 02', title: 'Authorities resolve', desc: 'Municipal bodies review the ticket, assign it to field engineers, and post a photo when fixed.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  },
  {
    num: 'Step 03', title: 'Earn your reward', desc: 'You get a digital certificate, a national citizen badge, and a tree is planted in your honor.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
  }
];

const features = [
  { title: 'Precision GPS tracking', desc: 'Mark exact municipal issue coordinates via an interactive map.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { title: 'High-res evidence', desc: 'Attach multiple before-and-after photos with automatic dynamic compression.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> },
  { title: 'Live admin analytics', desc: 'Real-time dashboard charting heatmaps and resolution speed metrics.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { title: 'Democratic upvoting', desc: 'Community members upvote critical issues to rush their priorities.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> },
  { title: 'Green rewards', desc: 'A verified sapling planted locally for every major issue you help resolve.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.35.54.13 1.19.73 1.04C6.89 19.72 10 18 12 18c4 0 8-4 8-8 0-2-1-4-3-4z"/></svg> },
  { title: 'Official certificates', desc: 'Auto-generated PDF credentials celebrating your civic duty.', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> }
];

const trustItems = [
  { title: 'Secure & private', desc: 'Your data is encrypted and never shared without your explicit consent.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { title: 'Fast response', desc: 'Average resolution under 72 hours across all registered municipalities.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { title: 'Govt-integrated', desc: 'Connecting citizens from village panchayats to metro municipalities.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> }
];

export default function LandingPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* HERO (Deep Navy to Royal Blue Gradient) */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', padding: '100px 24px 120px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '99px', padding: '8px 20px', fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '40px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
            Built for Indian Citizens
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Your voice builds<br />
            <span style={{ color: '#93c5fd' }}>better communities</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'rgba(255,255,255,0.85)', maxWidth: '580px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            Report civic issues — roads, water, sanitation — with photo and GPS evidence. Track resolutions in real time and earn rewards for active citizenship.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin' : '/dashboard'} style={{ textDecoration: 'none' }}>
                <button style={{ background: '#fff', color: '#0f172a', border: 'none', borderRadius: '12px', padding: '16px 32px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Go to Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button style={{ background: '#fff', color: '#0f172a', border: 'none', borderRadius: '12px', padding: '16px 32px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    Get started free
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '14px 32px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Sign in
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Micro-trust indicators */}
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Govt. verified secure', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
              { label: 'Pinpoint accuracy', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
              { label: 'Cloud infrastructure', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg> }
            ].map((t, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                {t.icon}{t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS (Slate 900 Background) */}
      <section style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ ...s.container, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          <StatItem value="12K+" label="Issues resolved" />
          <StatItem value="18" label="Active Cities" />
          <StatItem value="95%" label="Resolution rate" />
          <StatItem value="4.8K" label="Active Users" />
        </div>
      </section>

      {/* HOW IT WORKS (Light Slate Background) */}
      <section style={{ ...s.section, background: '#f8fafc' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={s.headingText}>How it works</div>
            <h2 style={s.headingTitle}>Three simple steps</h2>
            <p style={s.headingDesc}>From reporting a pothole to watching the resolution happen in real-time, we've streamlined civic engagement.</p>
          </div>
          <div style={s.gridAuto}>
            {steps.map((step, i) => <StepCard key={i} {...step} />)}
          </div>
        </div>
      </section>

      {/* FEATURES (White Background) */}
      <section style={{ ...s.section, background: '#ffffff' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={s.headingText}>Features</div>
            <h2 style={s.headingTitle}>Everything you need</h2>
            <p style={s.headingDesc}>Built with powerful tools to ensure transparency, accountability, and user delight across every neighborhood.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {features.map((f, i) => <FeatCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* TRUST (Soft Blue-Tinted Background) */}
      <section style={{ ...s.section, background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ ...s.container, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
          {trustItems.map((t, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{t.icon}</div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{t.title}</h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA (Solid Royal Blue) */}
      <section style={{ background: '#2563eb', padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#fff', marginBottom: '20px', letterSpacing: '-0.02em' }}>Ready to transform your neighborhood?</h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.8 }}>
          Join thousands of proactive citizens using CivicPulse. It takes less than 60 seconds to make your first report.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {['Free forever', 'No ads', 'Works offline', 'Regional languages'].map((c, i) => (
            <span key={i} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '99px', padding: '6px 16px', fontSize: '13px', fontWeight: 500, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              {c}
            </span>
          ))}
        </div>

        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#fff', color: '#1e3a8a', border: 'none', borderRadius: '12px', padding: '16px 36px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Create free account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </Link>
      </section>

      {/* FOOTER (Deepest Slate) */}
      <footer style={{ background: '#090e17', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['About Platform', 'Privacy Policy', 'Terms of Service', 'Contact Municipal Support'].map((l, i) => (
            <a key={i} href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>© 2026 CivicPulse — Built with a commitment to a better tomorrow.</p>
      </footer>

    </div>
  );
}