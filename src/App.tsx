import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar, Footer } from "./components/Layout";
import Landing from "./pages/Landing";
import Planner from "./pages/Planner";
import Marketplace from "./pages/Marketplace";
import VendorDetail from "./pages/VendorDetail";
import Packages from "./pages/Packages";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { LoginPage, SignupPage, ForgotPasswordPage } from "./pages/Auth";
import CreateEvent from "./pages/CreateEvent";
import VendorDashboard from "./pages/VendorDashboard";
import Notifications from "./pages/Notifications";
import Disputes from "./pages/Disputes";
import Guests from "./pages/Guests";
import Messages from "./pages/Messages";
import Assistant from "./pages/Assistant";
import Reviews from "./pages/Reviews";
import VendorMatching from "./pages/VendorMatching";
import Copilot from "./pages/Copilot";
import BudgetOptimizer from "./pages/BudgetOptimizer";
import EscrowPage from "./pages/Escrow";
import InstallmentsPage from "./pages/Installments";
import VendorCRM from "./pages/VendorCRM";
import SubscriptionsPage from "./pages/Subscriptions";
import AnalyticsPage from "./pages/Analytics";
import { BottomNav } from "./components/BottomNav";

function Shell() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<VendorDetail />} />
          <Route path="/packages" element={<Packages />} />

          {/* Protected-ish routes: redirect to login if not signed in, except for public browsing */}
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard /> : <Dashboard />
            }
          />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/disputes" element={<Disputes />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/matching" element={<VendorMatching />} />
          <Route path="/budget-optimizer" element={<BudgetOptimizer />} />
          <Route path="/escrow" element={<EscrowPage />} />
          <Route path="/installments" element={<InstallmentsPage />} />
          <Route path="/vendor-crm" element={<VendorCRM />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Role-specific routes */}
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:tab" element={<Admin />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <HashRouter>
            <Shell />
          </HashRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
