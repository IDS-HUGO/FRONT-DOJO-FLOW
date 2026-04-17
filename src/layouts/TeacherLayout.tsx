import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function TeacherLayout() {
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
              <div className="topbar-kicker">DojoFlow - Instructor</div>
              <span className="topbar-date">{today}</span>
            </div>
          </div>
          <a href="/teacher/settings" className="topbar-link">
            Mi Configuración
          </a>
        </div>
        <Outlet />
      </main>
    </div>
  );
}