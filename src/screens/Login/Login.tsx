/**
 * ============================================================
 * LOGIN SCREEN
 * ============================================================
 * Provides a form for users to authenticate with email + password.
 *
 * States managed here:
 *   - email / password: controlled form field values
 *   - error: string shown when the API returns a failure
 *   - isLoading: disables the button and shows feedback during the
 *     API call (important for both mock and real requests)
 *
 * On success: redirects to /dashboard via react-router-dom.
 *
 * The actual API call is delegated to AuthContext.login(), which
 * in turn calls authService.login(). Screens never call services
 * directly — they always go through the context layer.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Login() {
  // ── Form field state ────────────────────────────────────────
  // useState creates a reactive variable; setting it re-renders the component.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── UI feedback state ───────────────────────────────────────
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Hooks ───────────────────────────────────────────────────
  const { login } = useAuth();       // auth functions from AuthContext
  const navigate = useNavigate();    // programmatic navigation

  // ── Form submission handler ─────────────────────────────────
  /**
   * Calls the auth service, navigates on success, sets error on failure.
   *
   * NOTE: The `async` handler works with the mock delay in authService
   * and will work identically once the real Python API is connected.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();   // prevent the default browser form POST
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      // Redirect to dashboard after successful authentication
      navigate("/dashboard");
    } catch (err) {
      // Display the error message returned by the auth service
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      // Always re-enable the form, whether success or failure
      setIsLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    // Full-screen centered layout with the brand's dark blue background
    <main className="flex min-h-screen items-center justify-center bg-[#132b4f] px-4">
      <div className="w-full max-w-[420px]">

        {/* ── Logo / Brand block ─────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/vector-3.svg"
            alt="Persona"
            className="mb-4 h-20 w-20"
          />
          <h1 className="[font-family:'Merriweather',Helvetica] text-3xl font-extrabold text-white">
            Persona
          </h1>
          <p className="mt-1 [font-family:'Merriweather',Helvetica] text-sm text-[#7292b4]">
            Sistema de Gestão e Monitoramento
          </p>
        </div>

        {/* ── Login card ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#1e3f6e] bg-[#0f2240] p-8 shadow-xl">
          <h2 className="mb-6 [font-family:'Merriweather',Helvetica] text-xl font-bold text-white">
            Entrar
          </h2>

          {/* Error banner — only rendered when error state is non-null */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="[font-family:'Merriweather',Helvetica] text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Email field ──────────────────────────────────── */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block [font-family:'Merriweather',Helvetica] text-sm font-medium text-[#9ab2cc]"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                // onChange keeps the state in sync with the typed value
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@persona.com"
                className="w-full rounded-xl border border-[#284d79] bg-[#132b4f] px-4 py-3 [font-family:'Merriweather',Helvetica] text-sm text-white placeholder:text-[#3d5a78] focus:border-[#4a7bb5] focus:outline-none"
              />
            </div>

            {/* ── Password field ───────────────────────────────── */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block [font-family:'Merriweather',Helvetica] text-sm font-medium text-[#9ab2cc]"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#284d79] bg-[#132b4f] px-4 py-3 [font-family:'Merriweather',Helvetica] text-sm text-white placeholder:text-[#3d5a78] focus:border-[#4a7bb5] focus:outline-none"
              />
            </div>

            {/* ── Submit button ────────────────────────────────── */}
            {/* disabled during loading to prevent double-submission */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#173865] py-3 [font-family:'Merriweather',Helvetica] text-sm font-bold text-white transition-colors hover:bg-[#1e4a80] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* ── Register link ──────────────────────────────────── */}
          <p className="mt-6 text-center [font-family:'Merriweather',Helvetica] text-sm text-[#7292b4]">
            Não tem uma conta?{" "}
            <Link
              to="/registro"
              className="font-bold text-[#9ab2cc] underline-offset-2 hover:underline"
            >
              Criar conta
            </Link>
          </p>

          {/* ── Demo hint ──────────────────────────────────────── */}
          <p className="mt-3 text-center [font-family:'Merriweather',Helvetica] text-xs text-[#3d5a78]">
            Demo: admin@persona.com / qualquer senha (6+ chars)
          </p>
        </div>
      </div>
    </main>
  );
}
