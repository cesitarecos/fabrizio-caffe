const router = require("express").Router();
const controller = require("../controllers/dashboardController");
const { verificarToken } = require("../middlewares/authMiddleware");

// Todo el dashboard requiere estar autenticado
router.get("/resumen", verificarToken, controller.getResumen);
router.get("/kpis", verificarToken, controller.getKpis);
router.get("/ventas-por-dia", verificarToken, controller.getVentasPorDia);
router.get("/top-productos", verificarToken, controller.getTopProductos);

module.exports = router;
