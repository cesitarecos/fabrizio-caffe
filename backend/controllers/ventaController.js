const ventaModel = require("../models/ventaModel");

exports.getVentas = async (req, res) => {
    try {
        const ventas = await ventaModel.obtenerVentas({
            limite: Number(req.query.limite) || 100
        });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getVentaPorId = async (req, res) => {
    try {
        const venta = await ventaModel.obtenerVentaPorId(req.params.id);
        if (!venta) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.postVenta = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Debe incluir al menos un producto (items)" });
        }

        // El cajero que registra la venta es el usuario autenticado
        const venta = {
            ...req.body,
            IdUsuario: req.usuario.IdUsuario
        };

        const resultado = await ventaModel.crearVenta(venta);
        res.status(201).json({ mensaje: "Venta registrada correctamente", ...resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
