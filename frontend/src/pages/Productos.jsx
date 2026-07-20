import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Crud.css";

const VACIO = { IdCategoria: "", Nombre: "", Descripcion: "", Precio: "", Stock: "" };

function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(valor || 0);
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);

  const cargar = async () => {
    setCargando(true);
    try {
      const [resProductos, resCategorias] = await Promise.all([
        api.get("/productos"),
        api.get("/categorias")
      ]);
      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudieron cargar los productos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ ...VACIO, IdCategoria: categorias[0]?.IdCategoria || "" });
    setModalAbierto(true);
  };

  const abrirEditar = (producto) => {
    setEditando(producto);
    setForm({
      IdCategoria: producto.IdCategoria,
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion || "",
      Precio: producto.Precio,
      Stock: producto.Stock
    });
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      IdCategoria: Number(form.IdCategoria),
      Precio: Number(form.Precio),
      Stock: Number(form.Stock)
    };
    try {
      if (editando) {
        await api.put(`/productos/${editando.IdProducto}`, payload);
      } else {
        await api.post("/productos", payload);
      }
      setModalAbierto(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar el producto");
    }
  };

  const eliminar = async (producto) => {
    if (!confirm(`¿Eliminar el producto "${producto.Nombre}"?`)) return;
    try {
      await api.delete(`/productos/${producto.IdProducto}`);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo eliminar el producto");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Productos</h1>
          <p>Carta y control de stock</p>
        </div>
        <button className="btn-primary" onClick={abrirNuevo} disabled={categorias.length === 0}>
          + Nuevo producto
        </button>
      </div>

      {error && <div className="mensaje-error">{error}</div>}
      {!cargando && categorias.length === 0 && (
        <div className="mensaje-error">Primero crea al menos una categoría para poder registrar productos.</div>
      )}

      <div className="card-tabla">
        {cargando ? (
          <p className="estado-vacio">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="estado-vacio">Aún no hay productos registrados.</p>
        ) : (
          <table className="tabla-simple">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.IdProducto}>
                  <td>{p.Nombre}</td>
                  <td>{p.Categoria}</td>
                  <td>{formatearMoneda(p.Precio)}</td>
                  <td>{p.Stock}</td>
                  <td>
                    <div className="acciones-fila">
                      <button className="btn-secondary" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="btn-danger" onClick={() => eliminar(p)}>Eliminar</button>
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
            <h3>{editando ? "Editar producto" : "Nuevo producto"}</h3>
            <form className="form-grid" onSubmit={guardar}>
              <label>
                Categoría
                <select
                  value={form.IdCategoria}
                  onChange={(e) => setForm({ ...form, IdCategoria: e.target.value })}
                  required
                >
                  {categorias.map((c) => (
                    <option key={c.IdCategoria} value={c.IdCategoria}>{c.Nombre}</option>
                  ))}
                </select>
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
                Descripción
                <textarea
                  rows={2}
                  value={form.Descripcion}
                  onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
                />
              </label>
              <label>
                Precio (S/)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.Precio}
                  onChange={(e) => setForm({ ...form, Precio: e.target.value })}
                  required
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  value={form.Stock}
                  onChange={(e) => setForm({ ...form, Stock: e.target.value })}
                  required
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
