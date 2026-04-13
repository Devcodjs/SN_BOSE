import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './pages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-container animate-fade-in">
        {/* Left — Branding */}
        <div className="auth-branding">
          <div className="auth-brand-content">
            <span className="auth-brand-icon">🏛️</span>
            <h1>Join CivicPulse</h1>
            <p>
              Create your account and start making a difference in your community.
              Report issues, track progress, and help improve civic infrastructure.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <span>🆓</span> Free for all citizens
              </div>
              <div className="auth-feature">
                <span>🔒</span> Secure & private
              </div>
              <div className="auth-feature">
                <span>🌍</span> GPS-powered reporting
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="auth-form-panel">
          <div className="auth-form-content">
            <h2>Create Account</h2>
            <p className="auth-form-subtitle">
              Fill in your details to get started
            </p>

            {error && (
              <div className="alert-custom alert-error">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} id="register-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control-custom"
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  className="form-control-custom"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control-custom"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    className="form-control-custom"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control-custom"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                id="register-submit"
                disabled={loading}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
