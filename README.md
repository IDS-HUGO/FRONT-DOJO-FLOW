# DojoFlow Frontend (React)

Panel administrativo SaaS para academias de artes marciales, diseñado con estilo minimalista y enfoque comercial.

## Manual para principiantes 0

- [Manual completo del frontend](MANUAL_PARA_PRINCIPIANTES_0.md)

## Ubicación del proyecto

- Frontend: `D:/UNIVERSIDAD/ANALISIS FINANCIERO/Dojo-Flow`
- API (separada): `D:/UNIVERSIDAD/ANALISIS FINANCIERO/Dojo-Flow-API`

## Requisitos

- Node.js 20+

## Configuración

1. Copia `.env.example` a `.env`.
2. Configura `VITE_API_BASE_URL` (por defecto `http://localhost:8000/api/v1`).

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

## Comandos rapidos (frontend)

```bash
# Instalar dependencias
npm install

# Levantar entorno local (Vite)
npm run dev

# Compilar para verificar errores de TypeScript + build
npm run build

# Servir build local
npm run preview
```

## Flujo local completo (frontend + API)

En una terminal 1 (API):

```bash
cd D:/UNIVERSIDAD/ANALISIS FINANCIERO/Dojo-Flow-API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

En una terminal 2 (frontend):

```bash
cd D:/UNIVERSIDAD/ANALISIS FINANCIERO/Dojo-Flow
npm run dev
```

Validaciones recomendadas:

1. Login staff y acceso a modulos administrativos.
2. Login alumno en /student/login y uso de portal de alumno.
3. Checkout PayPal en Pantalla de Pagos y Planes.
4. Verificacion de retorno de pago (status paid/pending/failed).

## Build de entrega

```bash
npm run build
```

## Módulos incluidos

- **Dashboard ejecutivo** con KPIs (MRR, churn, take-rate, NPS)
- **Gestión de alumnos** con búsqueda y filtros
- **Control de asistencias** por clase y tipo
- **Cobranza y pagos** con seguimiento de status
- **Grados y exámenes** con calificaciones y aprobaciones
- **Gestión de instructores** - crear, editar y asignar especialidades
- **Horarios de clases** - calendario con días, horas e instructores asignados
- **Planes SaaS** - mostrar 3 tiers de precios
- **Cupones y descuentos** - crear códigos, limitar usos, validar fechas
- **Marketplace** - catálogo de productos, stock, precios
- **Reportes y análisis** - ingresos, asistencia, top estudiantes, tendencias
- **Configuración de academia** - datos del dojo, contacto, zona horaria, moneda
