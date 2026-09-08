import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Plus, LogOut, LayoutDashboard,
  BarChart2, User, FileText, ChevronRight, Sparkles, Layers, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

/* ── CityZen Logo Mark ── */
export function CityZenLogo({ size = 36 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #06b6d4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.30)',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Light sheen overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)' }} />
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.5L3.5 7.5V19.5C3.5 20.0523 3.94772 20.5 4.5 20.5H19.5C20.0523 20.5 20.5 20.0523 20.5 19.5V7.5L12 2.5Z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.75" strokeLinejoin="round"/>
        <path d="M9 20.5V13H15V20.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="8" r="2.2" fill="#38bdf8" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR STYLES
───────────────────────────────────────────── */
const styles = {
  nav: (scrolled) => ({
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(226, 232, 240, 0.5)',
    boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.06)' : 'none',
  }),

  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
  },

  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
    gap: '24px',
  },

  /* LOGO & WORDMARK */
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    flexShrink: 0,
    cursor: 'pointer',
  },
  logoText: {
    fontFamily: "'Plus Jakarta Sans', var(--font-sans)",
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  /* DESKTOP NAV ITEMS */
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  anchorLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '10px',
    transition: 'all 0.18s ease',
    cursor: 'pointer',
  },

  /* NAV LINK */
  navLink: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: '10px',
    textDecoration: 'none',
    transition: 'all 0.18s ease',
    color: active ? '#1d4ed8' : '#475569',
    backgroundColor: active ? '#eff6ff' : 'transparent',
    border: active ? '1px solid #bfdbfe' : '1px solid transparent',
  }),

  navLinkIcon: (active) => ({
    color: active ? '#2563eb' : '#94a3b8',
    flexShrink: 0,
  }),

  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#e2e8f0',
    margin: '0 4px',
    flexShrink: 0,
  },

  /* REPORT ISSUE BUTTON */
  reportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 4px 14px rgba(37,99,235,0.28)',
    letterSpacing: '-0.01em',
  },

  /* PROFILE CHIP */
  profileChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 12px 6px 6px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  profileName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
    display: 'block',
  },
  profileRole: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    display: 'block',
  },

  /* LOGOUT BUTTON */
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    flexShrink: 0,
  },

  /* AUTH SECTION */
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  signInLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    textDecoration: 'none',
    padding: '9px 16px',
    borderRadius: '10px',
    border: '1px solid transparent',
    transition: 'all 0.18s ease',
  },

  getStartedBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '14px',
    fontWeight: '700',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 4px 14px rgba(37,99,235,0.28)',
    textDecoration: 'none',
  },

  /* PROFILE GROUP */
  profileGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: '12px',
    paddingLeft: '12px',
    borderLeft: '1px solid #e2e8f0',
  },

  /* MOBILE TOGGLE */
  mobileToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },

  /* MOBILE MENU */
  mobileMenu: {
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    boxShadow: '0 16px 32px rgba(15,23,42,0.08)',
  },

  mobileMenuInner: {
    padding: '20px 20px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  mobileLink: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '13px 16px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.18s ease',
    color: active ? '#1d4ed8' : '#334155',
    backgroundColor: active ? '#eff6ff' : 'transparent',
    border: active ? '1px solid #bfdbfe' : '1px solid transparent',
  }),

  mobileAuthGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingTop: '8px',
  },
  mobileSignInBtn: {
    display: 'block',
    padding: '14px 16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
  },
  mobileGetStartedBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    borderRadius: '12px',
    border: 'none',
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(37,99,235,0.30)',
  },
};

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setOpen(false);
    if (!isHome) {
      navigate('/', { replace: false });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* ── Desktop NavLink Component ── */
  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      style={styles.navLink(isActive(to))}
      onMouseEnter={e => {
        if (!isActive(to)) {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.color = '#1d4ed8';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }
      }}
      onMouseLeave={e => {
        if (!isActive(to)) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#475569';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      {Icon && <Icon size={16} style={styles.navLinkIcon(isActive(to))} />}
      {children}
    </Link>
  );

  return (
    <nav style={styles.nav(scrolled)}>
      <div style={styles.inner}>
        <div style={styles.row}>

          {/* ── BRAND LOGO & WORDMARK ── */}
          <Link to="/" style={styles.logoWrap}>
            <CityZenLogo size={38} />
            <span style={styles.logoText}>
              City<span style={styles.logoAccent}>Zen</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex" style={styles.desktopNav}>
            {/* Landing Navigation Links when on home or unauthenticated */}
            {(!isAuthenticated || isHome) && (
              <>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  style={styles.anchorLink}
                  onMouseEnter={e => { e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  style={styles.anchorLink}
                  onMouseEnter={e => { e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('impact')}
                  style={styles.anchorLink}
                  onMouseEnter={e => { e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Impact
                </button>
              </>
            )}

            {isAuthenticated ? (
              <>
                <div style={styles.divider} />
                {!isAdmin ? (
                  <>
                    <NavLink to="/dashboard" icon={FileText}>My Issues</NavLink>
                    <button
                      onClick={() => navigate('/issues/new')}
                      style={styles.reportBtn}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.38)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.28)';
                      }}
                    >
                      <Plus size={16} strokeWidth={2.5} />
                      Report Issue
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/admin/analytics" icon={BarChart2}>Analytics</NavLink>
                  </>
                )}

                {/* Profile + Logout */}
                <div style={styles.profileGroup}>
                  <Link
                    to="/profile"
                    style={styles.profileChip}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                      e.currentTarget.style.borderColor = '#bfdbfe';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <Avatar name={user?.name || 'User'} size="sm" />
                    <div className="hidden lg:block">
                      <span style={styles.profileName}>{user?.name}</span>
                      <span style={styles.profileRole}>{user?.role || 'Citizen'}</span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    style={styles.logoutBtn}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#dc2626';
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.authSection}>
                <div style={styles.divider} />
                <Link
                  to="/login"
                  style={styles.signInLink}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#1d4ed8';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#334155';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  style={styles.getStartedBtn}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.38)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.28)';
                  }}
                >
                  Get Started <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </div>

          {/* ── MOBILE TOGGLE ── */}
          <button
            className="md:hidden"
            style={styles.mobileToggle}
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.borderColor = '#bfdbfe';
              e.currentTarget.style.color = '#1d4ed8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#334155';
            }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={styles.mobileMenu}
            className="md:hidden"
          >
            <div style={styles.mobileMenuInner}>
              {/* Landing Links on Mobile */}
              {(!isAuthenticated || isHome) && (
                <>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    style={{ ...styles.mobileLink(false), width: '100%', textAlign: 'left' }}
                  >
                    <Layers size={18} style={{ color: '#94a3b8' }} />
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection('features')}
                    style={{ ...styles.mobileLink(false), width: '100%', textAlign: 'left' }}
                  >
                    <Sparkles size={18} style={{ color: '#94a3b8' }} />
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('impact')}
                    style={{ ...styles.mobileLink(false), width: '100%', textAlign: 'left' }}
                  >
                    <ShieldCheck size={18} style={{ color: '#94a3b8' }} />
                    Impact
                  </button>
                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />
                </>
              )}

              {isAuthenticated ? (
                <>
                  {!isAdmin ? (
                    <>
                      <Link to="/dashboard" style={styles.mobileLink(isActive('/dashboard'))}>
                        <FileText size={18} />
                        My Issues
                      </Link>
                      <Link to="/issues/new" style={styles.mobileGetStartedBtn}>
                        <Plus size={18} strokeWidth={2.5} />
                        Report New Issue
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/admin" style={styles.mobileLink(isActive('/admin'))}>
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                      <Link to="/admin/analytics" style={styles.mobileLink(isActive('/admin/analytics'))}>
                        <BarChart2 size={18} />
                        Analytics
                      </Link>
                    </>
                  )}
                  <Link to="/profile" style={styles.mobileLink(isActive('/profile'))}>
                    <User size={18} />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ ...styles.mobileLink(false), color: '#dc2626', width: '100%', textAlign: 'left' }}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <div style={styles.mobileAuthGrid}>
                  <Link to="/login" style={styles.mobileSignInBtn}>Sign In</Link>
                  <Link to="/register" style={styles.mobileGetStartedBtn}>
                    Get Started <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}