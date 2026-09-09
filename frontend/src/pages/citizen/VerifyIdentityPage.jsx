import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

/* Inline Icons */
const IconShieldCheck = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const IconFingerprint = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/>
    <path d="M5 19.5A9 9 0 0 1 12 5c3 0 5.5 1.5 7 3.5"/>
    <path d="M12 8a6 6 0 0 0-6 6c0 1 .2 2 .5 3"/>
    <path d="M12 11a3 3 0 0 0-3 3c0 2 1.5 3.5 3 5"/>
    <path d="M12 17a1 1 0 0 0-1 1v1"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const s = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: '#ffffff',
    borderRadius: 24,
    border: '1px solid #bae6fd',
    padding: '2.5rem',
    boxShadow: '0 12px 32px rgba(14, 165, 233, 0.12)',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: '#e0f2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
    textAlign: 'center',
    margin: '0 0 0.5rem',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 1.5,
    margin: '0 0 1.75rem',
  },
  privacyBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 13,
    color: '#334155',
    lineHeight: 1.5,
    marginBottom: '1.5rem',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  demoBox: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 13,
    color: '#166534',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  demoOtpCode: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#15803d',
    background: '#dcfce7',
    padding: '2px 8px',
    borderRadius: 6,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1.5px solid #cbd5e1',
    background: '#f8fafc',
    fontSize: 16,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: '#0ea5e9',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: '1.25rem',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 13,
    color: '#991b1b',
    marginBottom: '1.25rem',
  },
  maskedBox: {
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: 12,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  resendRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem',
    fontSize: 13,
    color: '#64748b',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    color: '#0ea5e9',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    fontSize: 13,
  },
};

export default function VerifyIdentityPage() {
  const { user, requestAadhaarOtp, verifyAadhaarOtp, loadUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/issues/new';

  const isAlreadyVerified = user?.identityVerified || ['demo_verified', 'verified'].includes(user?.verificationStatus);

  const [step, setStep] = useState(1);
  const [rawAadhaar, setRawAadhaar] = useState('');
  const [displayAadhaar, setDisplayAadhaar] = useState('');
  const [maskedAadhaar, setMaskedAadhaar] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleAadhaarChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 12);
    setRawAadhaar(rawVal);
    const formatted = rawVal.replace(/(\d{4})(?=\d)/g, '$1 ');
    setDisplayAadhaar(formatted);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (rawAadhaar.length !== 12) {
      return setError('Aadhaar number must consist of 12 valid digits');
    }

    setLoading(true);
    try {
      const res = await requestAadhaarOtp(rawAadhaar);
      setTransactionId(res.transactionId);
      if (res.demoOtp) {
        setDemoOtp(res.demoOtp);
        toast.success(`OTP Generated! Demo OTP: ${res.demoOtp}`, { duration: 10000 });
      } else {
        toast.success('OTP sent to registered mobile number');
      }
      const last4 = rawAadhaar.slice(-4);
      setMaskedAadhaar(`XXXX XXXX ${last4}`);
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate OTP request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.trim().length !== 6) {
      return setError('Please enter valid 6-digit OTP');
    }

    setLoading(true);
    try {
      await verifyAadhaarOtp(transactionId, otp);
      await loadUser();
      setSuccessMsg('Aadhaar Identity Verified Successfully!');
      setTimeout(() => {
        navigate(redirectTarget);
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Aadhaar OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await requestAadhaarOtp(rawAadhaar);
      setTransactionId(res.transactionId);
      if (res.demoOtp) {
        setDemoOtp(res.demoOtp);
        toast.success(`New OTP Generated! Demo OTP: ${res.demoOtp}`, { duration: 10000 });
      }
      setResendTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={s.card}
      >
        {isAlreadyVerified ? (
          /* State: Already Verified */
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...s.headerIcon, background: '#dcfce7' }}>
              <IconShieldCheck />
            </div>
            <h2 style={s.title}>Identity Verified</h2>
            <p style={s.subtitle}>
              Your account has been verified via Development Mock Aadhaar Provider (Demo Verified).
              You can now submit civic issue reports.
            </p>
            <button
              onClick={() => navigate(redirectTarget)}
              style={s.button}
            >
              Continue to Issue Reporting
            </button>
          </div>
        ) : (
          /* State: Identity Verification Flow */
          <div>
            <div style={s.headerIcon}>
              <IconFingerprint />
            </div>

            <h2 style={s.title}>Verify Your Identity</h2>
            <p style={s.subtitle}>
              Aadhaar identity verification is required before reporting civic issues to ensure accountability and high report quality.
            </p>

            {error && (
              <div style={s.errorBox}>
                <IconAlert />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ ...s.demoBox, background: '#dcfce7', color: '#15803d' }}>
                <span>✓ {successMsg}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <div style={s.privacyBox}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}><IconLock /></div>
                  <div>
                    <strong>Privacy & Security Guaranteed:</strong>
                    <div style={{ marginTop: 2, color: '#64748b', fontSize: 12 }}>
                      Your raw Aadhaar number is processed in-memory and never saved to the database. Verification uses cryptographic HMAC-SHA256 hashing.
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={s.label} htmlFor="aadhaarInput">Aadhaar Number (12 digits)</label>
                  <input
                    id="aadhaarInput"
                    type="text"
                    required
                    value={displayAadhaar}
                    onChange={handleAadhaarChange}
                    placeholder="1234 5678 9012"
                    style={{ ...s.input, letterSpacing: '0.12em', fontSize: 18, fontWeight: 600 }}
                    maxLength={14}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || rawAadhaar.length !== 12}
                  style={{ ...s.button, opacity: (loading || rawAadhaar.length !== 12) ? 0.65 : 1 }}
                >
                  {loading ? 'Initiating OTP…' : 'Send Aadhaar OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={s.maskedBox}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Aadhaar Target</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#0369a1' }}>{maskedAadhaar}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(''); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#0ea5e9', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <IconArrowLeft /> Change Number
                  </button>
                </div>

                {demoOtp && (
                  <div style={s.demoBox}>
                    <span>💡 Development Demo OTP:</span>
                    <span style={s.demoOtpCode}>{demoOtp}</span>
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={s.label} htmlFor="otpInput">Enter 6-digit OTP</label>
                  <input
                    id="otpInput"
                    type="text"
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="• • • • • •"
                    style={{ ...s.input, letterSpacing: '0.4em', fontSize: 22, textAlign: 'center', fontWeight: 700 }}
                    maxLength={6}
                  />
                  <div style={s.resendRow}>
                    <span>Didn't get the code?</span>
                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={handleResendOtp}
                      style={{ ...s.resendBtn, opacity: resendTimer > 0 ? 0.5 : 1 }}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  style={{ ...s.button, opacity: (loading || otp.length !== 6) ? 0.65 : 1 }}
                >
                  {loading ? 'Verifying OTP…' : 'Verify & Continue'}
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
