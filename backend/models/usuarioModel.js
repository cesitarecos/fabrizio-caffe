const { poolPromise, sql } = require("../config/database");

const obtenerUsuarios = async () => {
    const pool = await poolPromise;

    const result = await pool.request()
        .query(`
            SELECT
                IdUsuario,
                Nombre,
                Apellido,
                Correo,
                IdRol,
                Estado
            FROM Usuarios
            WHERE Estado = 1
        `);

    return result.recordset;
};

const obtenerPorCorreo = async (correo) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("Correo", sql.NVarChar, correo)
        .query(`
            SELECT
                IdUsuario,
                Nombre,
                Apellido,
                Correo,
                PasswordHash,
                IdRol,
                Estado
            FROM Usuarios
            WHERE Correo = @Correo
        `);

    return result.recordset[0] || null;
};

const crearUsuario = async (usuario) => {
    const pool = await poolPromise;

    await pool.request()
        .input("Nombre", sql.NVarChar, usuario.Nombre)
        .input("Apellido", sql.NVarChar, usuario.Apellido)
        .input("Correo", sql.NVarChar, usuario.Correo)
        .input("PasswordHash", sql.NVarChar, usuario.PasswordHash)
        .input("Telefono", sql.NVarChar, usuario.Telefono || null)
        .input("IdRol", sql.Int, usuario.IdRol)
        .query(`
            INSERT INTO Usuarios
                (Nombre, Apellido, Correo, PasswordHash, Telefono, IdRol)
            VALUES
                (@Nombre, @Apellido, @Correo, @PasswordHash, @Telefono, @IdRol)
        `);
};

module.exports = {
    obtenerUsuarios,
    obtenerPorCorreo,
    crearUsuario
};