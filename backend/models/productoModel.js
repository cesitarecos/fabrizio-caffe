const { poolPromise, sql } = require("../config/database");

const obtenerProductos = async () => {
    const pool = await poolPromise;

    const resultado = await pool.request()
        .query(`
            SELECT p.IdProducto, p.IdCategoria, c.Nombre AS Categoria,
                   p.Nombre, p.Descripcion, p.Precio, p.Stock, p.Imagen
            FROM Productos p
            INNER JOIN Categorias c ON c.IdCategoria = p.IdCategoria
            WHERE p.Estado = 1
            ORDER BY p.Nombre
        `);

    return resultado.recordset;
};

const obtenerProductoPorId = async (id) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .input("IdProducto", sql.Int, id)
        .query(`
            SELECT IdProducto, IdCategoria, Nombre, Descripcion, Precio, Stock, Imagen
            FROM Productos
            WHERE IdProducto = @IdProducto AND Estado = 1
        `);
    return resultado.recordset[0] || null;
};

const crearProducto = async (producto) => {
    const pool = await poolPromise;

    const resultado = await pool.request()
        .input("IdCategoria", sql.Int, producto.IdCategoria)
        .input("Nombre", sql.NVarChar, producto.Nombre)
        .input("Descripcion", sql.NVarChar, producto.Descripcion || null)
        .input("Precio", sql.Decimal(10, 2), producto.Precio)
        .input("Stock", sql.Int, producto.Stock || 0)
        .query(`
            INSERT INTO Productos (IdCategoria, Nombre, Descripcion, Precio, Stock)
            OUTPUT INSERTED.IdProducto
            VALUES (@IdCategoria, @Nombre, @Descripcion, @Precio, @Stock)
        `);

    return resultado.recordset[0].IdProducto;
};

const actualizarProducto = async (id, producto) => {
    const pool = await poolPromise;
    await pool.request()
        .input("IdProducto", sql.Int, id)
        .input("IdCategoria", sql.Int, producto.IdCategoria)
        .input("Nombre", sql.NVarChar, producto.Nombre)
        .input("Descripcion", sql.NVarChar, producto.Descripcion || null)
        .input("Precio", sql.Decimal(10, 2), producto.Precio)
        .input("Stock", sql.Int, producto.Stock || 0)
        .query(`
            UPDATE Productos
            SET IdCategoria = @IdCategoria,
                Nombre = @Nombre,
                Descripcion = @Descripcion,
                Precio = @Precio,
                Stock = @Stock
            WHERE IdProducto = @IdProducto
        `);
};

const eliminarProducto = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input("IdProducto", sql.Int, id)
        .query(`UPDATE Productos SET Estado = 0 WHERE IdProducto = @IdProducto`);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
