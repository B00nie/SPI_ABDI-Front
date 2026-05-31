/**
 * ============================================================
 * MAPEAMENTO — Floor plan mapping with camera selection
 * ============================================================
 * Displays a floor plan view and a camera selector modal on the right.
 */

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { getMapPoints } from "../../services/mappingService";
import type { MapPoint } from "../../types";

export function Mapeamento() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCameras, setShowCameras] = useState(false);

  useEffect(() => {
    getMapPoints()
      .then(setPoints)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar mapa.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a]">
      <div className="flex min-h-screen w-full">
        <Sidebar activePath="/mapeamento" />

        <section className="flex-1 overflow-auto px-8 py-6">
          <header className="mb-6">
            <h1 className="[font-family:'Merriweather',Helvetica] text-3xl font-extrabold text-white">
              Mapeamento
            </h1>
          </header>

          {isLoading && (
            <div className="h-96 animate-pulse rounded-2xl bg-gray-700" />
          )}

          {error && !isLoading && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-3 gap-6">
              {/* Floor plan area */}
              <div className="col-span-2 rounded-2xl border-4 border-[#8B4545] bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="[font-family:'Merriweather',Helvetica] text-base font-bold text-[#8B4545]">
                    Mapeamento
                  </h2>
                  <label className="flex items-center gap-2">
                    <span className="[font-family:'Merriweather',Helvetica] text-xs font-medium text-[#1a1a1a]">
                      Mostrar Câmeras
                    </span>
                    <input
                      type="checkbox"
                      checked={showCameras}
                      onChange={(e) => setShowCameras(e.target.checked)}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Floor plan placeholder */}
                <div className="relative overflow-auto rounded-xl bg-[#f5f5f5] p-4">
                  <svg
                    viewBox="0 0 800 600"
                    className="h-auto w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Grid background */}
                    <defs>
                      <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="#ddd"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="800" height="600" fill="url(#grid)" />

                    {/* Floor plan outline */}
                    <rect
                      x="50"
                      y="50"
                      width="700"
                      height="500"
                      fill="none"
                      stroke="#333"
                      strokeWidth="2"
                    />

                    {/* Room dividers - simplified layout */}
                    <line x1="250" y1="50" x2="250" y2="550" stroke="#999" strokeWidth="1" />
                    <line x1="550" y1="50" x2="550" y2="550" stroke="#999" strokeWidth="1" />
                    <line x1="50" y1="300" x2="750" y2="300" stroke="#999" strokeWidth="1" />
                  </svg>

                  {/* Camera info text */}
                  <p className="absolute bottom-4 left-4 [font-family:'Merriweather',Helvetica] text-[10px] text-gray-500">
                    PLANTA BAIXA DA FÁBRICA - SETORES
                  </p>
                </div>
              </div>

              {/* Camera selector panel */}
              <div className="rounded-2xl border-4 border-[#8B4545] bg-white p-6">
                <h2 className="mb-4 [font-family:'Merriweather',Helvetica] text-base font-bold text-[#1a1a1a]">
                  Câmera:
                </h2>

                <label className="mb-4 flex items-center gap-2">
                  <span className="[font-family:'Merriweather',Helvetica] text-xs font-medium text-[#1a1a1a]">
                    Câmera
                  </span>
                  <input
                    type="text"
                    placeholder="ZONA A (NORTE)"
                    className="rounded-full border-2 border-[#8B4545] bg-white px-3 py-1 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a] flex-1"
                  />
                </label>

                {/* Camera feed placeholder */}
                <div className="flex h-40 items-center justify-center rounded-xl bg-blue-300 mb-4">
                  <span className="text-5xl text-blue-600 opacity-30">📷</span>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-blue-500 px-3 py-1.5 [font-family:'Merriweather',Helvetica] text-xs font-bold text-white transition-colors hover:bg-blue-600"
                  >
                    Selecione a câmera
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg border-2 border-[#8B4545] bg-white px-3 py-1.5 [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#8B4545] transition-colors hover:bg-gray-50"
                  >
                    Ir para a câmera
                  </button>
                </div>

                {/* Support note */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="[font-family:'Merriweather',Helvetica] text-[9px] text-gray-600">
                    Suporte a uma de seleção por setores
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
