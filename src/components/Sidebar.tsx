/**
 * ============================================================
 * SIDEBAR COMPONENT — Shared navigation sidebar
 * ============================================================
 * This component renders the left-hand navigation present on
 * every authenticated screen. It receives the current active
 * route as a prop and highlights the matching menu item.
 *
 * Props:
 *   - activePath: the current page path (e.g., "/dashboard")
 *
 * Uses:
 *   - react-router-dom's <Link> for client-side navigation
 *   - useAuth() hook to access user info and logout function
 */

import { LogOut as LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── NAV ITEMS ───────────────────────────────────────────────
// Each entry maps a display label to a route path and icon asset.
// To add a new page: add an entry here and create the screen component.

const NAV_ITEMS = [
  { label: "Dashboard",         icon: "/vector-5.svg",  path: "/dashboard" },
  { label: "Painel de controle",icon: "/vector-8.svg",  path: "/painel" },
  { label: "Mapeamento",        icon: "/vector-7.svg",  path: "/mapeamento" },
  { label: "Inventário",        icon: "/vector-11.svg", path: "/inventario" },
];

// ─── COMPONENT ───────────────────────────────────────────────

interface SidebarProps {
  /** The current page path used to highlight the active nav item */
  activePath: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  // useAuth provides the logged-in user's name/role and the logout fn
  const { user, logout } = useAuth();

  // useNavigate allows programmatic navigation (redirect after logout)
  const navigate = useNavigate();

  /**
   * Handles the logout button click.
   * Calls the auth service, then redirects to /login.
   *
   * TODO: When the real API is connected, logoutService() will call
   *       POST /api/auth/logout to invalidate the JWT server-side.
   */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    // Fixed-width dark sidebar; shrink-0 prevents it from being squished
    <aside className="flex w-[132px] shrink-0 flex-col bg-[#132b4f] px-4 py-6 text-[#7292b4]">

      {/* ── User Profile ────────────────────────────────────── */}
      <div className="flex flex-col items-center">
        <img
          src="/vector-3.svg"
          alt="Ícone do usuário"
          className="mb-4 h-[72px] w-[72px]"
        />
        {/* Display the logged-in user's name (from AuthContext) */}
        <h2 className="text-center [font-family:'Merriweather',Helvetica] text-[18px] font-extrabold leading-none text-[#7292b4]">
          {user?.name ?? "Usuário"}
        </h2>
        {/* Display the user's role badge */}
        <p className="mt-1 text-center [font-family:'Merriweather',Helvetica] text-[11px] font-normal uppercase leading-none text-[#7292b4]">
          {user?.role ?? "USER"}
        </p>
      </div>

      {/* ── Navigation Links ────────────────────────────────── */}
      <nav className="mt-8 flex flex-1 flex-col">
        <ul className="space-y-5">
          {NAV_ITEMS.map((item) => {
            // Determine if this nav item is the currently active page
            const isActive = activePath === item.path;

            return (
              <li key={item.path}>
                {/* Link component handles client-side navigation
                    without a full page reload */}
                <Link
                  to={item.path}
                  className={`flex h-auto w-full items-center gap-2 text-left transition-opacity hover:opacity-90 ${
                    isActive
                      ? "opacity-100 [-webkit-text-stroke:0.6px_#7292b4]"
                      : "opacity-70"
                  }`}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="h-[18px] w-[18px] shrink-0"
                  />
                  <span className="[font-family:'Merriweather',Helvetica] text-[11px] font-normal leading-none text-[#7292b4]">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Bottom Actions ──────────────────────────────────── */}
        <div className="mt-auto space-y-5 pb-2">
          {/* Settings link — highlighted as active when on /configuracoes */}
          <Link
            to="/configuracoes"
            className={`flex h-auto w-full items-center gap-2 text-left ${
              activePath === "/configuracoes"
                ? "opacity-100 [-webkit-text-stroke:0.6px_#7292b4]"
                : "opacity-70"
            }`}
          >
            <img
              src="/vector-12.svg"
              alt=""
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="[font-family:'Merriweather',Helvetica] text-[11px] font-bold leading-none text-[#7292b4]">
              Configurações
            </span>
          </Link>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-auto w-full items-center gap-2 text-left text-[#7292b4] opacity-70 transition-opacity hover:opacity-100"
          >
            <LogOutIcon className="h-[16px] w-[16px] shrink-0" strokeWidth={1.7} />
            <span className="[font-family:'Merriweather',Helvetica] text-[11px] font-normal leading-none">
              Sair
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
