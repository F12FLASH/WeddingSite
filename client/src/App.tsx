import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";
import { FontProvider } from "@/components/FontProvider";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHome from "@/pages/AdminHome";
import AdminCouple from "@/pages/AdminCouple";
import AdminMessages from "@/pages/AdminMessages";
import AdminRSVPs from "@/pages/AdminRSVPs";
import AdminSchedule from "@/pages/AdminSchedule";
import AdminGallery from "@/pages/AdminGallery";
import AdminRegistry from "@/pages/AdminRegistry";
import AdminSettings from "@/pages/AdminSettings";
import AdminWeddingParty from "@/pages/AdminWeddingParty";
import AdminGuestPhotos from "@/pages/AdminGuestPhotos";
import AdminLivestream from "@/pages/AdminLivestream";
import AdminPopups from "@/pages/AdminPopups";
import AdminLocation from "@/pages/AdminLocation";
import AdminAccount from "@/pages/AdminAccount";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-primary">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public Landing Page */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />

      {/* Protected Admin Routes */}
      <Route path="/admin">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminHome />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/couple">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminCouple />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/messages">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminMessages />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/rsvps">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminRSVPs />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/schedule">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminSchedule />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/gallery">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminGallery />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/registry">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminRegistry />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminSettings />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/wedding-party">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminWeddingParty />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/guest-photos">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminGuestPhotos />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/livestream">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminLivestream />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/popups">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminPopups />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/location">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminLocation />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/account">
        {() => (
          <ProtectedRoute>
            <AdminDashboard>
              <AdminAccount />
            </AdminDashboard>
          </ProtectedRoute>
        )}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FontProvider>
        <TooltipProvider>
          <LoadingScreen />
          <Toaster />
          <Router />
        </TooltipProvider>
      </FontProvider>
    </QueryClientProvider>
  );
}
