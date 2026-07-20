const categoriaModel = require("../models/categoriaModel");

exports.getCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.obtenerCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.postCategoria = async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }
        const IdCategoria = await categoriaModel.crearCategoria(req.body);
        res.status(201).json({ mensaje: "Categoria creada correctamente", IdCategoria });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.putCategoria = async (req, res) => {
    try {
        await categoriaModel.actualizarCategoria(req.params.id, req.body);
        res.json({ mensaje: "Categoria actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategoria = async (req, res) => {
    try {
        await categoriaModel.eliminarCategoria(req.params.id);
        res.json({ mensaje: "Categoria eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
