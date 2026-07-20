const productoModel = require("../models/productoModel");

exports.getProductos = async (req, res) => {
    try {
        const productos = await productoModel.obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductoPorId = async (req, res) => {
    try {
        const producto = await productoModel.obtenerProductoPorId(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.postProducto = async (req, res) => {
    try {
        const { IdCategoria, Nombre, Precio } = req.body;
        if (!IdCategoria || !Nombre || Precio === undefined) {
            return res.status(400).json({ error: "IdCategoria, Nombre y Precio son obligatorios" });
        }
        const IdProducto = await productoModel.crearProducto(req.body);
        res.status(201).json({ mensaje: "Producto creado correctamente", IdProducto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.putProducto = async (req, res) => {
    try {
        await productoModel.actualizarProducto(req.params.id, req.body);
        res.json({ mensaje: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProducto = async (req, res) => {
    try {
        await productoModel.eliminarProducto(req.params.id);
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
