# DojoFlow Frontend (React)

Panel administrativo SaaS para academias de artes marciales, diseñado con estilo minimalista y enfoque comercial.

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
