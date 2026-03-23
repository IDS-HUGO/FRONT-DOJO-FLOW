import { NavLink } from "react-router-dom";

const links = [
  ["/", "Dashboard"],
  ["/students", "Alumnos"],
  ["/attendance", "Asistencias"],
  ["/payments", "Pagos"],
  ["/belts", "Grados"],
  ["/teachers", "Instructores"],
  ["/schedules", "Horarios"],
  ["/plans", "Planes"],
  ["/marketplace", "Marketplace"],
  ["/coupons", "Cupones"],
  ["/reports", "Reportes"],
  ["/settings", "Configuración"],
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
