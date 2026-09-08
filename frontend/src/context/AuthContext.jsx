import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API, { setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      // Try to refresh the token using httpOnly cookie
      const { data: refresh } = await API.post('/auth/refresh');
      setAccessToken(refresh.data.accessToken);
      const { data: me } = await API.get('/auth/me');
      setUser(me.data);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    const token = data.data.token || data.data.accessToken;
    setAccessToken(token);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await API.post('/auth/register', { name, email, password, phone });
    const token = data.data.token || data.data.accessToken;
    setAccessToken(token);
    setUser(data.data.user);
    return data.data.user;
  };

  const requestAadhaarOtp = async (aadhaarNumber) => {
    const { data } = await API.post('/auth/aadhaar/request-otp', { aadhaarNumber });
    return data.data; // { transactionId, expiresAt }
  };

  const verifyAadhaarOtp = async (transactionId, otp) => {
    const { data } = await API.post('/auth/aadhaar/verify-otp', { transactionId, otp });
    if (data.data.requiresOnboarding) {
      return data.data; // { requiresOnboarding: true, onboardingToken, maskedAadhaar }
    }
    const token = data.data.token || data.data.accessToken;
    setAccessToken(token);
    setUser(data.data.user);
    return { user: data.data.user };
  };

  const completeAadhaarOnboarding = async (onboardingData) => {
    const { data } = await API.post('/auth/aadhaar/complete-onboarding', onboardingData);
    const token = data.data.token || data.data.accessToken;
    setAccessToken(token);
    setUser(data.data.user);
    return data.data.user;
  };

  const linkAadhaarAccount = async (linkData) => {
    const { data } = await API.post('/auth/aadhaar/link-account', linkData);
    const token = data.data.token || data.data.accessToken;
    setAccessToken(token);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try { await API.post('/auth/logout'); } catch {}
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      requestAadhaarOtp, verifyAadhaarOtp, completeAadhaarOnboarding, linkAadhaarAccount,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isMunicipality: user?.role === 'municipality',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
