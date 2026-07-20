const { poolPromise, sql } = require("../config/database");

const obtenerClientes = async () => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .query(`
            SELECT IdCliente, DNI, Nombre, Apellido, Telefono, Correo, Direccion, FechaRegistro
            FROM Clientes
            WHERE Estado = 1
            ORDER BY Nombre
        `);
    return resultado.recordset;
};

const buscarClientePorDni = async (dni) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .input("DNI", sql.Char(8), dni)
        .query(`
            SELECT IdCliente, DNI, Nombre, Apellido, Telefono, Correo
            FROM Clientes
            WHERE DNI = @DNI AND Estado = 1
        `);
    return resultado.recordset[0] || null;
};

const crearCliente = async (cliente) => {
    const pool = await poolPromise;
    const resultado = await pool.request()
        .input("DNI", sql.Char(8), cliente.DNI || null)
        .input("Nombre", sql.NVarChar, cliente.Nombre)
        .input("Apellido", sql.NVarChar, cliente.Apellido || null)
        .input("Telefono", sql.NVarChar, cliente.Telefono || null)
        .input("Correo", sql.NVarChar, cliente.Correo || null)
        .input("Direccion", sql.NVarChar, cliente.Direccion || null)
        .query(`
            INSERT INTO Clientes (DNI, Nombre, Apellido, Telefono, Correo, Direccion)
            OUTPUT INSERTED.IdCliente
            VALUES (@DNI, @Nombre, @Apellido, @Telefono, @Correo, @Direccion)
        `);
    return resultado.recordset[0].IdCliente;
};

const actualizarCliente = async (id, cliente) => {
    const pool = await poolPromise;
    await pool.request()
        .input("IdCliente", sql.Int, id)
        .input("Nombre", sql.NVarChar, cliente.Nombre)
        .input("Apellido", sql.NVarChar, cliente.Apellido || null)
        .input("Telefono", sql.NVarChar, cliente.Telefono || null)
        .input("Correo", sql.NVarChar, cliente.Correo || null)
        .input("Direccion", sql.NVarChar, cliente.Direccion || null)
        .query(`
            UPDATE Clientes
            SET Nombre = @Nombre,
                Apellido = @Apellido,
                Telefono = @Telefono,
                Correo = @Correo,
                Direccion = @Direccion
            WHERE IdCliente = @IdCliente
        `);
};

const eliminarCliente = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input("IdCliente", sql.Int, id)
        .query(`UPDATE Clientes SET Estado = 0 WHERE IdCliente = @IdCliente`);
};

module.exports = {
    obtenerClientes,
    buscarClientePorDni,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};
