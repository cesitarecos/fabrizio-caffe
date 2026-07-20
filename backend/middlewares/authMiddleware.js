const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; // { IdUsuario, Correo, IdRol }
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalido o expirado" });
    }
};

// Middleware opcional para restringir por rol, ej: verificarRol(1) = solo Administrador
const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.IdRol)) {
            return res.status(403).json({ error: "No tienes permisos para esta accion" });
        }
        next();
    };
};

module.exports = { verificarToken, verificarRol };