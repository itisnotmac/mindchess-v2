import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SettingsProvider } from '@/lib/SettingsContext';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import PlayVsAI from '@/pages/PlayVsAI';
import Tactics from '@/pages/Tactics';
import Openings from '@/pages/Openings';
import EndgameLab from '@/pages/EndgameLab';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsAndConditions from '@/pages/TermsAndConditions';
import Settings from '@/pages/Settings';
import PlayConsoleRef from '@/pages/PlayConsoleRef';
import GameLibrary from '@/pages/GameLibrary';
import GameDetail from '@/pages/GameDetail';
import AnalyzeGame from '@/pages/AnalyzeGame';
import LearningPath from '@/pages/LearningPath';
import Upgrade from '@/pages/Upgrade';
import Welcome from '@/pages/Welcome';

// Shows a blank screen while Firebase resolves auth state (usually <1s)
function AppLoader() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Wraps all protected routes — redirects to /welcome if not signed in
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <AppLoader />;
  if (user === null) return <Navigate to="/welcome" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Welcome / onboarding — redirect to home if already signed in */}
      <Route
        path="/welcome"
        element={user && user !== undefined ? <Navigate to="/" replace /> : <Welcome />}
      />

      {/* All app routes require auth */}
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/play" element={<PlayVsAI />} />
        <Route path="/tactics" element={<Tactics />} />
        <Route path="/openings" element={<Openings />} />
        <Route path="/endgames" element={<EndgameLab />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/library" element={<GameLibrary />} />
        <Route path="/library/:id" element={<GameDetail />} />
        <Route path="/analyze" element={<AnalyzeGame />} />
        <Route path="/learn" element={<LearningPath />} />
        <Route path="/upgrade" element={<Upgrade />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
      {/* Dev-only reference page — not linked in any user-facing nav */}
      <Route path="/dev/play-console-ref" element={<PlayConsoleRef />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <SettingsProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AppRoutes />
            <Toaster />
          </Router>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App
