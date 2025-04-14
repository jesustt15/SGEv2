import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Alternar entre expandido y colapsado
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  // Definición de las rutas principales
  const menuItems = [
    { label: "Inicio", to: "/", icon: "pi pi-objects-column" },
    { label: "Matriculas", to: "/estudiantes", icon: "pi pi-book" },
    { label: "Personal", to: "/personals", icon: "pi pi-users" },
    { label: "Calendario de Actividades", to: "/calendar", icon: "pi pi-calendar" },
    { label: "Secciones", to: "/secciones", icon: "pi pi-users" },
  ];

  // Enlaces en la parte inferior
  const bottomItems = [
    { label: "Gestión de Usuarios", to: "/usuarios", icon: "pi pi-cog" },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
      {/* Botón de toggle */}
      <div className="sidebar-toggle-area" onClick={toggleSidebar}>
        <i className={`toggle-icon ${collapsed ? "pi pi-angle-right" : "pi pi-angle-left"}`}></i>
      </div>

      {/* Área principal de enlaces */}
      <nav className="menu-content" onClick={(e) => e.stopPropagation()}>
        <ul>
          {menuItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className={item.icon}></i>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer fijo */}
      <div className="sidebar-footer" onClick={(e) => e.stopPropagation()}>
        <ul>
          {bottomItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className={item.icon}></i>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};



