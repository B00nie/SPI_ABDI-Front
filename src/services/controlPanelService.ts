/**
 * ============================================================
 * CONTROL PANEL SERVICE — Painel de Controle mock functions
 * ============================================================
 * Fetches device status, readings, and activity logs for
 * the Painel de Controle (Control Panel) screen.
 *
 * CURRENT STATE: Returns static mock data.
 *
 * FUTURE INTEGRATION:
 *   - Replace mocks with real-time API calls (possibly WebSocket
 *     for live device readings) to the Python back-end.
 *   - Device data lives in the `control_panel_devices` SQL table.
 *   - Activity logs live in the `activity_logs` SQL table.
 *   - Example routes:
 *       GET /api/devices
 *       PATCH /api/devices/:id/value
 *       GET /api/activity-logs?limit=20
 */

import type { ActivityLog, ControlDevice } from "../types";

const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// In-memory mock device list — maps to `control_panel_devices` SQL table
let MOCK_DEVICES: ControlDevice[] = [
  { id: "dev_001", name: "Ventilador Principal", type: "Ventilador", status: "online", value: 75, unit: "%", lastUpdated: "2026-05-31T10:00:00Z" },
  { id: "dev_002", name: "Bomba Hidráulica", type: "Bomba", status: "online", value: 60, unit: "%", lastUpdated: "2026-05-31T10:05:00Z" },
  { id: "dev_003", name: "Termostato Zona A", type: "Termostato", status: "warning", value: 28, unit: "°C", lastUpdated: "2026-05-31T09:55:00Z" },
  { id: "dev_004", name: "Iluminação Setor 1", type: "Iluminação", status: "online", value: 100, unit: "%", lastUpdated: "2026-05-31T10:10:00Z" },
  { id: "dev_005", name: "Sensor de Pressão", type: "Sensor", status: "offline", value: 0, unit: "bar", lastUpdated: "2026-05-30T18:00:00Z" },
  { id: "dev_006", name: "Compressor A2", type: "Compressor", status: "online", value: 45, unit: "%", lastUpdated: "2026-05-31T10:08:00Z" },
];

// ─── GET DEVICES ─────────────────────────────────────────────

/**
 * Retrieves the list of all controllable devices.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/devices', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json();
 *   // Python API: SELECT * FROM control_panel_devices ORDER BY name
 *   //
 *   // For real-time readings, consider upgrading to WebSocket:
 *   //   const ws = new WebSocket('wss://api.example.com/ws/devices');
 *   //   ws.onmessage = (event) => setDevices(JSON.parse(event.data));
 */
export async function getDevices(): Promise<ControlDevice[]> {
  await simulateDelay();
  return [...MOCK_DEVICES];
}

// ─── UPDATE DEVICE VALUE ─────────────────────────────────────

/**
 * Changes a device's operational value (e.g., fan speed to 80%).
 *
 * @param id - Device ID
 * @param value - New value (0-100 or physical unit)
 *
 * TODO: Replace this mock with:
 *   await fetch(`/api/devices/${id}/value`, {
 *     method: 'PATCH',
 *     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
 *     body: JSON.stringify({ value }),
 *   });
 *   // Python API: UPDATE control_panel_devices SET value = :value WHERE id = :id
 *   // Also logs the change in `activity_logs` with the acting user's ID.
 */
export async function updateDeviceValue(id: string, value: number): Promise<ControlDevice> {
  await simulateDelay(400);

  const index = MOCK_DEVICES.findIndex((d) => d.id === id);
  if (index === -1) throw new Error(`Dispositivo ${id} não encontrado.`);

  MOCK_DEVICES[index] = {
    ...MOCK_DEVICES[index],
    value,
    lastUpdated: new Date().toISOString(),
  };

  return { ...MOCK_DEVICES[index] };
}

// ─── GET ACTIVITY LOGS ───────────────────────────────────────

/**
 * Fetches the most recent activity log entries.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/activity-logs?limit=20', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json();
 *   // Python API:
 *   // SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 20
 */
export async function getActivityLogs(): Promise<ActivityLog[]> {
  await simulateDelay(350);

  return [
    { id: "log_001", timestamp: "2026-05-31T10:10:00Z", message: "Iluminação Setor 1 ajustada para 100%", level: "info", deviceId: "dev_004" },
    { id: "log_002", timestamp: "2026-05-31T10:08:00Z", message: "Compressor A2 iniciado manualmente", level: "info", deviceId: "dev_006" },
    { id: "log_003", timestamp: "2026-05-31T10:05:00Z", message: "Bomba Hidráulica: valor alterado para 60%", level: "info", deviceId: "dev_002" },
    { id: "log_004", timestamp: "2026-05-31T09:55:00Z", message: "ALERTA: Termostato Zona A acima do limite (28°C)", level: "warning", deviceId: "dev_003" },
    { id: "log_005", timestamp: "2026-05-30T18:00:00Z", message: "Sensor de Pressão ficou offline", level: "error", deviceId: "dev_005" },
    { id: "log_006", timestamp: "2026-05-30T14:30:00Z", message: "Backup automático de configurações concluído", level: "info" },
  ];
}
