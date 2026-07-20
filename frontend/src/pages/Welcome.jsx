import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Welcome.css";

export default function Welcome() {
  const { usuario } = useAuth();

  // Si ya hay una sesión activa, entra directo al sistema
  if (usuario) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-brand">
          <span>☕</span>
          <h1>Fabrizio Caffè</h1>
          <p>Sistema Web de Gestión de Ventas con Dashboard en Tiempo Real</p>
        </div>

        <div className="welcome-actions">
          <Link to="/login" className="btn-welcome btn-welcome-primary">Ingresar</Link>
          <Link to="/registro" className="btn-welcome btn-welcome-secondary">Registrarse</Link>
        </div>

        <p className="welcome-footer">Sector HORECA · 2026</p>
      </div>
    </div>
  );
}
