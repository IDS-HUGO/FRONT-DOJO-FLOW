import { NavLink } from "react-router-dom";

const links = [
  ["/app", "Dashboard"],
  ["/app/students", "Alumnos"],
  ["/app/attendance", "Asistencias"],
  ["/app/payments", "Pagos"],
  ["/app/belts", "Grados"],
  ["/app/teachers", "Instructores"],
  ["/app/schedules", "Horarios"],
  ["/app/plans", "Planes"],
  ["/app/marketplace", "Marketplace"],
  ["/app/coupons", "Cupones"],
  ["/app/reports", "Reportes"],
  ["/app/settings", "Configuración"],
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-wrap">
        <div className="brand">DojoFlow</div>
        <p className="brand-subtitle">Gestión profesional para academias de artes marciales</p>
        <span className="badge">Plan Maestro</span>
      </div>
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
