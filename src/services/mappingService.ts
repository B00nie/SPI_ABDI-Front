/**
 * ============================================================
 * MAPPING SERVICE — Mapeamento mock functions
 * ============================================================
 * Provides geographic map points for the Mapeamento screen.
 *
 * CURRENT STATE: Returns static coordinate mock data.
 *
 * FUTURE INTEGRATION:
 *   - Replace mocks with fetch calls to the Python API.
 *   - Map points are stored in the `map_points` SQL table with
 *     PostGIS geometry columns for efficient spatial queries.
 *   - Example routes:
 *       GET /api/map/points
 *       POST /api/map/points
 *       DELETE /api/map/points/:id
 */

import type { MapPoint } from "../types";

const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// In-memory mock for map points — maps to `map_points` SQL table
let MOCK_MAP_POINTS: MapPoint[] = [
  { id: "mp_001", label: "Estação Central", lat: -15.793889, lng: -47.882778, type: "station", description: "Estação de monitoramento principal em Brasília" },
  { id: "mp_002", label: "Sensor Norte", lat: -15.720000, lng: -47.900000, type: "sensor", description: "Sensor de temperatura e umidade" },
  { id: "mp_003", label: "Alerta Zona Sul", lat: -15.850000, lng: -47.950000, type: "alert", description: "Área com leitura anormal detectada" },
  { id: "mp_004", label: "Ponto Info A", lat: -15.780000, lng: -47.860000, type: "info", description: "Ponto de referência de manutenção" },
  { id: "mp_005", label: "Sensor Leste", lat: -15.760000, lng: -47.820000, type: "sensor", description: "Sensor de pressão atmosférica" },
];

// ─── GET MAP POINTS ──────────────────────────────────────────

/**
 * Returns all geographic points to render on the map.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/map/points', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json();
 *   // Python API (with PostGIS):
 *   // SELECT id, label, ST_X(coords) AS lng, ST_Y(coords) AS lat,
 *   //        type, description FROM map_points
 */
export async function getMapPoints(): Promise<MapPoint[]> {
  await simulateDelay();
  return [...MOCK_MAP_POINTS];
}

// ─── CREATE MAP POINT ─────────────────────────────────────────

/**
 * Adds a new point to the map.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/map/points', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
 *     body: JSON.stringify(point),
 *   });
 *   return response.json();
 *   // Python API:
 *   // INSERT INTO map_points (label, coords, type, description)
 *   // VALUES (:label, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :type, :description)
 *   // RETURNING *
 */
export async function createMapPoint(
  point: Omit<MapPoint, "id">
): Promise<MapPoint> {
  await simulateDelay(600);

  const newPoint: MapPoint = { ...point, id: `mp_${Date.now()}` };
  MOCK_MAP_POINTS.push(newPoint);
  return newPoint;
}

// ─── DELETE MAP POINT ─────────────────────────────────────────

/**
 * Removes a point from the map.
 *
 * TODO: Replace this mock with:
 *   await fetch(`/api/map/points/${id}`, {
 *     method: 'DELETE',
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   // Python API: DELETE FROM map_points WHERE id = :id
 */
export async function deleteMapPoint(id: string): Promise<void> {
  await simulateDelay(300);
  MOCK_MAP_POINTS = MOCK_MAP_POINTS.filter((p) => p.id !== id);
}
