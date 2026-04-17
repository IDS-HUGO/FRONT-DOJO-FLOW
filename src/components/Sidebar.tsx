import { NavLink } from "react-router-dom";

const ownerLinks = [
 // ["/app", "Dashboard"],
  ["/app/students", "Alumnos"],
  ["/app/attendance", "Asistencias"],
  ["/app/payments", "Pagos"],
  ["/app/belts", "Grados"],
  ["/app/teachers", "Instructores"],
  ["/app/schedules", "Horarios"],
  ["/app/plans", "Planes"],
  ["/app/marketplace", "Marketplace"],
  ["/app/coupons", "Cupones"],
  //["/app/reports", "Reportes"],
  ["/app/settings", "Configuración"],
];

const teacherLinks = [
  ["/teacher", "Dashboard"],
  ["/teacher/attendance", "Asistencias"],
  ["/teacher/schedules", "Horarios"],
  ["/teacher/settings", "Configuración"],
];


export function Sidebar() {
  const accountType = localStorage.getItem("dojo_account_type");
  
  // ✅ Selecciona los links según el tipo de usuario
  const links = accountType === "teacher" ? teacherLinks : ownerLinks;
  
  // ✅ Selecciona el título y subtitle según el tipo de usuario
  const brandTitle = accountType === "teacher" ? "DojoFlow Instructor" : "DojoFlow";
  const brandSubtitle = accountType === "teacher" 
    ? "Panel de control para instructores"
    : "Gestión profesional para academias de artes marciales";
  const badgeText = accountType === "teacher" ? "Instructor" : "Dojo Owner";

  return (
    <aside className="sidebar">
      <div className="brand-wrap">
        <div className="brand">{brandTitle}</div>
        <p className="brand-subtitle">{brandSubtitle}</p>
        <span className="badge">{badgeText}</span>
      </div>
      {links.map(([to, label]) => (
        <NavLink 
          key={to} 
          to={to} 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          {label}
        </NavLink>
      ))}
    </aside>
  );
}