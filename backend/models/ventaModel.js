const { poolPromise, sql } = require("../config/database");

/**
 * Lista las ventas más recientes, con nombre de cliente y cajero.
 */
const obtenerVentas = async ({ limite = 100 } = {}) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .input("Limite", sql.Int, limite)
        .query(`
            SELECT TOP (@Limite)
                v.IdVenta,
                v.Fecha,
                v.MetodoPago,
                v.Total,
                c.IdCliente,
                ISNULL(c.Nombre + ' ' + c.Apellido, 'Cliente no registrado') AS Cliente,
                u.IdUsuario,
                u.Nombre + ' ' + u.Apellido AS Cajero
            FROM Ventas v
            LEFT JOIN Clientes c ON c.IdCliente = v.IdCliente
            INNER JOIN Usuarios u ON u.IdUsuario = v.IdUsuario
            ORDER BY v.Fecha DESC
        `);
    return resultado.recordset;
};

const obtenerVentaPorId = async (id) => {
    const pool = await poolPromise;

    const cabecera = await pool.request()
        .input("IdVenta", sql.Int, id)
        .query(`
            SELECT
                v.IdVenta, v.Fecha, v.MetodoPago, v.Total,
                v.IdCliente,
                ISNULL(c.Nombre + ' ' + c.Apellido, 'Cliente no registrado') AS Cliente,
                u.Nombre + ' ' + u.Apellido AS Cajero
            FROM Ventas v
            LEFT JOIN Clientes c ON c.IdCliente = v.IdCliente
            INNER JOIN Usuarios u ON u.IdUsuario = v.IdUsuario
            WHERE v.IdVenta = @IdVenta
        `);

    if (cabecera.recordset.length === 0) return null;

    const detalle = await pool.request()
        .input("IdVenta", sql.Int, id)
        .query(`
            SELECT dv.IdDetalleVenta, dv.IdProducto, p.Nombre AS Producto,
                   dv.Cantidad, dv.Precio, dv.Subtotal
            FROM DetalleVenta dv
            INNER JOIN Productos p ON p.IdProducto = dv.IdProducto
            WHERE dv.IdVenta = @IdVenta
        `);

    return { ...cabecera.recordset[0], detalle: detalle.recordset };
};

/**
 * Crea una venta completa (cabecera + detalle) dentro de una transacción,
 * y descuenta el stock de cada producto vendido.
 *
 * @param {object} venta - { IdCliente, IdUsuario, MetodoPago, items: [{IdProducto, Cantidad, Precio}] }
 */
const crearVenta = async (venta) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
        const items = venta.items || [];
        if (items.length === 0) {
            throw new Error("La venta debe tener al menos un producto");
        }

        const total = items.reduce(
            (acc, item) => acc + Number(item.Cantidad) * Number(item.Precio),
            0
        );

        const requestCabecera = new sql.Request(transaction);
        const resultadoVenta = await requestCabecera
            .input("IdCliente", sql.Int, venta.IdCliente || null)
            .input("IdUsuario", sql.Int, venta.IdUsuario)
            .input("MetodoPago", sql.NVarChar, venta.MetodoPago || "Efectivo")
            .input("Total", sql.Decimal(10, 2), total)
            .query(`
                INSERT INTO Ventas (IdCliente, IdUsuario, MetodoPago, Total)
                OUTPUT INSERTED.IdVenta
                VALUES (@IdCliente, @IdUsuario, @MetodoPago, @Total)
            `);

        const idVenta = resultadoVenta.recordset[0].IdVenta;

        for (const item of items) {
            const subtotal = Number(item.Cantidad) * Number(item.Precio);

            const requestDetalle = new sql.Request(transaction);
            await requestDetalle
                .input("IdVenta", sql.Int, idVenta)
                .input("IdProducto", sql.Int, item.IdProducto)
                .input("Cantidad", sql.Int, item.Cantidad)
                .input("Precio", sql.Decimal(10, 2), item.Precio)
                .input("Subtotal", sql.Decimal(10, 2), subtotal)
                .query(`
                    INSERT INTO DetalleVenta (IdVenta, IdProducto, Cantidad, Precio, Subtotal)
                    VALUES (@IdVenta, @IdProducto, @Cantidad, @Precio, @Subtotal)
                `);

            const requestStock = new sql.Request(transaction);
            await requestStock
                .input("IdProducto", sql.Int, item.IdProducto)
                .input("Cantidad", sql.Int, item.Cantidad)
                .query(`
                    UPDATE Productos
                    SET Stock = Stock - @Cantidad
                    WHERE IdProducto = @IdProducto
                `);
        }

        await transaction.commit();
        return { IdVenta: idVenta, Total: total };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta
};
