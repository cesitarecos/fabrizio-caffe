const clienteModel = require("../models/clienteModel");

exports.getClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.obtenerClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.postCliente = async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }
        const idCliente = await clienteModel.crearCliente(req.body);
        res.status(201).json({ mensaje: "Cliente creado correctamente", IdCliente: idCliente });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.putCliente = async (req, res) => {
    try {
        await clienteModel.actualizarCliente(req.params.id, req.body);
        res.json({ mensaje: "Cliente actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        await clienteModel.eliminarCliente(req.params.id);
        res.json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
