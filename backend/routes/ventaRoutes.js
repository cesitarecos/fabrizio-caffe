const router = require("express").Router();
const controller = require("../controllers/ventaController");
const { verificarToken } = require("../middlewares/authMiddleware");

router.get("/", verificarToken, controller.getVentas);
router.get("/:id", verificarToken, controller.getVentaPorId);
router.post("/", verificarToken, controller.postVenta);

module.exports = router;
