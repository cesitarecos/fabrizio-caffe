const router = require("express").Router();
const controller = require("../controllers/productoController");
const { verificarToken } = require("../middlewares/authMiddleware");

router.get("/", verificarToken, controller.getProductos);
router.get("/:id", verificarToken, controller.getProductoPorId);
router.post("/", verificarToken, controller.postProducto);
router.put("/:id", verificarToken, controller.putProducto);
router.delete("/:id", verificarToken, controller.deleteProducto);

module.exports = router;
