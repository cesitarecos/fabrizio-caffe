/*=========================================================
    SEED DE VENTAS DE PRUEBA
    Ejecutar DESPUÉS de tener al menos 1 usuario creado
    (por ejemplo, tu Administrador vía /api/usuarios/registro)
    y productos/clientes ya cargados por schema.sql.

    Esto llena los últimos 7 días con ventas reales en la
    base de datos, para que el Dashboard en React muestre
    gráficos con datos reales desde el primer arranque.
=========================================================*/

USE FabrizioCaffeDB;
GO

DECLARE @IdUsuarioDemo INT = (SELECT TOP 1 IdUsuario FROM Usuarios ORDER BY IdUsuario);

IF @IdUsuarioDemo IS NULL
BEGIN
    RAISERROR('No hay usuarios registrados. Crea un usuario antes de correr este seed.', 16, 1);
    RETURN;
END

DECLARE @i INT = 0;
DECLARE @idVenta INT;

WHILE @i < 7
BEGIN
    -- Venta 1 del día
    INSERT INTO Ventas (IdCliente, IdUsuario, Fecha, MetodoPago, Total)
    VALUES (1, @IdUsuarioDemo, DATEADD(DAY, -@i, GETDATE()), N'Efectivo', 25.00);
    SET @idVenta = SCOPE_IDENTITY();

    INSERT INTO DetalleVenta (IdVenta, IdProducto, Cantidad, Precio, Subtotal)
    VALUES
        (@idVenta, 1, 2, 6.50, 13.00),
        (@idVenta, 4, 1, 12.00, 12.00);

    -- Venta 2 del día
    INSERT INTO Ventas (IdCliente, IdUsuario, Fecha, MetodoPago, Total)
    VALUES (2, @IdUsuarioDemo, DATEADD(HOUR, -3, DATEADD(DAY, -@i, GETDATE())), N'Tarjeta', 20.50);
    SET @idVenta = SCOPE_IDENTITY();

    INSERT INTO DetalleVenta (IdVenta, IdProducto, Cantidad, Precio, Subtotal)
    VALUES
        (@idVenta, 3, 1, 9.50, 9.50),
        (@idVenta, 6, 1, 11.00, 11.00);

    -- Venta 3 del día
    INSERT INTO Ventas (IdCliente, IdUsuario, Fecha, MetodoPago, Total)
    VALUES (3, @IdUsuarioDemo, DATEADD(HOUR, -6, DATEADD(DAY, -@i, GETDATE())), N'Yape/Plin', 18.00);
    SET @idVenta = SCOPE_IDENTITY();

    INSERT INTO DetalleVenta (IdVenta, IdProducto, Cantidad, Precio, Subtotal)
    VALUES
        (@idVenta, 2, 2, 9.00, 18.00);

    SET @i = @i + 1;
END
GO

SELECT COUNT(*) AS TotalVentasSemilla FROM Ventas;
SELECT CAST(Fecha AS DATE) AS Dia, COUNT(*) AS NumVentas, SUM(Total) AS TotalDia
FROM Ventas
GROUP BY CAST(Fecha AS DATE)
ORDER BY Dia;
