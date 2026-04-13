import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy-load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CitizenDashboard = lazy(() => import('./pages/CitizenDashboard'));
const CreateIssuePage = lazy(() => import('./pages/CreateIssuePage'));
const IssueDetailPage = lazy(() => import('./pages/IssueDetailPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

/**
 * Root redirect — sends authenticated users to the right dashboard
 */
const RootRedirect = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>
                {/* Root */}
                <Route path="/" element={<RootRedirect />} />

                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Citizen routes */}
                <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
                  <Route path="/dashboard" element={<CitizenDashboard />} />
                  <Route path="/issues/create" element={<CreateIssuePage />} />
                </Route>

                {/* Issue detail — any authenticated user */}
                <Route element={<ProtectedRoute allowedRoles={['citizen', 'admin']} />}>
                  <Route path="/issues/:id" element={<IssueDetailPage />} />
                </Route>

                {/* Admin routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
