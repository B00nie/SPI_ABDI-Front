/**
 * ============================================================
 * DASHBOARD SCREEN — Main landing page with camera view
 * ============================================================
 * Displays a camera feed area and a camera selection dropdown.
 * The modal allows users to generate reports with customizable
 * parameters (sector, date range, format, inventory inclusion).
 */

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardMetrics,
  getMonthlyChartData,
} from "../../services/dashboardService";
import type { ChartDataPoint, DashboardMetric } from "../../types";

export function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Report form state
  const [reportForm, setReportForm] = useState({
    sector: "ZONA A (NORTE)",
    dateFrom: "23/05/2026",
    dateTo: "23/05/2026",
    format: "Excel",
    includeInventory: true,
  });

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getDashboardMetrics(), getMonthlyChartData()])
      .then(([fetchedMetrics, fetchedChart]) => {
        setMetrics(fetchedMetrics);
        setChartData(fetchedChart);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleGenerateReport = async () => {
    // TODO: Send report generation request to Python API
    console.log("Generating report:", reportForm);
    setShowReportModal(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a]">
      <div className="flex min-h-screen w-full">
        <Sidebar activePath="/dashboard" />

        <section className="flex-1 overflow-auto px-8 py-6">
          <header className="mb-6">
            <h1 className="[font-family:'Merriweather',Helvetica] text-3xl font-extrabold leading-none text-white">
              Dashboard
            </h1>
          </header>

          {isLoading && (
            <div className="space-y-4">
              <div className="h-64 animate-pulse rounded-2xl bg-gray-700" />
              <div className="h-32 animate-pulse rounded-2xl bg-gray-700" />
            </div>
          )}

          {error && !isLoading && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-6">
              {/* Camera Feed Area */}
              <div className="grid grid-cols-3 gap-6">
                {/* Main camera view */}
                <div className="col-span-2 rounded-2xl border-4 border-[#8B4545] bg-[#4a7ba7] p-8 shadow-lg">
                  <div className="flex h-64 items-center justify-center rounded-xl bg-[#5a8bb7]">
                    <div className="text-6xl text-[#8B4545] opacity-30">📷</div>
                  </div>

                  {/* Camera selector */}
                  <div className="mt-4 flex items-center gap-3">
                    <label className="[font-family:'Merriweather',Helvetica] text-sm font-medium text-[#1a1a1a]">
                      Câmeras:
                    </label>
                    <input
                      type="text"
                      placeholder="ZONA A (NORTE)"
                      className="rounded-full border-2 border-[#8B4545] bg-white px-4 py-1.5 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Info card and button */}
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border-4 border-[#8B4545] bg-white p-4">
                    <p className="[font-family:'Merriweather',Helvetica] text-xs font-bold text-[#8B4545] mb-2">
                      Câmera ativa:
                    </p>
                    <p className="[font-family:'Merriweather',Helvetica] text-[10px] leading-relaxed text-[#1a1a1a]">
                      ZONA A (NORTE) - Detectada anomalia. Revisar status do equipamento. Verificar padrão de temperatura.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="rounded-lg bg-[#2a3f5f] px-6 py-2 [font-family:'Merriweather',Helvetica] text-xs font-bold text-white transition-colors hover:bg-[#3a4f6f]"
                  >
                    Gerar relatório
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="[font-family:'Merriweather',Helvetica] text-lg font-bold text-[#8B4545]">
                Gerar relatório
              </h2>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-xl text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Sector */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Setor:
                </label>
                <select
                  value={reportForm.sector}
                  onChange={(e) =>
                    setReportForm((p) => ({ ...p, sector: e.target.value }))
                  }
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                >
                  <option>ZONA A (NORTE)</option>
                  <option>ZONA B (SUL)</option>
                  <option>ZONA C (LESTE)</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                    Data:
                  </label>
                  <input
                    type="text"
                    value={reportForm.dateFrom}
                    onChange={(e) =>
                      setReportForm((p) => ({ ...p, dateFrom: e.target.value }))
                    }
                    placeholder="23/05/2026"
                    className="w-full rounded-lg border-2 border-[#8B4545] px-2 py-1.5 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                  />
                </div>
                <div>
                  <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                    Até:
                  </label>
                  <input
                    type="text"
                    value={reportForm.dateTo}
                    onChange={(e) =>
                      setReportForm((p) => ({ ...p, dateTo: e.target.value }))
                    }
                    placeholder="23/05/2026"
                    className="w-full rounded-lg border-2 border-[#8B4545] px-2 py-1.5 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                  />
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Formato:
                </label>
                <select
                  value={reportForm.format}
                  onChange={(e) =>
                    setReportForm((p) => ({ ...p, format: e.target.value }))
                  }
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                >
                  <option>Excel</option>
                  <option>PDF</option>
                  <option>CSV</option>
                </select>
              </div>

              {/* Include Inventory */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reportForm.includeInventory}
                    onChange={(e) =>
                      setReportForm((p) => ({
                        ...p,
                        includeInventory: e.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  <span className="[font-family:'Merriweather',Helvetica] text-xs font-medium text-[#1a1a1a]">
                    Incluir inventário
                  </span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="flex-1 rounded-lg bg-[#8B4545] px-4 py-2 [font-family:'Merriweather',Helvetica] text-xs font-bold text-white transition-colors hover:bg-[#9b5555]"
                >
                  Gerar relatório
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 rounded-lg border-2 border-[#8B4545] bg-white px-4 py-2 [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#8B4545] transition-colors hover:bg-[#f5f5f5]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
