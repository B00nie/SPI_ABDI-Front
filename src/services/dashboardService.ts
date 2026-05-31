/**
 * ============================================================
 * DASHBOARD SERVICE — Dashboard data mock functions
 * ============================================================
 * Provides KPI metrics and chart data for the Dashboard screen.
 *
 * CURRENT STATE: Returns hardcoded static data arrays.
 *
 * FUTURE INTEGRATION:
 *   - Replace mocks with fetch calls to the Python API.
 *   - Python API will aggregate data from multiple SQL tables
 *     and return pre-calculated metrics for performance.
 *   - Example Python routes:
 *       GET /api/dashboard/metrics
 *       GET /api/dashboard/chart?period=monthly
 */

import type { ChartDataPoint, DashboardMetric } from "../types";

const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── GET METRICS ─────────────────────────────────────────────

/**
 * Returns the main KPI cards shown at the top of the Dashboard.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/dashboard/metrics', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json();
 *   // Python API aggregates data from `inventory_items`, `devices`,
 *   // and `activity_logs` tables to compute these metrics.
 */
export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  await simulateDelay();

  return [
    {
      id: "total_itens",
      label: "Total de Itens",
      value: 1_247,
      change: 8.2,
      unit: "itens",
    },
    {
      id: "dispositivos_online",
      label: "Dispositivos Online",
      value: 34,
      change: -2.1,
      unit: "dispositivos",
    },
    {
      id: "alertas_ativos",
      label: "Alertas Ativos",
      value: 7,
      change: 40.0,
      unit: "alertas",
    },
    {
      id: "utilizacao_media",
      label: "Utilização Média",
      value: "72%",
      change: 3.5,
    },
  ];
}

// ─── GET MONTHLY CHART DATA ───────────────────────────────────

/**
 * Returns monthly data points for the activity trend chart.
 *
 * TODO: Replace this mock with:
 *   const response = await fetch('/api/dashboard/chart?period=monthly', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return response.json();
 *   // Python API runs a GROUP BY query on the `activity_logs` table:
 *   // SELECT DATE_TRUNC('month', timestamp) AS label, COUNT(*) AS value
 *   // FROM activity_logs WHERE user_id = :userId
 *   // GROUP BY 1 ORDER BY 1 DESC LIMIT 12
 */
export async function getMonthlyChartData(): Promise<ChartDataPoint[]> {
  await simulateDelay(400);

  return [
    { label: "Jun", value: 42 },
    { label: "Jul", value: 58 },
    { label: "Ago", value: 73 },
    { label: "Set", value: 61 },
    { label: "Out", value: 89 },
    { label: "Nov", value: 95 },
    { label: "Dez", value: 77 },
    { label: "Jan", value: 103 },
    { label: "Fev", value: 118 },
    { label: "Mar", value: 99 },
    { label: "Abr", value: 134 },
    { label: "Mai", value: 147 },
  ];
}

/**
 * Returns weekly chart data for a shorter view period.
 *
 * TODO: Replace with:
 *   const response = await fetch('/api/dashboard/chart?period=weekly', { ... });
 *   return response.json();
 */
export async function getWeeklyChartData(): Promise<ChartDataPoint[]> {
  await simulateDelay(300);

  return [
    { label: "Seg", value: 24 },
    { label: "Ter", value: 31 },
    { label: "Qua", value: 18 },
    { label: "Qui", value: 42 },
    { label: "Sex", value: 38 },
    { label: "Sáb", value: 15 },
    { label: "Dom", value: 9 },
  ];
}
