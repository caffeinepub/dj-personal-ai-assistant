import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { Toaster } from "@/components/ui/sonner";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ChatPage } from "./pages/ChatPage";
import { ExcelPage } from "./pages/ExcelPage";
import { CodingPage } from "./pages/CodingPage";
import { WebsitePage } from "./pages/WebsitePage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { TeachDJPage } from "./pages/TeachDJPage";
import { SetupWizardPage } from "./pages/SetupWizardPage";
import { useUserProfile } from "./hooks/useQueries";

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
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
