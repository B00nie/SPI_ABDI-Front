/**
 * ============================================================
 * APP — Root component with routing and auth protection
 * ============================================================
 * This file wires together:
 *   1. AuthProvider — provides global auth state to all routes
 *   2. BrowserRouter — enables client-side URL-based routing
 *   3. Route definitions — maps URL paths to screen components
 *   4. ProtectedRoute — redirects unauthenticated users to /login
 *
 * Route structure:
 *   /login          → Login screen (public)
 *   /registro       → Registration screen (public)
 *   /dashboard      → Dashboard (protected)
 *   /painel         → Painel de Controle (protected)
 *   /mapeamento     → Mapeamento (protected)
 *   /inventario     → Inventário (protected)
 *   /configuracoes  → Configurações (protected)
 *   /               → redirect to /dashboard
 *   *               → redirect to /dashboard (404 fallback)
 */

import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Configurao } from "./screens/Configurao";
import { Dashboard } from "./screens/Dashboard";
import { Inventario } from "./screens/Inventario";
import { Login } from "./screens/Login";
import { Mapeamento } from "./screens/Mapeamento";
import { PainelControle } from "./screens/PainelControle";
import { Registro } from "./screens/Registro";

// ─── PROTECTED ROUTE ─────────────────────────────────────────

/**
 * Wraps a screen component so only authenticated users can access it.
 *
 * How it works:
 *   - While auth state is loading (checking localStorage token), shows nothing.
 *   - If the user is NOT logged in, redirects to /login.
 *   - If the user IS logged in, renders the children normally.
 *
 * The `replace` prop on <Navigate> replaces the current history entry
 * instead of pushing a new one, so the back button doesn't loop.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // useAuth reads from AuthContext (set up by AuthProvider above in the tree)
  const { user, isLoading } = useAuth();

  // While checking the stored token on startup, render nothing to avoid flicker
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#132b4f]">
        <p className="[font-family:'Merriweather',Helvetica] text-sm text-[#7292b4]">
          Carregando...
        </p>
      </div>
    );
  }

  // Not authenticated: redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated: render the page normally
  return <>{children}</>;
}

// ─── APP COMPONENT ───────────────────────────────────────────

/**
 * Root component. AuthProvider must wrap Router so that all route
 * components (including ProtectedRoute) can call useAuth().
 */
export function App() {
  return (
    // AuthProvider wraps the entire app so auth state is globally accessible
    <AuthProvider>
      {/*
        BrowserRouter uses the HTML5 History API for clean URLs (no #hash).
        The `basename` prop can be set for subdirectory deployments, e.g.:
          <Router basename="/app">
      */}
      <Router>
        <Routes>
          {/* ── Public routes ─────────────────────────────────── */}
          {/* These routes are accessible without authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* ── Protected routes ──────────────────────────────── */}
          {/* Each is wrapped in ProtectedRoute to enforce auth */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/painel"
            element={
              <ProtectedRoute>
                <PainelControle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mapeamento"
            element={
              <ProtectedRoute>
                <Mapeamento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <Inventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <ProtectedRoute>
                <Configurao />
              </ProtectedRoute>
            }
          />

          {/* ── Default redirects ──────────────────────────────── */}
          {/* / redirects to the dashboard (the main app entry point) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all: any unknown URL redirects to the dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
