import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function AppLayout() {
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <div className="topbar surface-glass">
          <div className="topbar-brand">
            <img src="/logos/LOGO.jpeg" alt="DojoFlow logo" className="logo-mark logo-mark--sm" />
            <div>
              <div className="topbar-kicker">DojoFlow Active</div>
              <span className="topbar-date">{today}</span>
            </div>
          </div>
          <a href="/app/settings" className="topbar-link">
            Configuración del dojo
          </a>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
