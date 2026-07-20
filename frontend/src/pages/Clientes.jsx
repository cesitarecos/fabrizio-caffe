import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Crud.css";

const VACIO = { DNI: "", Nombre: "", Apellido: "", Telefono: "", Correo: "", Direccion: "" };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);

  const cargar = async () => {
    setCargando(true);
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudieron cargar los clientes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (cliente) => {
    setEditando(cliente);
    setForm({
      DNI: cliente.DNI || "",
      Nombre: cliente.Nombre,
      Apellido: cliente.Apellido || "",
      Telefono: cliente.Telefono || "",
      Correo: cliente.Correo || "",
      Direccion: cliente.Direccion || ""
    });
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/clientes/${editando.IdCliente}`, form);
      } else {
        await api.post("/clientes", form);
      }
      setModalAbierto(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar el cliente");
    }
  };

  const eliminar = async (cliente) => {
    if (!confirm(`¿Eliminar al cliente "${cliente.Nombre}"?`)) return;
    try {
      await api.delete(`/clientes/${cliente.IdCliente}`);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo eliminar el cliente");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p>Base de clientes registrados</p>
        </div>
        <button className="btn-primary" onClick={abrirNuevo}>+ Nuevo cliente</button>
      </div>

      {error && <div className="mensaje-error">{error}</div>}

      <div className="card-tabla">
        {cargando ? (
          <p className="estado-vacio">Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <p className="estado-vacio">Aún no hay clientes registrados.</p>
        ) : (
          <table className="tabla-simple">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.IdCliente}>
                  <td>{c.DNI || "—"}</td>
                  <td>{c.Nombre} {c.Apellido}</td>
                  <td>{c.Telefono || "—"}</td>
                  <td>{c.Correo || "—"}</td>
                  <td>
                    <div className="acciones-fila">
                      <button className="btn-secondary" onClick={() => abrirEditar(c)}>Editar</button>
                      <button className="btn-danger" onClick={() => eliminar(c)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editando ? "Editar cliente" : "Nuevo cliente"}</h3>
            <form className="form-grid" onSubmit={guardar}>
              <label>
                DNI
                <input
                  maxLength={8}
                  value={form.DNI}
                  onChange={(e) => setForm({ ...form, DNI: e.target.value })}
                />
              </label>
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
                />
              </label>
              <label>
                Teléfono
                <input
                  value={form.Telefono}
                  onChange={(e) => setForm({ ...form, Telefono: e.target.value })}
                />
              </label>
              <label>
                Correo
                <input
                  type="email"
                  value={form.Correo}
                  onChange={(e) => setForm({ ...form, Correo: e.target.value })}
                />
              </label>
              <label>
                Dirección
                <input
                  value={form.Direccion}
                  onChange={(e) => setForm({ ...form, Direccion: e.target.value })}
                />
              </label>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
