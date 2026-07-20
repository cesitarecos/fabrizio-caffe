const router = require("express").Router();
const controller = require("../controllers/clienteController");
const { verificarToken } = require("../middlewares/authMiddleware");

router.get("/", verificarToken, controller.getClientes);
router.post("/", verificarToken, controller.postCliente);
router.put("/:id", verificarToken, controller.putCliente);
router.delete("/:id", verificarToken, controller.deleteCliente);

module.exports = router;
