import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts";
import api from "../api/axios";
import "./Dashboard.css";

const COLORES = ["#B8703F", "#4C7A6D", "#8C6A4F", "#D9A05B", "#6B4A3A"];

function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(valor || 0);
}

function formatearDia(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-PE", { weekday: "short", day: "2-digit" });
}

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const cargarResumen = useCallback(async () => {
    try {
      const { data } = await api.get("/dashboard/resumen");
      setDatos(data);
      setUltimaActualizacion(new Date());
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo cargar el dashboard");
    }
  }, []);

  useEffect(() => {
    cargarResumen();
    // "Tiempo real": refresca automáticamente cada 15 segundos
    const intervalo = setInterval(cargarResumen, 15000);
    return () => clearInterval(intervalo);
  }, [cargarResumen]);

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!datos) {
    return <div className="dashboard-loading">Cargando dashboard...</div>;
  }

  const { kpis, ventasPorDia, topProductos, ventasPorMetodoPago, actividadReciente } = datos;

  const ventasPorDiaFormateadas = ventasPorDia.map((d) => ({
    ...d,
    DiaLabel: formatearDia(d.Dia)
  }));

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Monitoreo de ventas en tiempo real</p>
        </div>
        {ultimaActualizacion && (
          <span className="dashboard-updated">
            <span className="pulse-dot" /> Actualizado {ultimaActualizacion.toLocaleTimeString("es-PE")}
          </span>
        )}
      </header>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Ventas de hoy</p>
          <h2 className="kpi-value">{formatearMoneda(kpis.TotalHoy)}</h2>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">N° de transacciones</p>
          <h2 className="kpi-value">{kpis.NumVentasHoy}</h2>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Ticket promedio</p>
          <h2 className="kpi-value">{formatearMoneda(kpis.TicketPromedioHoy)}</h2>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel panel-wide">
          <h3>Ventas de los últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={ventasPorDiaFormateadas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4D6C3" />
              <XAxis dataKey="DiaLabel" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatearMoneda(v)} />
              <Line type="monotone" dataKey="TotalDia" stroke="#B8703F" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Ventas por método de pago</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={ventasPorMetodoPago}
                dataKey="Total"
                nameKey="MetodoPago"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {ventasPorMetodoPago.map((_, i) => (
                  <Cell key={i} fill={COLORES[i % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatearMoneda(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Productos más vendidos</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProductos} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4D6C3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="Nombre" type="category" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="UnidadesVendidas" fill="#4C7A6D" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel panel-wide">
          <h3>Actividad reciente</h3>
          <div className="tabla-scroll">
            <table className="tabla-simple">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Cajero</th>
                  <th>Método</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {actividadReciente.map((v) => (
                  <tr key={v.IdVenta}>
                    <td>{new Date(v.Fecha).toLocaleString("es-PE")}</td>
                    <td>{v.Cliente}</td>
                    <td>{v.Cajero}</td>
                    <td>{v.MetodoPago}</td>
                    <td>{formatearMoneda(v.Total)}</td>
                  </tr>
                ))}
                {actividadReciente.length === 0 && (
                  <tr><td colSpan={5} className="tabla-vacia">Aún no hay ventas registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
