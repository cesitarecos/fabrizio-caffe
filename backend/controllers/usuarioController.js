const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuarioModel");

exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.registrar = async (req, res) => {
    try {
        const { Nombre, Apellido, Correo, Password, Telefono, IdRol } = req.body;

        if (!Nombre || !Apellido || !Correo || !Password || !IdRol) {
            return res.status(400).json({
                error: "Nombre, Apellido, Correo, Password e IdRol son obligatorios"
            });
        }

        const existente = await usuarioModel.obtenerPorCorreo(Correo);
        if (existente) {
            return res.status(409).json({ error: "Ya existe un usuario con ese correo" });
        }

        const PasswordHash = await bcrypt.hash(Password, 10);

        await usuarioModel.crearUsuario({
            Nombre, Apellido, Correo, PasswordHash, Telefono, IdRol
        });

        res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { Correo, Password } = req.body;

        if (!Correo || !Password) {
            return res.status(400).json({ error: "Correo y Password son obligatorios" });
        }

        const usuario = await usuarioModel.obtenerPorCorreo(Correo);

        if (!usuario || !usuario.Estado) {
            return res.status(401).json({ error: "Credenciales invalidas" });
        }

        const passwordValido = await bcrypt.compare(Password, usuario.PasswordHash);

        if (!passwordValido) {
            return res.status(401).json({ error: "Credenciales invalidas" });
        }

        const token = jwt.sign(
            {
                IdUsuario: usuario.IdUsuario,
                Correo: usuario.Correo,
                IdRol: usuario.IdRol
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        );

        res.json({
            token,
            usuario: {
                IdUsuario: usuario.IdUsuario,
                Nombre: usuario.Nombre,
                Apellido: usuario.Apellido,
                Correo: usuario.Correo,
                IdRol: usuario.IdRol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};