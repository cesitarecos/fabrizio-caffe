const router = require("express").Router();
const controller = require("../controllers/categoriaController");
const { verificarToken } = require("../middlewares/authMiddleware");

router.get("/", verificarToken, controller.getCategorias);
router.post("/", verificarToken, controller.postCategoria);
router.put("/:id", verificarToken, controller.putCategoria);
router.delete("/:id", verificarToken, controller.deleteCategoria);

module.exports = router;
