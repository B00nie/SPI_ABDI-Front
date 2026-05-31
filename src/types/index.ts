/**
 * ============================================================
 * TYPES & INTERFACES — Central type definitions for the app
 * ============================================================
 * All shared TypeScript types live here so that the codebase
 * stays consistent. When the Python back-end is connected,
 * these types should mirror the response shapes of the API
 * (e.g., the JSON returned from FastAPI/Django endpoints).
 */

// ─── AUTH ────────────────────────────────────────────────────

/**
 * Represents a logged-in user returned by the authentication API.
 * Maps to the `users` table in the SQL database.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "VIEWER";
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Credentials sent to the login endpoint.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Data needed to create a new user account.
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

/**
 * Shape of the session token returned by the auth API.
 */
export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
}

// ─── NOTIFICATIONS ───────────────────────────────────────────

/**
 * A user's notification preference for one channel.
 * Maps to the `notification_preferences` table.
 */
export interface NotificationPreference {
  id: string;           // "eventos" | "email" | "push"
  title: string;
  description: string;
  enabled: boolean;
}

// ─── SETTINGS ────────────────────────────────────────────────

/**
 * Full settings object for a user.
 * Maps to the `user_settings` table.
 */
export interface UserSettings {
  language: string;
  timezone: string;
  dayCount: number;
  autoSave: boolean;
  notifications: Record<string, boolean>;
}

// ─── DASHBOARD ───────────────────────────────────────────────

/**
 * A single KPI metric card displayed on the Dashboard.
 */
export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: number;    // percentage change (positive = up, negative = down)
  unit?: string;
}

/**
 * A single data point for chart rendering on the Dashboard.
 */
export interface ChartDataPoint {
  label: string;   // e.g., month name or date
  value: number;
}

// ─── INVENTÁRIO ──────────────────────────────────────────────

/**
 * A single inventory item.
 * Maps to the `inventory_items` table in the SQL database.
 */
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: "available" | "low" | "critical" | "out_of_stock";
  lastUpdated: string;
}

// ─── MAPEAMENTO ──────────────────────────────────────────────

/**
 * A geographic coordinate point used in mapping.
 */
export interface MapPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  type: "sensor" | "station" | "alert" | "info";
  description?: string;
}

// ─── PAINEL DE CONTROLE ──────────────────────────────────────

/**
 * A single control panel action / device entry.
 * Maps to the `control_panel_devices` table.
 */
export interface ControlDevice {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "warning";
  value: number;   // e.g., current reading or setting (0-100)
  unit: string;
  lastUpdated: string;
}

/**
 * A log entry from the control panel activity feed.
 */
export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  level: "info" | "warning" | "error";
  deviceId?: string;
}
