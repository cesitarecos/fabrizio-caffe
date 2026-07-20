const { poolPromise, sql } = require("../config/database");

const obtenerCategorias = async () => {
    const pool = await poolPromise;

    const resultado = await pool.request()
        .query(`
            SELECT IdCategoria, Nombre, Descripcion
            FROM Categorias
            WHERE Estado = 1
            ORDER BY Nombre
        `);

    return resultado.recordset;
};

const crearCategoria = async (categoria) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .input("Nombre", sql.NVarChar, categoria.Nombre)
        .input("Descripcion", sql.NVarChar, categoria.Descripcion || null)
        .query(`
            INSERT INTO Categorias (Nombre, Descripcion)
            OUTPUT INSERTED.IdCategoria
            VALUES (@Nombre, @Descripcion)
        `);
    return resultado.recordset[0].IdCategoria;
};

const actualizarCategoria = async (id, categoria) => {
    const pool = await poolPromise;
    await pool.request()
        .input("IdCategoria", sql.Int, id)
        .input("Nombre", sql.NVarChar, categoria.Nombre)
        .input("Descripcion", sql.NVarChar, categoria.Descripcion || null)
        .query(`
            UPDATE Categorias
            SET Nombre = @Nombre, Descripcion = @Descripcion
            WHERE IdCategoria = @IdCategoria
        `);
};

const eliminarCategoria = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input("IdCategoria", sql.Int, id)
        .query(`UPDATE Categorias SET Estado = 0 WHERE IdCategoria = @IdCategoria`);
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
