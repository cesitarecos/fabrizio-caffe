import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./Crud.css";
import "./Ventas.css";

function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(valor || 0);
}

export default function Ventas() {
  const [vista, setVista] = useState("nueva"); // "nueva" | "historial"

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrito, setCarrito] = useState([]); // [{IdProducto, Nombre, Precio, Cantidad}]
  const [idCliente, setIdCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [registrando, setRegistrando] = useState(false);

  const [ventas, setVentas] = useState([]);
  const [cargandoVentas, setCargandoVentas] = useState(false);

  const cargarCatalogo = async () => {
    try {
      const [resProductos, resClientes] = await Promise.all([
        api.get("/productos"),
        api.get("/clientes")
      ]);
      setProductos(resProductos.data);
      setClientes(resClientes.data);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo cargar el catálogo");
    }
  };

  const cargarVentas = async () => {
    setCargandoVentas(true);
    try {
      const { data } = await api.get("/ventas?limite=50");
      setVentas(data);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudieron cargar las ventas");
    } finally {
      setCargandoVentas(false);
    }
  };

  useEffect(() => {
    cargarCatalogo();
  }, []);

  useEffect(() => {
    if (vista === "historial") cargarVentas();
  }, [vista]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((i) => i.IdProducto === producto.IdProducto);
      if (existente) {
        return prev.map((i) =>
          i.IdProducto === producto.IdProducto ? { ...i, Cantidad: i.Cantidad + 1 } : i
        );
      }
      return [...prev, { IdProducto: producto.IdProducto, Nombre: producto.Nombre, Precio: producto.Precio, Cantidad: 1 }];
    });
  };

  const cambiarCantidad = (idProducto, cantidad) => {
    if (cantidad <= 0) {
      setCarrito((prev) => prev.filter((i) => i.IdProducto !== idProducto));
      return;
    }
    setCarrito((prev) =>
      prev.map((i) => (i.IdProducto === idProducto ? { ...i, Cantidad: cantidad } : i))
    );
  };

  const quitarDelCarrito = (idProducto) => {
    setCarrito((prev) => prev.filter((i) => i.IdProducto !== idProducto));
  };

  const total = useMemo(
    () => carrito.reduce((acc, i) => acc + i.Precio * i.Cantidad, 0),
    [carrito]
  );

  const registrarVenta = async () => {
    setError("");
    setMensaje("");
    if (carrito.length === 0) {
      setError("Agrega al menos un producto al carrito");
      return;
    }
    setRegistrando(true);
    try {
      const payload = {
        IdCliente: idCliente ? Number(idCliente) : null,
        MetodoPago: metodoPago,
        items: carrito.map((i) => ({
          IdProducto: i.IdProducto,
          Cantidad: i.Cantidad,
          Precio: i.Precio
        }))
      };
      const { data } = await api.post("/ventas", payload);
      setMensaje(`Venta #${data.IdVenta} registrada por ${formatearMoneda(data.Total)}`);
      setCarrito([]);
      setIdCliente("");
      cargarCatalogo(); // refresca stock
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo registrar la venta");
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ventas</h1>
          <p>Registra ventas y consulta el historial</p>
        </div>
        <div className="tabs">
          <button
            className={vista === "nueva" ? "tab-active" : "tab"}
            onClick={() => setVista("nueva")}
          >
            Nueva venta
          </button>
          <button
            className={vista === "historial" ? "tab-active" : "tab"}
            onClick={() => setVista("historial")}
          >
            Historial
          </button>
        </div>
      </div>

      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-error" style={{ background: "#E7F0EC", color: "var(--teal-500)" }}>{mensaje}</div>}

      {vista === "nueva" ? (
        <div className="pos-grid">
          <div className="card-tabla pos-productos">
            <h3>Catálogo</h3>
            <div className="pos-catalogo">
              {productos.map((p) => (
                <button key={p.IdProducto} className="pos-item" onClick={() => agregarAlCarrito(p)} disabled={p.Stock <= 0}>
                  <strong>{p.Nombre}</strong>
                  <span>{formatearMoneda(p.Precio)}</span>
                  <small>{p.Stock > 0 ? `Stock: ${p.Stock}` : "Sin stock"}</small>
                </button>
              ))}
              {productos.length === 0 && <p className="estado-vacio">No hay productos disponibles.</p>}
            </div>
          </div>

          <div className="card-tabla pos-carrito">
            <h3>Carrito</h3>

            <label className="pos-label">
              Cliente (opcional)
              <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
                <option value="">Cliente no registrado</option>
                {clientes.map((c) => (
                  <option key={c.IdCliente} value={c.IdCliente}>{c.Nombre} {c.Apellido}</option>
                ))}
              </select>
            </label>

            <label className="pos-label">
              Método de pago
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Yape/Plin</option>
              </select>
            </label>

            <div className="pos-lista-carrito">
              {carrito.length === 0 && <p className="estado-vacio">Agrega productos del catálogo</p>}
              {carrito.map((i) => (
                <div key={i.IdProducto} className="pos-fila-carrito">
                  <div>
                    <strong>{i.Nombre}</strong>
                    <small>{formatearMoneda(i.Precio)} c/u</small>
                  </div>
                  <div className="pos-cantidad">
                    <button type="button" onClick={() => cambiarCantidad(i.IdProducto, i.Cantidad - 1)}>−</button>
                    <span>{i.Cantidad}</span>
                    <button type="button" onClick={() => cambiarCantidad(i.IdProducto, i.Cantidad + 1)}>+</button>
                  </div>
                  <strong>{formatearMoneda(i.Precio * i.Cantidad)}</strong>
                  <button type="button" className="btn-danger" onClick={() => quitarDelCarrito(i.IdProducto)}>×</button>
                </div>
              ))}
            </div>

            <div className="pos-total">
              <span>Total</span>
              <strong>{formatearMoneda(total)}</strong>
            </div>

            <button className="btn-primary pos-boton-cobrar" onClick={registrarVenta} disabled={registrando}>
              {registrando ? "Registrando..." : "Registrar venta"}
            </button>
          </div>
        </div>
      ) : (
        <div className="card-tabla">
          {cargandoVentas ? (
            <p className="estado-vacio">Cargando historial...</p>
          ) : ventas.length === 0 ? (
            <p className="estado-vacio">Aún no hay ventas registradas.</p>
          ) : (
            <table className="tabla-simple">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Cajero</th>
                  <th>Método</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.IdVenta}>
                    <td>{v.IdVenta}</td>
                    <td>{new Date(v.Fecha).toLocaleString("es-PE")}</td>
                    <td>{v.Cliente}</td>
                    <td>{v.Cajero}</td>
                    <td>{v.MetodoPago}</td>
                    <td>{formatearMoneda(v.Total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
