import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Portfolio from "@/pages/Portfolio";
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProjects from "@/pages/admin/Projects";
import AdminSkills from "@/pages/admin/Skills";
import AdminExperience from "@/pages/admin/Experience";
import AdminCertifications from "@/pages/admin/Certifications";
import AdminSettings from "@/pages/admin/Settings";
import AdminLayout from "@/components/admin/AdminLayout";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Redirect to="/admin" />;
  return <AdminLayout>{children}</AdminLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/admin/projects">
        <ProtectedRoute><AdminProjects /></ProtectedRoute>
      </Route>
      <Route path="/admin/skills">
        <ProtectedRoute><AdminSkills /></ProtectedRoute>
      </Route>
      <Route path="/admin/experience">
        <ProtectedRoute><AdminExperience /></ProtectedRoute>
      </Route>
      <Route path="/admin/certifications">
        <ProtectedRoute><AdminCertifications /></ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute><AdminSettings /></ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1E293B",
                border: "1px solid rgba(71, 85, 105, 0.5)",
                color: "#F8FAFC",
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
