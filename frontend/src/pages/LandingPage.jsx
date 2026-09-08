import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Camera, CheckCircle2, Clock, ShieldCheck,
  TrendingUp, Award, ThumbsUp, ArrowRight, Sparkles,
  TreePine, Activity,
  Check, Lock, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CityZenLogo } from '../components/layout/Navbar';

/* ─────────────────────────────────────────────
   HERO INTERACTIVE SHOWCASE (Report → Track → Resolve)
───────────────────────────────────────────── */
function HeroInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState(1); // 0: Report, 1: Track, 2: Resolve
  const [upvotes, setUpvotes] = useState(48);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = (e) => {
    e.stopPropagation();
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    } else {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const showcaseData = [
    {
      step: '01',
      title: 'Report Issue',
      subtitle: 'Snap photo & drop exact GPS pin',
      badge: 'Step 1: Submitted',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeColor: '#60a5fa',
      statusText: 'Ticket #CZ-8942 Created',
      description: 'Pothole & damaged road surface near Indiranagar Metro Station.',
      tag: 'Roads & Infrastructure',
      eta: 'Auto-routed to Ward 84',
      progress: 25,
    },
    {
      step: '02',
      title: 'Track Progress',
      subtitle: 'Real-time municipal assignment',
      badge: 'Step 2: In Progress',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeColor: '#fbbf24',
      statusText: 'Assigned to Field Engineer',
      description: 'Inspection team dispatched. Materials allocated for repair work.',
      tag: 'SLA: 48h Resolution Target',
      eta: 'Completion expected in 12 hrs',
      progress: 70,
    },
    {
      step: '03',
      title: 'Resolve & Reward',
      subtitle: 'Verified proof & sapling reward',
      badge: 'Step 3: Resolved',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#34d399',
      statusText: 'Issue Fixed & Verified',
      description: 'After photo posted by municipal team. Community verified.',
      tag: '🌱 Sapling Planted',
      eta: 'Certificate Credited',
      progress: 100,
    }
  ];

  const current = showcaseData[activeTab];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      {/* Decorative ambient glowing background circles */}
      <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '220px', height: '220px', background: 'rgba(56, 189, 248, 0.15)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '220px', height: '220px', background: 'rgba(37, 99, 235, 0.2)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Main Glass Showcase Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 2,
        textAlign: 'left'
      }}>

        {/* Top Switcher Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '14px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {showcaseData.map((s, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.4)' : 'none'
                }}
              >
                <span>{s.step}</span>
                <span>{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header info row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: current.badgeBg, color: current.badgeColor, border: `1px solid ${current.badgeColor}33` }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: current.badgeColor, display: 'inline-block' }} />
                  {current.badge}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500 }}>
                  {current.statusText}
                </span>
              </div>

              {/* Interactive Upvote Pill */}
              <button
                onClick={handleUpvote}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '99px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: hasUpvoted ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  color: hasUpvoted ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
                  border: hasUpvoted ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <ThumbsUp size={13} fill={hasUpvoted ? '#60a5fa' : 'transparent'} />
                <span>{upvotes} Upvotes</span>
              </button>
            </div>

            {/* Issue Title & Description */}
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', lineHeight: 1.3 }}>
              Main Street Road & Pothole Hazard
            </h4>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.72)', marginBottom: '18px', lineHeight: 1.6 }}>
              {current.description}
            </p>

            {/* Interactive Image / Mock Graphic Container */}
            <div style={{
              height: '130px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              {/* Map grid lines simulation */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

              {/* Graphic State representation */}
              {activeTab === 0 && (
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#60a5fa' }}>
                    <MapPin size={22} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#93c5fd' }}>📍 GPS: 12.9716° N, 77.5946° E</span>
                </div>
              )}

              {activeTab === 1 && (
                <div style={{ width: '80%', zIndex: 2, textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fbbf24', fontWeight: 600, marginBottom: '6px' }}>
                    <span>Action Status: Dispatching Materials</span>
                    <span>70%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#34d399' }}>
                    <CheckCircle2 size={26} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#6ee7b7' }}>Proof Verified • Tree Sapling Awarded 🌱</span>
                </div>
              )}
            </div>

            {/* Bottom Info Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={13} style={{ color: '#60a5fa' }} />
                {current.eta}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                {current.tag}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Floating Micro-Badges around showcase */}
      <div className="hidden sm:flex" style={{
        position: 'absolute',
        top: '-16px',
        right: '-24px',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        padding: '8px 14px',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        zIndex: 3
      }}>
        <Zap size={15} style={{ color: '#38bdf8' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>48h SLA Resolution</span>
      </div>

      <div className="hidden sm:flex" style={{
        position: 'absolute',
        bottom: '-16px',
        left: '-24px',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '8px 14px',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        zIndex: 3
      }}>
        <Lock size={14} style={{ color: '#34d399' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>Encrypted Reporting</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LANDING PAGE COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#0f172a' }}>

      {/* ─────────────────────────────────────────────
         1. HERO SECTION
      ───────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(145deg, #090d16 0%, #0f172a 40%, #1e3a8a 85%, #1d4ed8 100%)',
        padding: '100px 24px 120px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Grid Lines & Glow Effects */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.25), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '10%', width: '400px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.18), transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>

            {/* Left Hero Text Column */}
            <div style={{ textAlign: 'left' }}>

              {/* Pill Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(12px)',
                borderRadius: '99px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#93c5fd',
                marginBottom: '28px'
              }}>
                <Sparkles size={14} style={{ color: '#38bdf8' }} />
                <span>Next-Gen Civic Tech Platform</span>
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', var(--font-sans)",
                fontSize: 'clamp(2.75rem, 5.2vw, 4.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                marginBottom: '24px'
              }}>
                Your City. Your Voice.<br />
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #22d3ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Your CityZen.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.80)',
                maxWidth: '560px',
                margin: '0 0 36px',
                lineHeight: 1.7
              }}>
                Report civic issues with photo and location evidence, track their progress transparently, and help build a better city.
              </p>

              {/* Hero CTA Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                {isAuthenticated ? (
                  <Link to={isAdmin ? '/admin' : '/dashboard'} style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: '#ffffff',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 0, 0, 0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)'; }}>
                      Go to Dashboard
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <button style={{
                        background: '#ffffff',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '16px 32px',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 0, 0, 0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)'; }}>
                        Get Started
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </button>
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <button style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px 28px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}>
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Micro Trust Indicators */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '24px' }}>
                {[
                  { label: 'Secure issue reporting', icon: <ShieldCheck size={16} style={{ color: '#38bdf8' }} /> },
                  { label: 'Accurate GPS reporting', icon: <MapPin size={16} style={{ color: '#38bdf8' }} /> },
                  { label: 'Transparent tracking', icon: <Activity size={16} style={{ color: '#38bdf8' }} /> }
                ].map((t, idx) => (
                  <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>
                    {t.icon}
                    {t.label}
                  </span>
                ))}
              </div>

            </div>

            {/* Right Hero Column: Interactive Visual Showcase */}
            <div>
              <HeroInteractiveShowcase />
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         2. FLOATING STATS OVERLAP STRIP
      ───────────────────────────────────────────── */}
      <div style={{ marginTop: '-48px', position: 'relative', zIndex: 10, padding: '0 24px' }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          background: '#0f172a',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
          padding: '28px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {[
            { value: '12,400+', label: 'Issues Resolved', sub: 'Verified by community' },
            { value: '18+', label: 'Active Cities', sub: 'Urban panchayats & metros' },
            { value: '94.8%', label: 'Resolution Speed', sub: 'Target SLA achieved' },
            { value: '4,800+', label: 'Active Citizens', sub: 'Engaged community' }
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center', padding: '8px 12px', borderRight: idx < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: "'Plus Jakarta Sans', var(--font-sans)",
                lineHeight: 1.1,
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', letterSpacing: '-0.01em' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
         3. HOW IT WORKS SECTION (#how-it-works)
      ───────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 24px 96px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb', display: 'block', marginBottom: '10px' }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '16px' }}>
              How CityZen Works
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7 }}>
              Make civic reporting simple, transparent, and accountable. From photo submission to verified resolution in your neighborhood.
            </p>
          </div>

          {/* 3 Step Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {[
              {
                step: '01',
                title: 'Report Issue',
                desc: 'Snap a photo, drop a pin on the map, and write a brief description. Automatic routing sends it directly to your municipal team.',
                icon: <Camera size={26} style={{ color: '#2563eb' }} />,
                bgAccent: '#eff6ff'
              },
              {
                step: '02',
                title: 'Track Progress',
                desc: 'Watch updates in real time. Municipal field engineers review tickets, allocate materials, and post status updates.',
                icon: <Activity size={26} style={{ color: '#0284c7' }} />,
                bgAccent: '#e0f2fe'
              },
              {
                step: '03',
                title: 'Resolve & Earn',
                desc: 'Receive verified before-and-after photo proof. Earn digital citizen badges and a local sapling planted in your honor.',
                icon: <Award size={26} style={{ color: '#059669' }} />,
                bgAccent: '#ecfdf5'
              }
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '36px 32px',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px -4px rgba(15, 23, 42, 0.08)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.03)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Background Large Step Number */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-10px',
                  fontSize: '110px',
                  fontWeight: 900,
                  color: '#f1f5f9',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  fontFamily: "'Plus Jakarta Sans', var(--font-sans)"
                }}>
                  {s.step}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Step Pill */}
                  <span style={{
                    display: 'inline-block',
                    background: s.bgAccent,
                    color: '#0f172a',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '6px 14px',
                    borderRadius: '99px',
                    marginBottom: '24px',
                    textTransform: 'uppercase'
                  }}>
                    Step {s.step}
                  </span>

                  {/* Icon Container */}
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: s.bgAccent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    {s.icon}
                  </div>

                  {/* Card Content */}
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
         4. FEATURES SECTION (#features)
      ───────────────────────────────────────────── */}
      <section id="features" style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb', display: 'block', marginBottom: '10px' }}>
              Built for Modern Governance
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '16px' }}>
              Everything You Need for Civic Impact
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7 }}>
              Designed with powerful tools to ensure transparency, accountability, and user delight across every neighborhood.
            </p>
          </div>

          {/* 6 Feature Grid Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                title: 'Precise GPS Reporting',
                desc: 'Mark exact municipal issue coordinates via an interactive pin placement on high-resolution maps.',
                icon: <MapPin size={22} style={{ color: '#2563eb' }} />
              },
              {
                title: 'Photo & Video Evidence',
                desc: 'Attach geotagged photo evidence with dynamic auto-compression for fast mobile upload.',
                icon: <Camera size={22} style={{ color: '#2563eb' }} />
              },
              {
                title: 'Real-Time Status Tracking',
                desc: 'Follow your report through assigned, in-progress, and resolved stages with instant notifications.',
                icon: <Activity size={22} style={{ color: '#2563eb' }} />
              },
              {
                title: 'Democratic Upvoting',
                desc: 'Upvote critical local issues to prioritize high-impact infrastructure fixes in your area.',
                icon: <ThumbsUp size={22} style={{ color: '#2563eb' }} />
              },
              {
                title: 'Resolution Analytics',
                desc: 'Municipal analytics dashboard displaying resolution speed metrics and regional heatmaps.',
                icon: <TrendingUp size={22} style={{ color: '#2563eb' }} />
              },
              {
                title: 'Citizen Rewards & Badges',
                desc: 'Earn digital certificates and plant local saplings for active contributions to city welfare.',
                icon: <TreePine size={22} style={{ color: '#2563eb' }} />
              }
            ].map((f, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#bfdbfe';
                  e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(37, 99, 235, 0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
         5. TRUST & TRANSPARENCY SECTION (#impact)
      ───────────────────────────────────────────── */}
      <section id="impact" style={{ padding: '96px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb', display: 'block', marginBottom: '10px' }}>
              Built on Integrity
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '16px' }}>
              Trust & Transparency First
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7 }}>
              CityZen bridges the gap between citizens and municipal authorities with encrypted data handling and open status verification.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              {
                title: 'Data Security & Privacy',
                desc: 'Your identity and report submission details are protected with encrypted transmission standards.',
                icon: <ShieldCheck size={28} style={{ color: '#2563eb' }} />
              },
              {
                title: 'Fast SLA Response',
                desc: 'Automated ticket routing targets issue review and field engineering dispatch within hours.',
                icon: <Clock size={28} style={{ color: '#2563eb' }} />
              },
              {
                title: 'Community Verification',
                desc: 'Resolutions require uploaded proof and citizen confirmation before tickets are archived.',
                icon: <CheckCircle2 size={28} style={{ color: '#2563eb' }} />
              }
            ].map((t, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                padding: '36px 28px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.02)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  {t.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.7 }}>
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
         6. FINAL CTA BANNER
      ───────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
        padding: '100px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-sans)",
            fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '20px',
            letterSpacing: '-0.03em',
            lineHeight: 1.15
          }}>
            Make your city better,<br />one report at a time.
          </h2>

          <p style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.85)', margin: '0 auto 36px', lineHeight: 1.7, maxWidth: '540px' }}>
            Join thousands of active citizens using CityZen to report potholes, water leaks, and street light outages.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {['Free for Citizens', 'Real-Time Tracking', 'GPS Geotagged', 'Tree Sapling Rewards'].map((tag, idx) => (
              <span key={idx} style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '99px',
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Check size={13} style={{ color: '#38bdf8' }} />
                {tag}
              </span>
            ))}
          </div>

          <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/register'} style={{ textDecoration: 'none' }}>
            <button style={{
              background: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 36px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 0, 0, 0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)'; }}>
              {isAuthenticated ? 'Go to Dashboard' : 'Report an Issue Now'}
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         7. FOOTER SECTION
      ───────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#090e17', color: 'rgba(255, 255, 255, 0.7)', padding: '64px 24px 36px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', marginBottom: '48px' }}>

            {/* Brand Col */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CityZenLogo size={32} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', var(--font-sans)", fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                  City<span style={{ color: '#38bdf8' }}>Zen</span>
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.7, maxWidth: '280px' }}>
                A transparent platform connecting citizens with municipal authorities for a cleaner, safer city.
              </p>
            </div>

            {/* Links Col 1: Platform */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                Platform
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['How It Works', 'Key Features', 'Resolution Tracking', 'Citizen Badges'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#how-it-works" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.18s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Col 2: Community */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                Community
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Report Potholes', 'Sanitation Tickets', 'Streetlight Repairs', 'Upvote Critical Issues'].map((item, idx) => (
                  <li key={idx}>
                    <Link to="/register" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.18s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Col 3: Legal & Support */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                Legal & Support
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Privacy Policy', 'Terms of Service', 'Security Overview', 'Municipal Support'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.18s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.45)', margin: 0 }}>
              © 2026 CityZen — Built with a commitment to better local governance.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>✨ Empowering Citizens</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}