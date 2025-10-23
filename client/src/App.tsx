import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHome from "@/pages/AdminHome";
import AdminCouple from "@/pages/AdminCouple";
import AdminMessages from "@/pages/AdminMessages";
import AdminRSVPs from "@/pages/AdminRSVPs";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public Landing Page */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {/* Admin Routes */}
          <Route path="/admin">
            {() => (
              <AdminDashboard>
                <AdminHome />
              </AdminDashboard>
            )}
          </Route>
          <Route path="/admin/couple">
            {() => (
              <AdminDashboard>
                <AdminCouple />
              </AdminDashboard>
            )}
          </Route>
          <Route path="/admin/messages">
            {() => (
              <AdminDashboard>
                <AdminMessages />
              </AdminDashboard>
            )}
          </Route>
          <Route path="/admin/rsvps">
            {() => (
              <AdminDashboard>
                <AdminRSVPs />
              </AdminDashboard>
            )}
          </Route>
          {/* Redirect authenticated users to admin by default */}
          <Route path="/">
            {() => {
              window.location.href = "/admin";
              return null;
            }}
          </Route>
        </>
      )}
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
