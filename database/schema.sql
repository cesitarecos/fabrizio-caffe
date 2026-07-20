/*=========================================================
    FABRIZIO CAFFÈ - BASE DE DATOS
    SQL Server - Script de creación completo
=========================================================*/

IF DB_ID('FabrizioCaffeDB') IS NULL
BEGIN
    CREATE DATABASE FabrizioCaffeDB;
END
GO

USE FabrizioCaffeDB;
GO

/*=========================================
    TABLA ROLES
=========================================*/
CREATE TABLE Roles (
    IdRol INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(200),
    Estado BIT NOT NULL DEFAULT 1
);

/*=========================================
    TABLA USUARIOS
=========================================*/
CREATE TABLE Usuarios (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(150) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Telefono NVARCHAR(20),
    IdRol INT NOT NULL,
    Estado BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Usuarios_Roles
        FOREIGN KEY (IdRol)
        REFERENCES Roles(IdRol)
);

/*=========================================
    TABLA CLIENTES
=========================================*/
CREATE TABLE Clientes (
    IdCliente INT IDENTITY(1,1) PRIMARY KEY,
    DNI CHAR(8) UNIQUE,
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100),
    Telefono NVARCHAR(20),
    Correo NVARCHAR(100),
    Direccion NVARCHAR(200),
    FechaRegistro DATETIME DEFAULT GETDATE(),
    Estado BIT DEFAULT 1
);

/*=========================================
    TABLA PROVEEDORES
=========================================*/
CREATE TABLE Proveedores (
    IdProveedor INT IDENTITY(1,1) PRIMARY KEY,
    RUC CHAR(11) UNIQUE,
    RazonSocial NVARCHAR(150) NOT NULL,
    Telefono NVARCHAR(20),
    Correo NVARCHAR(100),
    Direccion NVARCHAR(200),
    Contacto NVARCHAR(100),
    Estado BIT DEFAULT 1
);

/*=========================================
    TABLA CATEGORIAS
=========================================*/
CREATE TABLE Categorias (
    IdCategoria INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(250),
    Estado BIT DEFAULT 1
);

/*=========================================
    TABLA PRODUCTOS
=========================================*/
CREATE TABLE Productos (
    IdProducto INT IDENTITY(1,1) PRIMARY KEY,
    IdCategoria INT NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(250),
    Precio DECIMAL(10,2) NOT NULL,
    Stock INT DEFAULT 0,
    Imagen NVARCHAR(255),
    Estado BIT DEFAULT 1,

    CONSTRAINT FK_Productos_Categorias
        FOREIGN KEY(IdCategoria)
        REFERENCES Categorias(IdCategoria)
);

/*=========================================
    TABLA INSUMOS
=========================================*/
CREATE TABLE Insumos (
    IdInsumo INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    UnidadMedida NVARCHAR(30) NOT NULL,
    Stock INT DEFAULT 0,
    StockMinimo INT DEFAULT 5,
    Estado BIT DEFAULT 1
);

/*=========================================
    TABLA COMPRAS
=========================================*/
CREATE TABLE Compras (
    IdCompra INT IDENTITY(1,1) PRIMARY KEY,
    IdProveedor INT NOT NULL,
    IdUsuario INT NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    Total DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_Compras_Proveedor
        FOREIGN KEY(IdProveedor)
        REFERENCES Proveedores(IdProveedor),

    CONSTRAINT FK_Compras_Usuario
        FOREIGN KEY(IdUsuario)
        REFERENCES Usuarios(IdUsuario)
);

/*=========================================
    DETALLE COMPRA
=========================================*/
CREATE TABLE DetalleCompra (
    IdDetalleCompra INT IDENTITY(1,1) PRIMARY KEY,
    IdCompra INT NOT NULL,
    IdInsumo INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_DetalleCompra_Compra
        FOREIGN KEY(IdCompra)
        REFERENCES Compras(IdCompra),

    CONSTRAINT FK_DetalleCompra_Insumo
        FOREIGN KEY(IdInsumo)
        REFERENCES Insumos(IdInsumo)
);

/*=========================================
    TABLA VENTAS
=========================================*/
CREATE TABLE Ventas (
    IdVenta INT IDENTITY(1,1) PRIMARY KEY,
    IdCliente INT,
    IdUsuario INT NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    MetodoPago NVARCHAR(50),
    Total DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_Ventas_Cliente
        FOREIGN KEY(IdCliente)
        REFERENCES Clientes(IdCliente),

    CONSTRAINT FK_Ventas_Usuario
        FOREIGN KEY(IdUsuario)
        REFERENCES Usuarios(IdUsuario)
);

/*=========================================
    DETALLE VENTA
=========================================*/
CREATE TABLE DetalleVenta (
    IdDetalleVenta INT IDENTITY(1,1) PRIMARY KEY,
    IdVenta INT NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_DetalleVenta_Venta
        FOREIGN KEY(IdVenta)
        REFERENCES Ventas(IdVenta),

    CONSTRAINT FK_DetalleVenta_Producto
        FOREIGN KEY(IdProducto)
        REFERENCES Productos(IdProducto)
);

/*=========================================
    MOVIMIENTOS INVENTARIO
=========================================*/
CREATE TABLE MovimientosInventario (
    IdMovimiento INT IDENTITY(1,1) PRIMARY KEY,
    IdInsumo INT NOT NULL,
    TipoMovimiento NVARCHAR(20) NOT NULL,
    Cantidad INT NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    Observacion NVARCHAR(250),

    CONSTRAINT FK_Movimientos_Insumo
        FOREIGN KEY(IdInsumo)
        REFERENCES Insumos(IdInsumo)
);

CREATE TABLE MetodosPago(
    IdMetodoPago INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Estado BIT DEFAULT 1
);

CREATE TABLE Caja(
    IdCaja INT IDENTITY(1,1) PRIMARY KEY,
    Fecha DATE NOT NULL,
    MontoInicial DECIMAL(10,2),
    MontoFinal DECIMAL(10,2),
    Estado NVARCHAR(20),
    IdUsuario INT NOT NULL,

    FOREIGN KEY(IdUsuario)
        REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE MovimientosCaja(
    IdMovimientoCaja INT IDENTITY(1,1) PRIMARY KEY,
    IdCaja INT NOT NULL,
    TipoMovimiento NVARCHAR(30),
    Descripcion NVARCHAR(200),
    Monto DECIMAL(10,2),
    Fecha DATETIME DEFAULT GETDATE(),

    FOREIGN KEY(IdCaja)
        REFERENCES Caja(IdCaja)
);

CREATE TABLE Mesas(
    IdMesa INT IDENTITY(1,1) PRIMARY KEY,
    Numero INT NOT NULL,
    Capacidad INT,
    Estado NVARCHAR(30)
);

CREATE TABLE Promociones(
    IdPromocion INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100),
    Descripcion NVARCHAR(250),
    Descuento DECIMAL(5,2),
    FechaInicio DATE,
    FechaFin DATE,
    Estado BIT DEFAULT 1
);

CREATE TABLE DetallePromocion(
    IdDetalle INT IDENTITY(1,1) PRIMARY KEY,
    IdPromocion INT NOT NULL,
    IdProducto INT NOT NULL,

    FOREIGN KEY(IdPromocion)
        REFERENCES Promociones(IdPromocion),

    FOREIGN KEY(IdProducto)
        REFERENCES Productos(IdProducto)
);

CREATE TABLE Recetas(
    IdReceta INT IDENTITY(1,1) PRIMARY KEY,
    IdProducto INT NOT NULL,

    FOREIGN KEY(IdProducto)
        REFERENCES Productos(IdProducto)
);

CREATE TABLE DetalleReceta(
    IdDetalleReceta INT IDENTITY(1,1) PRIMARY KEY,
    IdReceta INT NOT NULL,
    IdInsumo INT NOT NULL,
    Cantidad DECIMAL(10,2),
    UnidadMedida NVARCHAR(30),

    FOREIGN KEY(IdReceta)
        REFERENCES Recetas(IdReceta),

    FOREIGN KEY(IdInsumo)
        REFERENCES Insumos(IdInsumo)
);

CREATE TABLE Bitacora(
    IdBitacora INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario INT,
    Accion NVARCHAR(200),
    Tabla NVARCHAR(100),
    Fecha DATETIME DEFAULT GETDATE(),

    FOREIGN KEY(IdUsuario)
        REFERENCES Usuarios(IdUsuario)
);
GO

/*=========================================================
    DATOS SEMILLA (necesarios para que el sistema funcione
    y para que el Dashboard tenga datos reales que consultar,
    en lugar de datos estáticos en el frontend)
=========================================================*/

INSERT INTO Roles (Nombre, Descripcion) VALUES
    (N'ADMINISTRADOR', N'Acceso total al sistema'),
    (N'CAJERO', N'Registro de ventas y caja');
GO

-- IMPORTANTE: no insertes aquí un PasswordHash "inventado".
-- Crea tu usuario Administrador real desde el endpoint:
--   POST /api/usuarios/registro
--   { "Nombre":"Fabrizio","Apellido":"Admin","Correo":"admin@fabriziocaffe.com",
--     "Password":"Admin123!","IdRol":1 }
-- Eso generará el hash bcrypt correcto automáticamente.

INSERT INTO Categorias (Nombre, Descripcion) VALUES
    (N'Café', N'Bebidas a base de café'),
    (N'Postres', N'Repostería y dulces'),
    (N'Bebidas Frías', N'Jugos, frappés y bebidas heladas'),
    (N'Snacks', N'Bocaditos y piqueos');
GO

INSERT INTO Productos (IdCategoria, Nombre, Descripcion, Precio, Stock) VALUES
    (1, N'Espresso', N'Café espresso tradicional', 6.50, 100),
    (1, N'Cappuccino', N'Espresso con leche vaporizada', 9.00, 100),
    (1, N'Latte', N'Café con abundante leche', 9.50, 100),
    (2, N'Cheesecake', N'Porción de cheesecake', 12.00, 30),
    (2, N'Brownie', N'Brownie de chocolate', 8.50, 40),
    (3, N'Frappé de Vainilla', N'Bebida fría batida', 11.00, 50),
    (3, N'Limonada Frozen', N'Limonada helada', 8.00, 50),
    (4, N'Sandwich Mixto', N'Sandwich de jamón y queso', 10.00, 25);
GO

INSERT INTO Clientes (DNI, Nombre, Apellido, Telefono, Correo) VALUES
    ('70001111', N'Lucía', N'Fernández', '988111222', 'lucia@mail.com'),
    ('70002222', N'Mateo', N'Torres', '988222333', 'mateo@mail.com'),
    ('70003333', N'Valentina', N'Ríos', '988333444', 'valentina@mail.com');
GO

INSERT INTO MetodosPago (Nombre) VALUES
    (N'Efectivo'), (N'Tarjeta'), (N'Yape/Plin');
GO

INSERT INTO Mesas (Numero, Capacidad, Estado) VALUES
    (1, 2, N'Libre'), (2, 4, N'Libre'), (3, 4, N'Libre'), (4, 6, N'Libre');
GO

/*=========================================================
    NOTA:
    Las ventas de prueba para alimentar el Dashboard se
    generan aparte, DESPUÉS de crear tu usuario Administrador
    real (porque Ventas.IdUsuario depende de un Usuario
    existente). Ejecuta database/seed_ventas.sql una vez
    tengas al menos un usuario creado.
=========================================================*/

SELECT IdRol, Nombre FROM Roles;
SELECT * FROM Categorias;
SELECT * FROM Productos;
