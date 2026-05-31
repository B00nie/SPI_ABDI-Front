/**
 * ============================================================
 * REGISTRO (REGISTER) SCREEN
 * ============================================================
 * Allows new users to create an account with name, email, and
 * password. On success the user is immediately logged in and
 * redirected to the Dashboard.
 *
 * Pattern is identical to Login:
 *   State → form submit → call service via context → navigate
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Registro() {
  // ── Form state ──────────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── UI feedback state ───────────────────────────────────────
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Hooks ───────────────────────────────────────────────────
  const { register } = useAuth();
  const navigate = useNavigate();

  // ── Form submission handler ─────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation: check passwords match before hitting API
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      // register() calls authService.register() under the hood
      // TODO: authService.register() will POST to /api/auth/register
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#132b4f] px-4">
      <div className="w-full max-w-[420px]">

        {/* ── Brand header ───────────────────────────────────── */}
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
            Criar nova conta
          </p>
        </div>

        {/* ── Registration card ──────────────────────────────── */}
        <div className="rounded-2xl border border-[#1e3f6e] bg-[#0f2240] p-8 shadow-xl">
          <h2 className="mb-6 [font-family:'Merriweather',Helvetica] text-xl font-bold text-white">
            Criar Conta
          </h2>

          {/* Error message banner */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="[font-family:'Merriweather',Helvetica] text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block [font-family:'Merriweather',Helvetica] text-sm font-medium text-[#9ab2cc]"
              >
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-[#284d79] bg-[#132b4f] px-4 py-3 [font-family:'Merriweather',Helvetica] text-sm text-white placeholder:text-[#3d5a78] focus:border-[#4a7bb5] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="mb-1.5 block [font-family:'Merriweather',Helvetica] text-sm font-medium text-[#9ab2cc]"
              >
                E-mail
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-[#284d79] bg-[#132b4f] px-4 py-3 [font-family:'Merriweather',Helvetica] text-sm text-white placeholder:text-[#3d5a78] focus:border-[#4a7bb5] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="mb-1.5 block [font-family:'Merriweather',Helvetica] text-sm font-medium text-[#9ab2cc]"
              >
                Senha
              </label>
              <input
                id="reg-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-[#284d79] bg-[#132b4f] px-4 py-3 [font-family:'Merriweather',Helvetica] text-sm text-white placeholder:text-[#3d5a78] focus:border-[#4a7bb5] focus:outline-none"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block [font-family:'Merriweather',Helvetica] text-sm font-medium text-[#9ab2cc]"
              >
                Confirmar senha
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita sua senha"
                className="w-full rounded-xl border border-[#284d79] bg-[#132b4f] px-4 py-3 [font-family:'Merriweather',Helvetica] text-sm text-white placeholder:text-[#3d5a78] focus:border-[#4a7bb5] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#173865] py-3 [font-family:'Merriweather',Helvetica] text-sm font-bold text-white transition-colors hover:bg-[#1e4a80] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          {/* Back to login link */}
          <p className="mt-6 text-center [font-family:'Merriweather',Helvetica] text-sm text-[#7292b4]">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-bold text-[#9ab2cc] underline-offset-2 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
