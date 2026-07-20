import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Crud.css";

const VACIO = { Nombre: "", Descripcion: "" };

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);

  const cargar = async () => {
    setCargando(true);
    try {
      const { data } = await api.get("/categorias");
      setCategorias(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudieron cargar las categorías");
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

  const abrirEditar = (categoria) => {
    setEditando(categoria);
    setForm({ Nombre: categoria.Nombre, Descripcion: categoria.Descripcion || "" });
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/categorias/${editando.IdCategoria}`, form);
      } else {
        await api.post("/categorias", form);
      }
      setModalAbierto(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar la categoría");
    }
  };

  const eliminar = async (categoria) => {
    if (!confirm(`¿Eliminar la categoría "${categoria.Nombre}"?`)) return;
    try {
      await api.delete(`/categorias/${categoria.IdCategoria}`);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo eliminar la categoría");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categorías</h1>
          <p>Organiza los productos de tu carta</p>
        </div>
        <button className="btn-primary" onClick={abrirNuevo}>+ Nueva categoría</button>
      </div>

      {error && <div className="mensaje-error">{error}</div>}

      <div className="card-tabla">
        {cargando ? (
          <p className="estado-vacio">Cargando categorías...</p>
        ) : categorias.length === 0 ? (
          <p className="estado-vacio">Aún no hay categorías registradas.</p>
        ) : (
          <table className="tabla-simple">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.IdCategoria}>
                  <td>{c.Nombre}</td>
                  <td>{c.Descripcion || "—"}</td>
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
            <h3>{editando ? "Editar categoría" : "Nueva categoría"}</h3>
            <form className="form-grid" onSubmit={guardar}>
              <label>
                Nombre
                <input
                  value={form.Nombre}
                  onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                  required
                />
              </label>
              <label>
                Descripción
                <textarea
                  rows={3}
                  value={form.Descripcion}
                  onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
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
