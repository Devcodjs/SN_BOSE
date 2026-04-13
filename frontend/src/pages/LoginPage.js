import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './pages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-container animate-fade-in">
        {/* Left — Branding */}
        <div className="auth-branding">
          <div className="auth-brand-content">
            <span className="auth-brand-icon">🏛️</span>
            <h1>CivicPulse</h1>
            <p>
              Your voice matters. Report civic issues, track resolutions,
              and build a better community together.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <span>📸</span> Report issues with photos & GPS
              </div>
              <div className="auth-feature">
                <span>📊</span> Real-time tracking & analytics
              </div>
              <div className="auth-feature">
                <span>👍</span> Upvote to prioritize issues
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="auth-form-panel">
          <div className="auth-form-content">
            <h2>Welcome back</h2>
            <p className="auth-form-subtitle">
              Sign in to your account to continue
            </p>

            {error && (
              <div className="alert-custom alert-error">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} id="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control-custom"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control-custom"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                id="login-submit"
                disabled={loading}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
