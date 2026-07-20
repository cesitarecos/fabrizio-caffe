const { poolPromise } = require("../config/database");

/**
 * KPIs del día: total vendido hoy, número de ventas hoy, ticket promedio.
 */
const obtenerKpisHoy = async () => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .query(`
            SELECT
                ISNULL(SUM(Total), 0) AS TotalHoy,
                COUNT(*) AS NumVentasHoy,
                ISNULL(AVG(Total), 0) AS TicketPromedioHoy
            FROM Ventas
            WHERE CAST(Fecha AS DATE) = CAST(GETDATE() AS DATE)
        `);
    return resultado.recordset[0];
};

/**
 * Ventas de los últimos N días (por día), para el gráfico de tendencia.
 */
const obtenerVentasPorDia = async (dias = 7) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .query(`
            SELECT
                CAST(Fecha AS DATE) AS Dia,
                COUNT(*) AS NumVentas,
                SUM(Total) AS TotalDia
            FROM Ventas
            WHERE Fecha >= DATEADD(DAY, -${Number(dias) - 1}, CAST(GETDATE() AS DATE))
            GROUP BY CAST(Fecha AS DATE)
            ORDER BY Dia ASC
        `);
    return resultado.recordset;
};

/**
 * Top productos más vendidos (por cantidad), útil para el dashboard.
 */
const obtenerTopProductos = async (limite = 5) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .query(`
            SELECT TOP ${Number(limite)}
                p.IdProducto,
                p.Nombre,
                SUM(dv.Cantidad) AS UnidadesVendidas,
                SUM(dv.Subtotal) AS TotalGenerado
            FROM DetalleVenta dv
            INNER JOIN Productos p ON p.IdProducto = dv.IdProducto
            INNER JOIN Ventas v ON v.IdVenta = dv.IdVenta
            GROUP BY p.IdProducto, p.Nombre
            ORDER BY UnidadesVendidas DESC
        `);
    return resultado.recordset;
};

/**
 * Distribución de ventas por método de pago (para gráfico de torta).
 */
const obtenerVentasPorMetodoPago = async () => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .query(`
            SELECT
                ISNULL(MetodoPago, 'No especificado') AS MetodoPago,
                COUNT(*) AS NumVentas,
                SUM(Total) AS Total
            FROM Ventas
            GROUP BY MetodoPago
        `);
    return resultado.recordset;
};

/**
 * Últimas ventas registradas, para el feed de actividad reciente del dashboard.
 */
const obtenerActividadReciente = async (limite = 10) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .query(`
            SELECT TOP ${Number(limite)}
                v.IdVenta,
                v.Fecha,
                v.Total,
                v.MetodoPago,
                ISNULL(c.Nombre, 'Cliente no registrado') AS Cliente,
                u.Nombre AS Cajero
            FROM Ventas v
            LEFT JOIN Clientes c ON c.IdCliente = v.IdCliente
            INNER JOIN Usuarios u ON u.IdUsuario = v.IdUsuario
            ORDER BY v.Fecha DESC
        `);
    return resultado.recordset;
};

module.exports = {
    obtenerKpisHoy,
    obtenerVentasPorDia,
    obtenerTopProductos,
    obtenerVentasPorMetodoPago,
    obtenerActividadReciente
};
