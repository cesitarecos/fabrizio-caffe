const dashboardModel = require("../models/dashboardModel");

exports.getResumen = async (req, res) => {
    try {
        const [kpis, ventasPorDia, topProductos, ventasPorMetodoPago, actividadReciente] =
            await Promise.all([
                dashboardModel.obtenerKpisHoy(),
                dashboardModel.obtenerVentasPorDia(7),
                dashboardModel.obtenerTopProductos(5),
                dashboardModel.obtenerVentasPorMetodoPago(),
                dashboardModel.obtenerActividadReciente(10)
            ]);

        res.json({
            kpis,
            ventasPorDia,
            topProductos,
            ventasPorMetodoPago,
            actividadReciente,
            actualizadoEn: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getKpis = async (req, res) => {
    try {
        const kpis = await dashboardModel.obtenerKpisHoy();
        res.json(kpis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getVentasPorDia = async (req, res) => {
    try {
        const dias = Number(req.query.dias) > 0 ? Number(req.query.dias) : 7;
        const datos = await dashboardModel.obtenerVentasPorDia(dias);
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopProductos = async (req, res) => {
    try {
        const limite = Number(req.query.limite) > 0 ? Number(req.query.limite) : 5;
        const datos = await dashboardModel.obtenerTopProductos(limite);
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
