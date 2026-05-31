/**
 * ============================================================
 * ENTRY POINT — Application bootstrap
 * ============================================================
 * This is the first file executed by the browser.
 * It mounts the root React component (<App>) into the #app
 * DOM element defined in index.html.
 *
 * StrictMode wraps the app in development to:
 *   - Detect unexpected side effects
 *   - Warn about deprecated API usage
 *   - Double-invoke lifecycle methods to surface bugs early
 *   (StrictMode is a no-op in production builds)
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// getElementById returns HTMLElement | null; the `as HTMLElement` cast is safe
// because index.html always contains <div id="app"></div>.
createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    {/* App contains AuthProvider, Router, and all Routes */}
    <App />
  </StrictMode>,
);
