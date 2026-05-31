/**
 * ============================================================
 * CONFIGURAÇÕES (SETTINGS) SCREEN
 * ============================================================
 * Allows the user to manage notification preferences, language,
 * timezone, day count, and the auto-save toggle.
 *
 * States managed here:
 *   - settings: the full UserSettings object loaded from the API
 *   - isLoading: true while the initial settings are being fetched
 *   - isSaving: true while a save request is in flight
 *   - error / successMessage: feedback after a save attempt
 *
 * Data flow:
 *   1. Component mounts → useEffect fetches settings via settingsService
 *   2. User changes a value → local state updated immediately (optimistic)
 *   3. User clicks "Salvar" → saveSettings() called → feedback shown
 *
 * TODO: settingsService functions will call the Python API:
 *   GET   /api/settings/:userId
 *   PATCH /api/settings/:userId
 */

import { Bell as BellIcon, Globe as GlobeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAuth } from "../../context/AuthContext";
import { getSettings, saveSettings } from "../../services/settingsService";
import type { UserSettings } from "../../types";

// ─── STATIC DATA ─────────────────────────────────────────────
// Notification channel definitions. In a future version, these
// could also come from the API so admins can add new channels.
const NOTIFICATION_ITEMS = [
  {
    id: "eventos",
    title: "Notificações de Eventos",
    description: "Receba notificação sobre eventos importantes",
  },
  {
    id: "email",
    title: "Notificações por Email",
    description: "Receba atualizações importantes por email",
  },
  {
    id: "push",
    title: "Notificações Push",
    description: "Receba notificações no navegador",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────

export const Configurao = (): JSX.Element => {
  // ── Auth ────────────────────────────────────────────────────
  // We need the user's ID to fetch their specific settings from the API
  const { user } = useAuth();

  // ── Settings state ───────────────────────────────────────────
  // Holds the full settings object; initialized to null until loaded.
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // ── UI feedback state ────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // successMessage: shown briefly after a successful save
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ── Fetch settings on mount ──────────────────────────────────
  /**
   * useEffect fetches the user's settings when the component first
   * renders. The dependency array [user?.id] means this also re-runs
   * if the logged-in user changes (e.g., admin switching accounts).
   *
   * TODO: getSettings() will call GET /api/settings/:userId
   *       Python API: SELECT * FROM user_settings WHERE user_id = :userId
   */
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    getSettings(user.id)
      .then(setSettings)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar configurações.");
      })
      .finally(() => setIsLoading(false));
  }, [user?.id]); // only re-run if the user ID changes

  // ── Notification toggle handler ──────────────────────────────
  /**
   * Updates a single notification channel in local state.
   * The change is saved to the server only when "Salvar" is clicked.
   * (Contrast with an auto-save approach where you'd call the API here.)
   */
  const handleNotificationChange = (channelId: string, checked: boolean) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notifications: { ...prev.notifications, [channelId]: checked },
      };
    });
  };

  // ── Generic settings field updater ──────────────────────────
  /**
   * Generic updater for top-level settings fields.
   * TypeScript's keyof UserSettings ensures only valid fields are passed.
   *
   * @param field - e.g., "language", "timezone", "dayCount", "autoSave"
   * @param value - new value for that field
   */
  const handleFieldChange = <K extends keyof UserSettings>(
    field: K,
    value: UserSettings[K]
  ) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // ── Save handler ─────────────────────────────────────────────
  /**
   * Sends the current settings object to the API.
   * Shows a success message for 3 seconds after saving.
   *
   * TODO: saveSettings() will call PATCH /api/settings/:userId
   *       Python API: UPDATE user_settings SET ... WHERE user_id = :userId
   */
  const handleSave = async () => {
    if (!user || !settings) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await saveSettings(user.id, settings);

      // Show a success message, then auto-hide after 3 seconds
      setSuccessMessage("Configurações salvas com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <main className="min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full">

        {/* ── Sidebar ────────────────────────────────────────── */}
        <Sidebar activePath="/configuracoes" />

        {/* ── Main content ───────────────────────────────────── */}
        <section className="flex-1 px-12 py-4">
          <header className="mb-2">
            <h1 className="[font-family:'Merriweather',Helvetica] text-[28px] font-extrabold leading-none text-[#630d1b] md:text-[36px]">
              Configurações
            </h1>
          </header>

          {/* ── Loading skeleton ─────────────────────────────── */}
          {isLoading && (
            <div className="mx-auto mt-4 w-full max-w-[1100px] space-y-4">
              <div className="h-40 animate-pulse rounded-[26px] bg-gray-100" />
              <div className="h-48 animate-pulse rounded-[26px] bg-gray-100" />
            </div>
          )}

          {/* ── Feedback banners ─────────────────────────────── */}
          {error && (
            <div className="mx-auto mt-4 max-w-[1100px] rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mx-auto mt-4 max-w-[1100px] rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="[font-family:'Merriweather',Helvetica] text-sm text-green-700">
                {successMessage}
              </p>
            </div>
          )}

          {/* ── Settings cards (only shown when data is loaded) ── */}
          {!isLoading && settings && (
            <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 pt-2">

              {/* ══ Card 1: Notification Settings ════════════════ */}
              <Card className="rounded-[26px] border-[1.5px] border-[#284d79] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
                <CardContent className="p-4 md:p-5">
                  {/* Card header */}
                  <div className="mb-3 flex items-center gap-2">
                    <BellIcon className="h-6 w-6 text-[#173865]" strokeWidth={1.8} />
                    <h2 className="[font-family:'Merriweather',Helvetica] text-[24px] font-medium leading-none text-[#173865]">
                      Configurações de Notificações
                    </h2>
                  </div>

                  {/* Notification toggles — one row per channel */}
                  <div className="space-y-3">
                    {NOTIFICATION_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1fr_auto] items-center gap-4"
                      >
                        <div>
                          <h3 className="[font-family:'Merriweather',Helvetica] text-[18px] font-medium leading-none text-[#173865]">
                            {item.title}
                          </h3>
                          <p className="mt-1 [font-family:'Merriweather',Helvetica] text-[13px] font-medium leading-none text-black">
                            {item.description}
                          </p>
                        </div>
                        {/*
                          Checkbox component from shadcn/ui (Radix UI).
                          checked: reads from settings.notifications[id]
                          onCheckedChange: calls our local handler which
                            updates the settings state object.
                        */}
                        <Checkbox
                          checked={settings.notifications[item.id] ?? false}
                          onCheckedChange={(checked) =>
                            handleNotificationChange(item.id, checked === true)
                          }
                          className="h-[18px] w-[18px] rounded-none border-[#6f8fb2] data-[state=checked]:border-[#3f6691] data-[state=checked]:bg-white data-[state=checked]:text-[#3f6691]"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ══ Card 2: Language & Timezone ══════════════════ */}
              <Card className="rounded-[26px] border-[1.5px] border-[#284d79] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
                <CardContent className="p-4 md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <GlobeIcon className="h-6 w-6 text-[#173865]" strokeWidth={1.8} />
                    <h2 className="[font-family:'Merriweather',Helvetica] text-[24px] font-medium leading-none text-[#173865]">
                      Idioma &amp; Fuso Horário
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                    {/* Language select */}
                    <div>
                      <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-[18px] font-medium leading-none text-[#173865]">
                        Idioma
                      </label>
                      {/*
                        Select is a controlled component — value is read from
                        settings.language and updates it via handleFieldChange.
                        TODO: Options should come from GET /api/config/languages
                      */}
                      <Select
                        value={settings.language}
                        onValueChange={(v) => handleFieldChange("language", v)}
                      >
                        <SelectTrigger className="h-[31px] rounded-full border-[#9ab2cc] px-4 [font-family:'Merriweather',Helvetica] text-[18px] font-medium text-[#4a4e56]">
                          <SelectValue placeholder="Português (Brasil)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                          <SelectItem value="en-us">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Timezone select */}
                    <div>
                      <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-[18px] font-medium leading-none text-[#173865]">
                        Fuso horário
                      </label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(v) => handleFieldChange("timezone", v)}
                      >
                        <SelectTrigger className="h-[31px] rounded-full border-[#9ab2cc] px-4 [font-family:'Merriweather',Helvetica] text-[18px] font-medium text-[#4a4e56]">
                          <SelectValue placeholder="Brasília (GMT-3)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brasilia">Brasília (GMT-3)</SelectItem>
                          <SelectItem value="manaus">Manaus (GMT-4)</SelectItem>
                          <SelectItem value="fernando_de_noronha">Fernando de Noronha (GMT-2)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Day count input */}
                    <div>
                      <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-[18px] font-medium leading-none text-[#173865]">
                        Contagem de dias
                      </label>
                      <div className="relative">
                        {/*
                          Controlled number input.
                          value: read from settings.dayCount
                          onChange: updates settings.dayCount via handleFieldChange
                        */}
                        <Input
                          type="number"
                          value={settings.dayCount}
                          onChange={(e) =>
                            handleFieldChange("dayCount", Number(e.target.value))
                          }
                          className="h-[31px] rounded-full border-[#9ab2cc] px-4 [font-family:'Merriweather',Helvetica] text-[18px] font-medium text-[#4a4e56]"
                        />
                        <img
                          src="/vector.svg"
                          alt=""
                          className="pointer-events-none absolute right-4 top-1/2 h-[10px] w-[10px] -translate-y-1/2"
                        />
                      </div>
                    </div>

                    {/* Auto-save toggle */}
                    <div className="flex items-end">
                      <label className="flex cursor-pointer items-center gap-2 pb-2">
                        <Checkbox
                          checked={settings.autoSave}
                          onCheckedChange={(checked) =>
                            handleFieldChange("autoSave", checked === true)
                          }
                          className="h-[18px] w-[18px] rounded-none border-[#6f8fb2] data-[state=checked]:border-[#3f6691] data-[state=checked]:bg-white data-[state=checked]:text-[#3f6691]"
                        />
                        <span className="[font-family:'Merriweather',Helvetica] text-[18px] font-medium leading-none text-[#173865]">
                          Salvamento automático
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── Save button ─────────────────────────────────── */}
              {/* Placed below the cards to save all settings at once */}
              <div className="flex justify-end pb-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-[#173865] px-8 py-3 [font-family:'Merriweather',Helvetica] text-sm font-bold text-white transition-colors hover:bg-[#1e4a80] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Salvando..." : "Salvar Configurações"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
