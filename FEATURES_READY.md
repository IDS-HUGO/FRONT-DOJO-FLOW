# DojoFlow - Funcionalidades listas para pruebas

## Estado general

- Frontend operativo en `http://localhost:5173`
- Backend API operativo en `http://127.0.0.1:8000`
- Autenticación JWT activa
- Registro público oculto en la landing
- Ruta `/register` privada para owner autenticado

## Credenciales de administrador (owner)

- Usuario: `owner@dojoflow.com`
- Contraseña: `admin123`

## Funcionalidades listas para Dojo (operación diaria)

### 1) Dashboard
- KPIs principales de operación y negocio
- Vista resumida del estado del dojo

### 2) Estudiantes
- Listar estudiantes
- Crear estudiantes
- Buscar y filtrar estudiantes

### 3) Asistencia
- Registrar asistencia por clase
- Consultar historial de asistencia

### 4) Pagos
- Listar pagos
- Registrar pagos
- Estados de pago y seguimiento

### 5) Cinturones / Exámenes
- Registrar progreso
- Seguimiento de grados

### 6) Instructores
- Listar instructores
- Crear, editar y eliminar instructores
- Gestión de especialidades y tarifa por hora

### 7) Horarios
- Listar horarios
- Crear, editar y eliminar horarios
- Asignación de instructor y capacidad

### 8) Cupones
- Listar cupones
- Crear, editar y eliminar cupones
- Validar cupón y consumir uso

### 9) Marketplace
- Listar productos
- Crear productos para venta interna

### 10) Configuración de academia
- Ver perfil de academia
- Actualizar datos operativos (contacto, ciudad, zona horaria, moneda)

## Funcionalidades listas para Administración (empresa)

### 1) Control de acceso comercial
- Landing sin alta pública de cuenta
- Flujo de acceso centralizado por empresa
- Ruta de registro reservada para owner autenticado (`/register`)

### 2) Reportes ejecutivos
- `GET /api/v1/reports/summary`
- `GET /api/v1/reports/attendance-trend`
- `GET /api/v1/reports/revenue-breakdown`
- `GET /api/v1/reports/top-students`

### 3) Planeación comercial
- Planes SaaS visibles (`/api/v1/plans`)
- Dashboard de tendencias (`/api/v1/dashboard/kpis`, `/api/v1/dashboard/mrr-trend`)

### 4) Seguridad y sesión
- Login con JWT (`/api/v1/auth/login`)
- Protección de rutas del panel por token
- Cierre de sesión con limpieza de credenciales locales

## Endpoints principales activos

- Auth: `/api/v1/auth/login`
- Students: `/api/v1/students`
- Attendance: `/api/v1/attendance`
- Belts: `/api/v1/belts`
- Payments: `/api/v1/payments`
- Plans: `/api/v1/plans`
- Teachers: `/api/v1/teachers`
- Schedules: `/api/v1/schedules`
- Coupons: `/api/v1/coupons`
- Marketplace: `/api/v1/marketplace`
- Reports: `/api/v1/reports/*`
- Academy profile: `/api/v1/academy-profile`

## Notas de operación local

- MySQL está instalado y configurado localmente para la API.
- El backend se probó con login real y responde token correctamente.
- Si reinicias la PC, vuelve a iniciar MySQL (si no se registró como servicio con permisos admin) y luego corre el backend.