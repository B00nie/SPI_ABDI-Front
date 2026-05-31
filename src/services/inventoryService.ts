/**
 * ============================================================
 * INVENTORY SERVICE — Inventory data mock functions
 * ============================================================
 * CRUD operations for inventory items.
 *
 * CURRENT STATE: In-memory array acts as the mock "database".
 *
 * FUTURE INTEGRATION:
 *   - Each function becomes a fetch/axios call to the Python API.
 *   - Python API performs SQL operations on the `inventory_items`
 *     table with proper authentication and ownership checks.
 *   - Example routes:
 *       GET    /api/inventory
 *       POST   /api/inventory
 *       PATCH  /api/inventory/:id
 *       DELETE /api/inventory/:id
 */

import type { InventoryItem } from "../types";

const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// In-memory mock database — replaced by SQL table in production
let MOCK_INVENTORY: InventoryItem[] = [
  { id: "inv_001", name: "Sensor de Temperatura", category: "Sensores", quantity: 48, unit: "un", status: "available", lastUpdated: "2026-05-28T14:00:00Z" },
  { id: "inv_002", name: "Cabo de Rede CAT6", category: "Cabos", quantity: 12, unit: "m", status: "low", lastUpdated: "2026-05-27T09:30:00Z" },
  { id: "inv_003", name: "Controlador ESP32", category: "Microcontroladores", quantity: 0, unit: "un", status: "out_of_stock", lastUpdated: "2026-05-26T11:00:00Z" },
  { id: "inv_004", name: "Bateria 18650", category: "Energia", quantity: 5, unit: "un", status: "critical", lastUpdated: "2026-05-25T16:45:00Z" },
  { id: "inv_005", name: "Módulo GPS", category: "Sensores", quantity: 32, unit: "un", status: "available", lastUpdated: "2026-05-24T08:00:00Z" },
  { id: "inv_006", name: "Transformador 5V", category: "Energia", quantity: 20, unit: "un", status: "available", lastUpdated: "2026-05-23T13:20:00Z" },
];

// ─── LIST ALL ────────────────────────────────────────────────

/**
 * Returns the full inventory list.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/inventory', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json();
 *   // Python API: SELECT * FROM inventory_items ORDER BY name
 */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  await simulateDelay();
  return [...MOCK_INVENTORY];
}

// ─── CREATE ──────────────────────────────────────────────────

/**
 * Creates a new inventory item.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/inventory', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
 *     body: JSON.stringify(item),
 *   });
 *   return response.json();
 *   // Python API: INSERT INTO inventory_items (...) VALUES (...) RETURNING *
 */
export async function createInventoryItem(
  item: Omit<InventoryItem, "id" | "lastUpdated">
): Promise<InventoryItem> {
  await simulateDelay(600);

  const newItem: InventoryItem = {
    ...item,
    id: `inv_${Date.now()}`,
    lastUpdated: new Date().toISOString(),
  };

  MOCK_INVENTORY.push(newItem);
  return newItem;
}

// ─── UPDATE ──────────────────────────────────────────────────

/**
 * Updates an existing inventory item.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch(`/api/inventory/${id}`, {
 *     method: 'PATCH',
 *     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
 *     body: JSON.stringify(updates),
 *   });
 *   return response.json();
 *   // Python API: UPDATE inventory_items SET ... WHERE id = :id RETURNING *
 */
export async function updateInventoryItem(
  id: string,
  updates: Partial<Omit<InventoryItem, "id">>
): Promise<InventoryItem> {
  await simulateDelay(500);

  const index = MOCK_INVENTORY.findIndex((i) => i.id === id);
  if (index === -1) throw new Error(`Item ${id} não encontrado.`);

  MOCK_INVENTORY[index] = {
    ...MOCK_INVENTORY[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  return { ...MOCK_INVENTORY[index] };
}

// ─── DELETE ──────────────────────────────────────────────────

/**
 * Deletes an inventory item by ID.
 *
 * TODO: Replace this mock with:
 *   await fetch(`/api/inventory/${id}`, {
 *     method: 'DELETE',
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   // Python API: DELETE FROM inventory_items WHERE id = :id
 */
export async function deleteInventoryItem(id: string): Promise<void> {
  await simulateDelay(400);
  MOCK_INVENTORY = MOCK_INVENTORY.filter((i) => i.id !== id);
}
