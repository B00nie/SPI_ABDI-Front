/**
 * ============================================================
 * SETTINGS SERVICE — User settings mock functions
 * ============================================================
 * Handles reading and writing user preferences such as
 * language, timezone, day count, auto-save, and notifications.
 *
 * CURRENT STATE: Reads/writes to localStorage as a mock
 *   persistent store while the back-end is not yet connected.
 *
 * FUTURE INTEGRATION:
 *   - Replace localStorage calls with fetch/axios calls to the
 *     Python API (e.g., GET/PATCH /api/settings).
 *   - The Python API will query/update the `user_settings`
 *     SQL table keyed by the authenticated user's ID.
 */

import type { UserSettings } from "../types";

const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Default settings used when no saved settings exist yet
const DEFAULT_SETTINGS: UserSettings = {
  language: "pt-br",
  timezone: "brasilia",
  dayCount: 365,
  autoSave: true,
  notifications: {
    eventos: true,
    email: true,
    push: false,
  },
};

// localStorage key used by the mock to persist data
const STORAGE_KEY = "persona_user_settings";

// ─── GET SETTINGS ────────────────────────────────────────────

/**
 * Retrieves the current user's settings.
 *
 * @param _userId - User ID (ignored by mock, used by real API)
 * @returns Current UserSettings object
 *
 * TODO: Replace this mock with:
 *   const response = await fetch(`/api/settings/${userId}`, {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json();
 *   // Python API runs: SELECT * FROM user_settings WHERE user_id = :userId
 */
export async function getSettings(_userId: string): Promise<UserSettings> {
  await simulateDelay(400);

  // Mock reads from localStorage; real API would query the SQL database
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as UserSettings;
  }
  return { ...DEFAULT_SETTINGS };
}

// ─── SAVE SETTINGS ───────────────────────────────────────────

/**
 * Persists the user's settings.
 *
 * @param _userId - User ID (ignored by mock, used by real API)
 * @param settings - Full settings object to save
 *
 * TODO: Replace this mock with:
 *   await fetch(`/api/settings/${userId}`, {
 *     method: 'PATCH',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       Authorization: `Bearer ${token}`,
 *     },
 *     body: JSON.stringify(settings),
 *   });
 *   // Python API runs: UPDATE user_settings SET ... WHERE user_id = :userId
 */
export async function saveSettings(
  _userId: string,
  settings: UserSettings
): Promise<void> {
  await simulateDelay(600);

  // Mock writes to localStorage; real API would persist to SQL
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// ─── UPDATE NOTIFICATION PREFERENCE ─────────────────────────

/**
 * Toggles a single notification channel on/off.
 *
 * @param _userId - User ID
 * @param channel - "eventos" | "email" | "push"
 * @param enabled - New value
 *
 * TODO: Replace this mock with:
 *   await fetch(`/api/settings/${userId}/notifications/${channel}`, {
 *     method: 'PATCH',
 *     headers: { ... },
 *     body: JSON.stringify({ enabled }),
 *   });
 *   // Python API runs:
 *   // UPDATE notification_preferences SET enabled = :enabled
 *   // WHERE user_id = :userId AND channel = :channel
 */
export async function updateNotification(
  _userId: string,
  channel: string,
  enabled: boolean
): Promise<void> {
  await simulateDelay(300);

  const stored = localStorage.getItem(STORAGE_KEY);
  const current: UserSettings = stored
    ? JSON.parse(stored)
    : { ...DEFAULT_SETTINGS };

  current.notifications[channel] = enabled;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
