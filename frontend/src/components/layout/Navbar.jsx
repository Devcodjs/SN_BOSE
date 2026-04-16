import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Plus, LogOut, LayoutDashboard,
  BarChart2, User, FileText, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

/* ─────────────────────────────────────────────
   INLINE STYLES — no external CSS file needed
───────────────────────────────────────────── */
const styles = {
  /* NAV SHELL */
  nav: (scrolled) => ({
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    transition: 'all 0.3s ease',
    backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
    borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid transparent',
    boxShadow: scrolled ? '0 1px 12px rgba(15,23,42,0.07)' : 'none',
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
    height: '68px',
    gap: '16px',
  },

  /* LOGO */
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    lineHeight: 1,
  },
  logoAccent: {
    color: '#2563eb',
  },

  /* DESKTOP NAV ITEMS */
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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

  /* DIVIDER */
  divider: {
    width: '1px',
    height: '28px',
    backgroundColor: '#e2e8f0',
    margin: '0 8px',
    flexShrink: 0,
  },

  /* REPORT ISSUE BUTTON */
  reportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '14px',
    fontWeight: '700',
    padding: '9px 18px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    boxShadow: '0 2px 10px rgba(37,99,235,0.30)',
    letterSpacing: '0.1px',
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
  profileTextWrap: {
    lineHeight: 1.2,
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
    letterSpacing: '0.7px',
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

  /* AUTH SECTION (unauthenticated) */
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  signInLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid transparent',
    transition: 'all 0.18s ease',
  },

  getStartedBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '700',
    padding: '9px 18px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    boxShadow: '0 2px 10px rgba(37,99,235,0.30)',
    textDecoration: 'none',
  },

  /* PROFILE+LOGOUT group (right side) */
  profileGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: '14px',
    paddingLeft: '14px',
    borderLeft: '1px solid #e2e8f0',
  },

  /* MOBILE TOGGLE */
  mobileToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },

  /* MOBILE MENU */
  mobileMenu: {
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    boxShadow: '0 16px 32px rgba(15,23,42,0.1)',
  },

  mobileMenuInner: {
    padding: '20px 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  /* MOBILE PROFILE HEADER */
  mobileProfileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: '#f0f7ff',
    borderRadius: '14px',
    border: '1px solid #bfdbfe',
  },
  mobileProfileName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px',
    display: 'block',
  },
  mobileProfileRole: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    display: 'block',
  },

  /* MOBILE LINK */
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

  mobileLinkIcon: (active) => ({
    color: active ? '#2563eb' : '#94a3b8',
    flexShrink: 0,
  }),

  /* MOBILE REPORT BUTTON */
  mobileReportBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 16px',
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: '700',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#ffffff',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(37,99,235,0.30)',
  },

  /* MOBILE DIVIDER */
  mobileDivider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '8px 0',
  },

  /* MOBILE LOGOUT */
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    textAlign: 'left',
    padding: '13px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#dc2626',
    borderRadius: '12px',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },

  /* MOBILE AUTH BUTTONS */
  mobileAuthGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '8px 0',
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
    display: 'block',
    padding: '14px 16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  /* ── Desktop NavLink ── */
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

          {/* ── LOGO ── */}
          <Link to="/" style={styles.logoWrap}>
            <div style={styles.logoIcon}>🏛️</div>
            <span style={styles.logoText}>
              Civic<span style={styles.logoAccent}>Pulse</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex" style={styles.desktopNav}>
            {isAuthenticated ? (
              <>
                {/* User Links */}
                {!isAdmin ? (
                  <>
                    <NavLink to="/dashboard" icon={FileText}>My Issues</NavLink>
                    <div style={styles.divider} />
                    <button
                      onClick={() => navigate('/issues/new')}
                      style={styles.reportBtn}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.40)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(37,99,235,0.30)';
                      }}
                    >
                      <Plus size={16} strokeWidth={3} />
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
                    <div style={styles.profileTextWrap} className="hidden lg:block">
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
                <Link
                  to="/login"
                  style={styles.signInLink}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#1d4ed8';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#475569';
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
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.40)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(37,99,235,0.30)';
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
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.borderColor = '#bfdbfe';
              e.currentTarget.style.color = '#1d4ed8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
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
              {isAuthenticated ? (
                <>
                  {/* Mobile Profile Header */}
                  <div style={styles.mobileProfileHeader}>
                    <Avatar name={user?.name || 'User'} size="md" />
                    <div>
                      <span style={styles.mobileProfileName}>{user?.name}</span>
                      <span style={styles.mobileProfileRole}>{user?.role || 'Citizen'}</span>
                    </div>
                  </div>

                  {/* Mobile Nav Links */}
                  {!isAdmin ? (
                    <>
                      <Link
                        to="/dashboard"
                        style={styles.mobileLink(isActive('/dashboard'))}
                      >
                        <FileText size={18} style={styles.mobileLinkIcon(isActive('/dashboard'))} />
                        My Issues
                      </Link>
                      <Link to="/issues/new" style={styles.mobileReportBtn}>
                        <Plus size={18} strokeWidth={3} />
                        Report New Issue
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/admin"
                        style={styles.mobileLink(isActive('/admin'))}
                      >
                        <LayoutDashboard size={18} style={styles.mobileLinkIcon(isActive('/admin'))} />
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/analytics"
                        style={styles.mobileLink(isActive('/admin/analytics'))}
                      >
                        <BarChart2 size={18} style={styles.mobileLinkIcon(isActive('/admin/analytics'))} />
                        Analytics
                      </Link>
                    </>
                  )}

                  <div style={styles.mobileDivider} />

                  <Link
                    to="/profile"
                    style={styles.mobileLink(isActive('/profile'))}
                  >
                    <User size={18} style={styles.mobileLinkIcon(isActive('/profile'))} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={styles.mobileLogoutBtn}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <div style={styles.mobileAuthGrid}>
                  <Link to="/login" style={styles.mobileSignInBtn}>Sign In</Link>
                  <Link to="/register" style={styles.mobileGetStartedBtn}>
                    Create Free Account
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