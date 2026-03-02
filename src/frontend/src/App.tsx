import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import { BrowserRouter, Navigate, Route, Routes } from "./lib/router-shim";
import { ChatPage } from "./pages/ChatPage";
import { CodingPage } from "./pages/CodingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExcelPage } from "./pages/ExcelPage";
import { KnowledgePage } from "./pages/KnowledgePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { SetupWizardPage } from "./pages/SetupWizardPage";
import { TeachDJPage } from "./pages/TeachDJPage";
import { WebsitePage } from "./pages/WebsitePage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loginStatus, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (isInitializing || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="glow-border rounded-lg p-8">
          <p className="glow-text font-display text-xl">Initializing DJ...</p>
        </div>
      </div>
    );
  }

  if (loginStatus !== "success") {
    return <Navigate to="/login" replace />;
  }

  // Redirect to setup if onboarding is not complete
  if (profile && !profile.onboardingComplete) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <>
      <BrowserRouter>
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
            path="/teach"
            element={
              <ProtectedRoute>
                <TeachDJPage />
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
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
