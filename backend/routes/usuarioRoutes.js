const router = require("express").Router();
const controller = require("../controllers/usuarioController");
const { verificarToken, verificarRol } = require("../middlewares/authMiddleware");

// Publicas
router.post("/login", controller.login);
router.post("/registro", controller.registrar);

// Protegida: solo usuarios autenticados, y solo Administrador (IdRol = 1, segun tu seed)
router.get("/", verificarToken, verificarRol(1), controller.getUsuarios);

module.exports = router;