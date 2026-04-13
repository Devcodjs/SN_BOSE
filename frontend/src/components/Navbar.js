import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container container-custom">
        {/* Logo */}
        <Link to="/" className="navbar-brand" id="navbar-logo">
          <span className="brand-icon">🏛️</span>
          <span className="brand-text">CivicPulse</span>
        </Link>

        {/* Hamburger */}
        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          id="navbar-toggle"
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Links */}
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    className="nav-link"
                    id="nav-dashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    📋 My Issues
                  </Link>
                  <Link
                    to="/issues/create"
                    className="nav-link nav-link-cta"
                    id="nav-create-issue"
                    onClick={() => setMenuOpen(false)}
                  >
                    ➕ Report Issue
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="nav-link"
                    id="nav-admin"
                    onClick={() => setMenuOpen(false)}
                  >
                    ⚙️ Admin Panel
                  </Link>
                  <Link
                    to="/admin/analytics"
                    className="nav-link"
                    id="nav-analytics"
                    onClick={() => setMenuOpen(false)}
                  >
                    📊 Analytics
                  </Link>
                </>
              )}

              {/* User menu */}
              <div className="nav-user">
                <div className="nav-user-info">
                  <span className="nav-user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="nav-user-name">{user?.name}</span>
                  <span className="nav-user-role">{user?.role}</span>
                </div>
                <button
                  className="nav-logout-btn"
                  onClick={handleLogout}
                  id="nav-logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                id="nav-login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link nav-link-cta"
                id="nav-register"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
