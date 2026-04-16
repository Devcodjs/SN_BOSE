import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const CitizenDashboard = lazy(() => import('./pages/citizen/CitizenDashboard'));
const CreateIssuePage = lazy(() => import('./pages/citizen/CreateIssuePage'));
const IssueDetailPage = lazy(() => import('./pages/citizen/IssueDetailPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loading />;
  if (!isAuthenticated) return <LandingPage />;
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full flex flex-col justify-start">
        <Suspense fallback={<Loading />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Citizen */}
              <Route element={<ProtectedRoute roles={['citizen']} />}>
                <Route path="/dashboard" element={<CitizenDashboard />} />
                <Route path="/issues/new" element={<CreateIssuePage />} />
              </Route>

              {/* Shared auth */}
              <Route element={<ProtectedRoute roles={['citizen', 'admin', 'municipality']} />}>
                <Route path="/issues/:id" element={<IssueDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}

