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
        <div className="topbar">
          <span className="topbar-date">{today}</span>
          <a href="/app/settings" className="topbar-link">
            Configuración del dojo
          </a>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
