import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WellnessProvider } from './context/WellnessContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { HowItWorks } from './pages/public/HowItWorks';
import { Intelligence } from './pages/public/Intelligence';
import { WellnessStudio } from './pages/public/WellnessStudio';
import { RecoveryPlanner } from './pages/public/RecoveryPlanner';
import { Travel } from './pages/public/Travel';
import { About } from './pages/public/About';
import { Privacy } from './pages/public/Privacy';
import { Contact } from './pages/public/Contact';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { Onboarding } from './pages/auth/Onboarding';

// Authenticated Pages
import { Dashboard } from './pages/app/Dashboard';
import { CheckInPage } from './pages/app/CheckInPage';
import { StressMonitor } from './pages/app/StressMonitor';
import { InsightsPage } from './pages/app/InsightsPage';
import { WellnessPage } from './pages/app/WellnessPage';
import { PlannerPage } from './pages/app/PlannerPage';
import { TravelPage } from './pages/app/TravelPage';
import { ProgressPage } from './pages/app/ProgressPage';
import { ReportsPage } from './pages/app/ReportsPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { SettingsPage } from './pages/app/SettingsPage';
import { HealthMeasurementsPage } from './pages/app/HealthMeasurementsPage';

// Route Guard for authenticated app
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F0E8] flex flex-col items-center justify-center text-[#292B26]">
        <div className="w-12 h-12 rounded-full bg-[#34483A] text-[#FBF9F4] flex items-center justify-center font-serif text-2xl font-bold animate-pulse mb-4 shadow-md">
          Ψ
        </div>
        <div className="font-serif text-lg tracking-[0.2em] font-semibold text-[#292B26]">PSYGMA</div>
        <p className="text-xs text-[#77766D] mt-1 font-medium">Validating secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <WellnessProvider>
        <Router>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route path="/wellness" element={<WellnessStudio />} />
              <Route path="/recovery-planner" element={<RecoveryPlanner />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Authenticated App Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="check-in" element={<CheckInPage />} />
              <Route path="stress-monitor" element={<StressMonitor />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="wellness" element={<WellnessPage />} />
              <Route path="recovery-planner" element={<PlannerPage />} />
              <Route path="travel" element={<TravelPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="health" element={<HealthMeasurementsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Legacy & Shortcut Redirects */}
            <Route path="/sign-in" element={<Navigate to="/login" replace />} />
            <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="/check-in" element={<Navigate to="/app/check-in" replace />} />
            <Route path="/explore" element={<Navigate to="/travel" replace />} />
            <Route path="/coach" element={<Navigate to="/app/insights" replace />} />
            <Route path="/profile" element={<Navigate to="/app/profile" replace />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </WellnessProvider>
    </AuthProvider>
  );
}

export default App;
