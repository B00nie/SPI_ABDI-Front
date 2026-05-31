/**
 * ============================================================
 * PAINEL DE CONTROLE — Control panel with device toggles
 * ============================================================
 * Displays a grid of controllable body parts/zones with toggle
 * switches, plus a sector selector modal.
 */

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import {
  getActivityLogs,
  getDevices,
  updateDeviceValue,
} from "../../services/controlPanelService";
import type { ActivityLog, ControlDevice } from "../../types";

interface BodyPart {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PainelControle() {
  const [devices, setDevices] = useState<ControlDevice[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [selectedSector, setSelectedSector] = useState("Setor A");

  // Body parts grid
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([
    { id: "1", name: "Capacete", icon: "🟥", enabled: true },
    { id: "2", name: "Luvas", icon: "🟥", enabled: true },
    { id: "3", name: "Óculos", icon: "🟥", enabled: true },
    { id: "4", name: "Pessoa", icon: "🟥", enabled: true },
    { id: "5", name: "Máscara", icon: "🟥", enabled: true },
    { id: "6", name: "Crachá", icon: "🟥", enabled: true },
    { id: "7", name: "Botas", icon: "🟥", enabled: true },
    { id: "8", name: "Coletes", icon: "🟥", enabled: true },
    { id: "9", name: "Roupa", icon: "🟥", enabled: false },
    { id: "10", name: "Proteções articulares", icon: "🟥", enabled: true },
    { id: "11", name: "Cinto S.", icon: "🟥", enabled: true },
    { id: "12", name: "Visitantes", icon: "🟥", enabled: true },
  ]);

  useEffect(() => {
    Promise.all([getDevices(), getActivityLogs()])
      .then(([fetchedDevices, fetchedLogs]) => {
        setDevices(fetchedDevices);
        setLogs(fetchedLogs);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleBodyPart = (id: string) => {
    setBodyParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a]">
      <div className="flex min-h-screen w-full">
        <Sidebar activePath="/painel" />

        <section className="flex-1 overflow-auto px-8 py-6">
          <header className="mb-6">
            <h1 className="[font-family:'Merriweather',Helvetica] text-3xl font-extrabold text-white">
              Painel de Controle
            </h1>
            <p className="mt-1 [font-family:'Merriweather',Helvetica] text-sm text-gray-400">
              O que detectar?
            </p>
          </header>

          {isLoading && (
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-2xl bg-gray-700" />
            </div>
          )}

          {error && !isLoading && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-3 gap-6">
              {/* Main control panel */}
              <div className="col-span-2 rounded-2xl border-4 border-[#8B4545] bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="[font-family:'Merriweather',Helvetica] text-lg font-bold text-[#8B4545]">
                    Painel de controle:
                  </h2>
                  <label className="flex items-center gap-2">
                    <span className="[font-family:'Merriweather',Helvetica] text-xs font-medium text-[#1a1a1a]">
                      Ativo:
                    </span>
                    <input
                      type="text"
                      value="ATIVO / 208.0 (NORTE)"
                      readOnly
                      className="rounded-full border-2 border-[#8B4545] bg-gray-50 px-3 py-1 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                    />
                  </label>
                </div>

                {/* Body parts grid */}
                <div className="grid grid-cols-4 gap-3">
                  {bodyParts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => toggleBodyPart(part.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors ${
                        part.enabled
                          ? "border-[#8B4545] bg-white"
                          : "border-gray-300 bg-gray-50 opacity-50"
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-[#8B4545] flex items-center justify-center text-lg">
                        {part.icon}
                      </div>
                      <span className="[font-family:'Merriweather',Helvetica] text-[10px] font-medium text-[#1a1a1a] text-center">
                        {part.name}
                      </span>
                      <div className="relative h-5 w-10">
                        <input
                          type="checkbox"
                          checked={part.enabled}
                          onChange={() => toggleBodyPart(part.id)}
                          className="h-5 w-10 appearance-none rounded-full bg-gray-300 checked:bg-[#8B4545] cursor-pointer transition-colors"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Support message */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#8B4545]" />
                    <span className="[font-family:'Merriweather',Helvetica] text-[9px] text-gray-600">
                      Suporte a uma de selecção por setores
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector modal / side panel */}
              <div className="rounded-2xl border-4 border-[#8B4545] bg-white p-6">
                <h2 className="mb-4 [font-family:'Merriweather',Helvetica] text-lg font-bold text-[#1a1a1a]">
                  Seleccionar setores:
                </h2>

                <label className="mb-4 flex items-center gap-2">
                  <span className="[font-family:'Merriweather',Helvetica] text-xs font-medium text-[#1a1a1a]">
                    Ativo:
                  </span>
                  <input
                    type="text"
                    value="ATIVO / 208.0 (NORTE)"
                    readOnly
                    className="rounded-full border-2 border-[#8B4545] bg-gray-50 px-3 py-1 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a] flex-1"
                  />
                </label>

                {/* Map placeholder */}
                <div className="flex h-48 items-center justify-center rounded-xl bg-blue-300 mb-4">
                  <span className="text-5xl text-blue-600 opacity-30">📷</span>
                </div>

                {/* Selector buttons */}
                <div className="space-y-2">
                  {["Setor A", "Setor B", "Setor C", "Setor D"].map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      className="w-full rounded-lg bg-[#2a3f5f] px-3 py-1.5 [font-family:'Merriweather',Helvetica] text-xs font-bold text-white transition-colors hover:bg-[#3a4f6f]"
                    >
                      {sector}
                    </button>
                  ))}
                </div>

                {/* Selection note */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#2a3f5f]" />
                  <span className="[font-family:'Merriweather',Helvetica] text-[9px] text-gray-600">
                    Suporte a uma de seleção per setores
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
