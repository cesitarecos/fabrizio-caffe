# Fabrizio Caffè — Sistema Web de Gestión de Ventas con Dashboard en Tiempo Real

Stack: **SQL Server** + **Node.js / Express** (backend) + **React (Vite)** (frontend).

## 1. Base de datos

1. Abre SQL Server Management Studio (o Azure Data Studio).
2. Ejecuta `database/schema.sql` completo. Esto crea la base `FabrizioCaffeDB`, todas las tablas y datos semilla (categorías, productos, clientes, métodos de pago, mesas).
3. Arranca el backend (paso 2) y crea tu usuario Administrador real desde Postman/Thunder Client o desde el propio frontend:
   ```
   POST http://localhost:3000/api/usuarios/registro
   {
     "Nombre": "Fabrizio",
     "Apellido": "Admin",
     "Correo": "admin@fabriziocaffe.com",
     "Password": "Admin123!",
     "IdRol": 1
   }
   ```
4. (Opcional, recomendado) Ejecuta `database/seed_ventas.sql` para generar ventas de los últimos 7 días y que el Dashboard tenga datos reales que graficar desde el primer momento.

## 2. Backend

```bash
cd backend
npm install
```

Revisa `.env` (usuario/clave de tu SQL Server local):

```
PORT=3000
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=FabrizioCaffeDB
DB_USER=sa
DB_PASSWORD=tu_password
JWT_SECRET=cambia_esto_por_una_clave_larga_y_secreta
JWT_EXPIRES_IN=8h
```

```bash
npm run dev
```

Debe mostrar `✅ SQL Server conectado correctamente` y `🚀 Servidor ejecutándose en puerto 3000`.

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Inicia sesión con el usuario Administrador que creaste en el paso 1.3.

El archivo `frontend/.env` apunta al backend:
```
VITE_API_URL=http://localhost:3000/api
```

## 4. Qué incluye

- **Login** con JWT (roles Administrador / Cajero).
- **Dashboard en tiempo real**: KPIs del día, ventas de los últimos 7 días, top productos, ventas por método de pago y actividad reciente. Se auto-refresca cada 15 segundos consultando la API (sin datos estáticos).
- **Ventas**: punto de venta (carrito dinámico contra el catálogo real) que registra la venta y descuenta stock en una transacción SQL, + historial.
- **Productos / Categorías / Clientes**: CRUD completo contra SQL Server.
- **Usuarios**: alta de cuentas (solo visible para Administrador).

## 5. Próximos pasos sugeridos (para tu informe)

- Diagrama de casos de uso y arquitectura lógica (ya tienes las capas: Controllers → Models → SQL Server).
- Desplegar en Azure: App Service o AKS para el backend, Azure SQL Database (o VM con SQL Server en una VNet), Blob Storage si agregas imágenes de productos, y Azure Monitor para observabilidad — tal como está planteado en tu documento de Cloud Computing.
- Dockerfiles + docker-compose para backend/frontend, referenciados en tu índice (2.6).
