import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  AuthProvider,
  UserRole,
  getHomePathForRole,
  useAuth,
} from "./features/auth/AuthContext";
import { Login } from "./pages/Login";
import { ExecutiveDashboard } from "./pages/ExecutiveDashboard";
import { TechnicianDashboard } from "./pages/TechnicianDashboard";
import { ClientDashboard } from "./pages/ClientDashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Calendar } from "./pages/Calendar";
import { AuditLogs } from "./pages/AuditLogs";
import { SecurityLogs } from "./pages/SecurityLogs";
import { SettingsProfile } from "./pages/SettingsProfile";
import { SettingsSecurity } from "./pages/SettingsSecurity";
import { TechnicianCalendar } from "./pages/TechnicianCalendar";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles) {
    if (!user) {
      return null;
    }

    if (!roles.includes(user.role)) {
      return <Navigate to={getHomePathForRole(user.role)} replace />;
    }
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated ? (
    <Navigate to={getHomePathForRole(user?.role)} replace />
  ) : (
    <>{children}</>
  );
}

const allRoles: UserRole[] = ["admin", "technician", "client"];

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Dashboards */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute roles={["admin"]}>
            <ExecutiveDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/technician"
        element={
          <PrivateRoute roles={["technician"]}>
            <TechnicianDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/client"
        element={
          <PrivateRoute roles={["client"]}>
            <ClientDashboard />
          </PrivateRoute>
        }
      />

      {/* Technician calendar */}
      <Route
        path="/technician-calendar"
        element={
          <PrivateRoute roles={["technician"]}>
            <TechnicianCalendar />
          </PrivateRoute>
        }
      />

      {/* Admin pages */}
      <Route
        path="/projects"
        element={
          <PrivateRoute roles={["admin"]}>
            <Projects />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <PrivateRoute roles={["admin"]}>
            <ProjectDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute roles={["admin"]}>
            <Calendar />
          </PrivateRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <PrivateRoute roles={["admin"]}>
            <AuditLogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/security-logs"
        element={
          <PrivateRoute roles={["admin"]}>
            <SecurityLogs />
          </PrivateRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings/profile"
        element={
          <PrivateRoute roles={allRoles}>
            <SettingsProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/security"
        element={
          <PrivateRoute roles={allRoles}>
            <SettingsSecurity />
          </PrivateRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to={getHomePathForRole(user?.role)} replace />}
      />
    </Routes>
  );
}

export function App() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = "fa";
      document.documentElement.dir = "rtl";
      document.body.dir = "rtl";
      document.body.style.textAlign = "right";
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
