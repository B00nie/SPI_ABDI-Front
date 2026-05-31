/**
 * ============================================================
 * AUTH CONTEXT — Global authentication state management
 * ============================================================
 * React Context provides a way to share state across the entire
 * component tree without manually passing props at each level.
 *
 * This context holds:
 *   - The currently logged-in User object (or null)
 *   - The JWT token (or null)
 *   - Loading state while checking an existing session
 *   - login / logout / register helper functions
 *
 * Any component in the app can access auth state via the
 * `useAuth()` hook exported at the bottom of this file.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from "../services/authService";
import type { AuthSession, LoginCredentials, RegisterPayload, User } from "../types";

// ─── CONTEXT SHAPE ───────────────────────────────────────────

/**
 * Describes all values and functions available from this context.
 */
interface AuthContextValue {
  /** The authenticated user, or null if not logged in */
  user: User | null;
  /** Raw JWT token string (will be sent in API headers) */
  token: string | null;
  /** True while the app is checking for an existing session on startup */
  isLoading: boolean;
  /** Attempts login; throws on failure */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Creates a new account; throws on failure */
  register: (payload: RegisterPayload) => Promise<void>;
  /** Clears the session and redirects to login */
  logout: () => Promise<void>;
}

// Create the context with undefined as default so we can detect
// if useAuth() is used outside of AuthProvider
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// localStorage keys for persisting session across page reloads
const TOKEN_KEY = "persona_token";

// ─── AUTH PROVIDER ───────────────────────────────────────────

/**
 * Wraps the whole app and makes auth state available everywhere.
 * Place this high in the component tree (e.g., in App.tsx or main.tsx).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // user: the authenticated User object; null when logged out
  const [user, setUser] = useState<User | null>(null);

  // token: the JWT bearer token stored between sessions
  const [token, setToken] = useState<string | null>(null);

  // isLoading: prevents rendering protected routes before we know
  // whether an existing token is valid
  const [isLoading, setIsLoading] = useState(true);

  // ── Session restoration on mount ───────────────────────────
  // useEffect with an empty dependency array runs once after the
  // first render (componentDidMount equivalent).
  // It checks localStorage for a saved token and validates it.
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    // Validate the stored token by fetching the current user
    // TODO: When connecting the real API, getCurrentUser() will call
    //       GET /api/auth/me with the token as a Bearer header.
    getCurrentUser(savedToken)
      .then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser);
          setToken(savedToken);
        } else {
          // Token was invalid or expired; clear it
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // ── Login ───────────────────────────────────────────────────
  const login = useCallback(async (credentials: LoginCredentials) => {
    // loginService calls the mock (or real) API and returns a session
    const session: AuthSession = await loginService(credentials);

    // Persist token so the session survives page refresh
    localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
  }, []);

  // ── Register ────────────────────────────────────────────────
  const register = useCallback(async (payload: RegisterPayload) => {
    const session: AuthSession = await registerService(payload);
    localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
  }, []);

  // ── Logout ──────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await logoutService();
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Provide the context value to all descendant components
  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── useAuth HOOK ─────────────────────────────────────────────

/**
 * Custom hook that gives any component access to auth state.
 *
 * Usage:
 *   const { user, login, logout } = useAuth();
 *
 * Must be used inside an <AuthProvider> component.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
