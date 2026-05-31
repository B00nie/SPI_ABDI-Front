/**
 * ============================================================
 * AUTH SERVICE — Authentication mock functions
 * ============================================================
 * This file contains ALL authentication-related API calls.
 *
 * CURRENT STATE: Uses static mock data (no real back-end).
 *
 * FUTURE INTEGRATION:
 *   - Replace each mock with a real fetch/axios call to the
 *     Python back-end (FastAPI or Django REST Framework).
 *   - The Python API will validate credentials and issue JWT
 *     tokens stored in the SQL `users` table.
 *   - Example Python route: POST /api/auth/login
 */

import type { AuthSession, LoginCredentials, RegisterPayload, User } from "../types";

// ─── SIMULATED DELAY ─────────────────────────────────────────
// Mimics the latency of a real HTTP call so the UI can show
// loading states, which will remain useful once the real API
// is connected.
const simulateDelay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── MOCK DATA ───────────────────────────────────────────────
// Static user data used while the back-end is not yet available.
// TODO: Remove this mock data block when the real API is ready.

const MOCK_USERS: User[] = [
  {
    id: "usr_001",
    name: "Persona",
    email: "admin@persona.com",
    role: "ADMIN",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "usr_002",
    name: "Maria Silva",
    email: "maria@persona.com",
    role: "USER",
    createdAt: "2024-03-20T08:30:00Z",
  },
];

// ─── LOGIN ───────────────────────────────────────────────────

/**
 * Authenticates a user with email and password.
 *
 * @param credentials - { email, password }
 * @returns AuthSession with JWT token and user object
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/auth/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *   });
 *   return response.json(); // Python API returns { token, user, expiresAt }
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  await simulateDelay();

  // Mock validation: accept any password for registered emails
  const user = MOCK_USERS.find((u) => u.email === credentials.email);

  if (!user || credentials.password.length < 6) {
    // Simulates a 401 Unauthorized response from the Python API
    throw new Error("E-mail ou senha inválidos.");
  }

  return {
    token: `mock_jwt_token_${user.id}_${Date.now()}`,
    user,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8h
  };
}

// ─── REGISTER ────────────────────────────────────────────────

/**
 * Creates a new user account.
 *
 * @param payload - { name, email, password }
 * @returns AuthSession for the newly created user
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/auth/register', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!response.ok) throw new Error(await response.text());
 *   return response.json(); // Python API inserts user into SQL `users` table
 */
export async function register(payload: RegisterPayload): Promise<AuthSession> {
  await simulateDelay(800);

  // Check for duplicate email (the SQL DB would enforce a UNIQUE constraint)
  const exists = MOCK_USERS.find((u) => u.email === payload.email);
  if (exists) {
    throw new Error("Este e-mail já está em uso.");
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: payload.name,
    email: payload.email,
    role: "USER",
    createdAt: new Date().toISOString(),
  };

  // In the mock we push to the local array; the real API writes to SQL
  MOCK_USERS.push(newUser);

  return {
    token: `mock_jwt_token_${newUser.id}_${Date.now()}`,
    user: newUser,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  };
}

// ─── LOGOUT ──────────────────────────────────────────────────

/**
 * Invalidates the current session.
 *
 * TODO: Replace this mock with:
 *   await fetch('/api/auth/logout', {
 *     method: 'POST',
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   // Python API blacklists the JWT token in the SQL `revoked_tokens` table
 */
export async function logout(): Promise<void> {
  await simulateDelay(300);
  // Mock: nothing to do client-side except clear local storage (handled by AuthContext)
}

// ─── GET CURRENT USER ────────────────────────────────────────

/**
 * Fetches the current user's profile using a stored JWT token.
 * Called on app start to restore a previous session.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/auth/me', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json(); // Python API decodes JWT and returns user from SQL
 */
export async function getCurrentUser(token: string): Promise<User | null> {
  await simulateDelay(400);

  // Extract userId from the mock token format: "mock_jwt_token_usr_001_..."
  const parts = token.split("_");
  const userId = parts.slice(3, 5).join("_"); // rebuilds "usr_001"
  return MOCK_USERS.find((u) => u.id === userId) ?? null;
}
