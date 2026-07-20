import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Crud.css";

const VACIO = { Nombre: "", Apellido: "", Correo: "", Password: "", Telefono: "", IdRol: 2 };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(VACIO);

  const cargar = async () => {
    setCargando(true);
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setForm(VACIO);
    setMensaje("");
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api.post("/usuarios/registro", { ...form, IdRol: Number(form.IdRol) });
      setModalAbierto(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo registrar el usuario");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Cuentas del sistema (Administradores y Cajeros)</p>
        </div>
        <button className="btn-primary" onClick={abrirNuevo}>+ Nuevo usuario</button>
      </div>

      {error && <div className="mensaje-error">{error}</div>}

      <div className="card-tabla">
        {cargando ? (
          <p className="estado-vacio">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="estado-vacio">Aún no hay usuarios registrados.</p>
        ) : (
          <table className="tabla-simple">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.IdUsuario}>
                  <td>{u.Nombre} {u.Apellido}</td>
                  <td>{u.Correo}</td>
                  <td>{u.IdRol === 1 ? "Administrador" : "Cajero"}</td>
                  <td>{u.Estado ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Nuevo usuario</h3>
            {mensaje && <p className="mensaje-error" style={{ background: "#E7F0EC", color: "var(--teal-500)" }}>{mensaje}</p>}
            <form className="form-grid" onSubmit={guardar}>
              <label>
                Nombre
                <input value={form.Nombre} onChange={(e) => setForm({ ...form, Nombre: e.target.value })} required />
              </label>
              <label>
                Apellido
                <input value={form.Apellido} onChange={(e) => setForm({ ...form, Apellido: e.target.value })} required />
              </label>
              <label>
                Correo
                <input type="email" value={form.Correo} onChange={(e) => setForm({ ...form, Correo: e.target.value })} required />
              </label>
              <label>
                Contraseña
                <input type="password" value={form.Password} onChange={(e) => setForm({ ...form, Password: e.target.value })} required />
              </label>
              <label>
                Teléfono
                <input value={form.Telefono} onChange={(e) => setForm({ ...form, Telefono: e.target.value })} />
              </label>
              <label>
                Rol
                <select value={form.IdRol} onChange={(e) => setForm({ ...form, IdRol: e.target.value })}>
                  <option value={1}>Administrador</option>
                  <option value={2}>Cajero</option>
                </select>
              </label>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
