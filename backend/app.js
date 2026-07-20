const express = require("express");
const cors = require("cors");

const productoRoutes = require("./routes/productoRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const ventaRoutes = require("./routes/ventaRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/productos", productoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API Fabrizio Caffè funcionando"
    });
});

module.exports = app;