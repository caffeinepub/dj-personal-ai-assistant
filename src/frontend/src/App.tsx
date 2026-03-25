import { Toaster } from "@/components/ui/sonner";
import React, { Suspense } from "react";
import { AutonomyEngine } from "./components/AutonomyEngine";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProactiveEngine } from "./components/ProactiveEngine";
import { ContextEngineProvider } from "./context/ContextEngineContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import { BrowserRouter, Navigate, Route, Routes } from "./lib/router-shim";

// ── Lazy-loaded pages (code splitting) ────────────────────────────────────────────
const DashboardPage = React.lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ChatPage = React.lazy(() =>
  import("./pages/ChatPage").then((m) => ({ default: m.ChatPage })),
);
const ExcelPage = React.lazy(() =>
  import("./pages/ExcelPage").then((m) => ({ default: m.ExcelPage })),
);
const CodingPage = React.lazy(() =>
  import("./pages/CodingPage").then((m) => ({ default: m.CodingPage })),
);
const WebsitePage = React.lazy(() =>
  import("./pages/WebsitePage").then((m) => ({ default: m.WebsitePage })),
);
const KnowledgePage = React.lazy(() =>
  import("./pages/KnowledgePage").then((m) => ({ default: m.KnowledgePage })),
);
const TasksPage = React.lazy(() =>
  import("./pages/TasksPage").then((m) => ({ default: m.TasksPage })),
);
const NotesPage = React.lazy(() =>
  import("./pages/NotesPage").then((m) => ({ default: m.NotesPage })),
);
const FinancePage = React.lazy(() =>
  import("./pages/FinancePage").then((m) => ({ default: m.FinancePage })),
);
const ProfilePage = React.lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const SettingsPage = React.lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const TeachDJPage = React.lazy(() =>
  import("./pages/TeachDJPage").then((m) => ({ default: m.TeachDJPage })),
);
const SystemStatusPage = React.lazy(() =>
  import("./pages/SystemStatusPage").then((m) => ({
    default: m.SystemStatusPage,
  })),
);
const MemoryPage = React.lazy(() =>
  import("./pages/MemoryPage").then((m) => ({ default: m.MemoryPage })),
);
const PlansPage = React.lazy(() =>
  import("./pages/PlansPage").then((m) => ({ default: m.PlansPage })),
);
const LoginPage = React.lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const SetupWizardPage = React.lazy(() =>
  import("./pages/SetupWizardPage").then((m) => ({
    default: m.SetupWizardPage,
  })),
);

// ── HUD-styled page loading spinner ───────────────────────────────────────────────
function PageLoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#060b14]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-500/80" />
          <div
            className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-cyan-400/60"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-cyan-400">
              DJ
            </span>
          </div>
        </div>
        <p className="animate-pulse font-mono text-xs tracking-widest text-cyan-400/60">
          LOADING...
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loginStatus, isInitializing, identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Only block on isInitializing — the brief moment AuthClient is being
  // created on mount. Once auth is initialized, immediately check auth state.
  // Individual pages handle their own data-loading states.
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="glow-border rounded-lg p-8">
          <p className="glow-text font-display text-xl">Initializing DJ...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated =
    loginStatus === "success" ||
    (loginStatus === "idle" &&
      identity !== undefined &&
      !identity.getPrincipal().isAnonymous());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    profile != null &&
    !profileLoading &&
    profile.onboardingComplete === false
  ) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ContextEngineProvider>
          <ProactiveEngine />
          <AutonomyEngine />
          <Suspense fallback={<PageLoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/setup" element={<SetupWizardPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/excel"
                element={
                  <ProtectedRoute>
                    <ExcelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding"
                element={
                  <ProtectedRoute>
                    <CodingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/website"
                element={
                  <ProtectedRoute>
                    <WebsitePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge"
                element={
                  <ProtectedRoute>
                    <KnowledgePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance"
                element={
                  <ProtectedRoute>
                    <FinancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teach-dj"
                element={
                  <ProtectedRoute>
                    <TeachDJPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/system-status"
                element={
                  <ProtectedRoute>
                    <SystemStatusPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/memory"
                element={
                  <ProtectedRoute>
                    <MemoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plans"
                element={
                  <ProtectedRoute>
                    <PlansPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </ContextEngineProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
