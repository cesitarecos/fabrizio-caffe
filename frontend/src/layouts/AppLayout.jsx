import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AppLayout.css";

export default function AppLayout() {
  const { usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">☕</span>
          <div>
            <strong>Fabrizio Caffè</strong>
            <p>Gestión de Ventas</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/app" end>Dashboard</NavLink>
          <NavLink to="/app/ventas">Ventas</NavLink>
          <NavLink to="/app/productos">Productos</NavLink>
          <NavLink to="/app/categorias">Categorías</NavLink>
          <NavLink to="/app/clientes">Clientes</NavLink>
          {esAdmin && <NavLink to="/app/usuarios">Usuarios</NavLink>}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{usuario?.Nombre?.[0]?.toUpperCase()}</div>
            <div>
              <strong>{usuario?.Nombre} {usuario?.Apellido}</strong>
              <p>{esAdmin ? "Administrador" : "Cajero"}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
