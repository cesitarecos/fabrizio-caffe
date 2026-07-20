import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

const VACIO = { Nombre: "", Apellido: "", Correo: "", Password: "", Telefono: "", IdRol: 1 };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await api.post("/usuarios/registro", { ...form, IdRol: Number(form.IdRol) });
      navigate("/login", { state: { registrado: true } });
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo registrar el usuario");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span>☕</span>
          <h1>Fabrizio Caffè</h1>
          <p>Crear cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Nombre
            <input
              value={form.Nombre}
              onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
              required
            />
          </label>

          <label>
            Apellido
            <input
              value={form.Apellido}
              onChange={(e) => setForm({ ...form, Apellido: e.target.value })}
              required
            />
          </label>

          <label>
            Correo
            <input
              type="email"
              value={form.Correo}
              onChange={(e) => setForm({ ...form, Correo: e.target.value })}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={form.Password}
              onChange={(e) => setForm({ ...form, Password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </label>

          <label>
            Teléfono (opcional)
            <input
              value={form.Telefono}
              onChange={(e) => setForm({ ...form, Telefono: e.target.value })}
            />
          </label>

          <label>
            Rol
            <select
              value={form.IdRol}
              onChange={(e) => setForm({ ...form, IdRol: e.target.value })}
            >
              <option value={1}>Administrador</option>
              <option value={2}>Cajero</option>
            </select>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="login-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
