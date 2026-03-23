# 🥋 DojoFlow - Sistema de Gestión para Academias de Artes Marciales

**Versión:** 1.0 (Beta)  
**Rama activa:** `hugo`  
**Estado:** ✅ B2B Checkout Flow Operativo

---

## 🎯 ¿Qué es DojoFlow?

DojoFlow es una **plataforma SaaS B2B** diseñada para profesionalizar la gestión administrativa de academias de artes marciales. Ofrece:

- 📱 **App para Alumnos** - Consultar horarios, asistencias, progreso de cinturones
- 💳 **Pagos Automáticos** - Sistema integrado de cobros a estudiantes
- 📊 **Dashboard Admin** - Gestión completa de academia, instructores, horarios
- 🏆 **Marketplace** - Venta de equipamiento (uniformes, protecciones, etc.)
- 🛒 **B2B Checkout** - ¡NUEVO! Modelo SaaS con 3 planes disponibles

---

## 📦 Planes Disponibles

| Plan | Precio Mensual | Almacenamiento | Estudiantes | App Alumnos | Marketplace |
|------|---|---|---|---|---|
| **Blanco** | $0 MXN | 1 GB | Ilimitados | ❌ | ❌ |
| **Negro** | $520 MXN | 50 GB | Ilimitados | ✅ | ✅ |
| **Maestro** | $870 MXN | 500 GB | Ilimitados | ✅ | ✅ |

---

## 🚀 Empezar Rápido

### Para Colaboradores
Lee **[SETUP_COLABORADORES.md](./SETUP_COLABORADORES.md)** en cada repo:

**Frontend:**
```bash
git clone https://github.com/IDS-HUGO/FRONT-DOJO-FLOW.git
cd FRONT-DOJO-FLOW
git checkout hugo
# Sigue instrucciones en SETUP_COLABORADORES.md
```

**Backend:**
```bash
git clone https://github.com/IDS-HUGO/BACK-DOJO-FLOW.git
cd BACK-DOJO-FLOW
git checkout hugo
# Sigue instrucciones en SETUP_COLABORADORES.md
```

---

## 📚 Documentación

Cada repositorio contiene:

### Frontend (`FRONT-DOJO-FLOW`)
- **[SETUP_COLABORADORES.md](https://github.com/IDS-HUGO/FRONT-DOJO-FLOW/blob/hugo/SETUP_COLABORADORES.md)** - Guía de instalación y setup
- **[TESTING.md](https://github.com/IDS-HUGO/FRONT-DOJO-FLOW/blob/hugo/TESTING.md)** - Testing E2E y guía de QA
- **[README.md](https://github.com/IDS-HUGO/FRONT-DOJO-FLOW)** - Overview del proyecto

### Backend (`BACK-DOJO-FLOW`)
- **[SETUP_COLABORADORES.md](https://github.com/IDS-HUGO/BACK-DOJO-FLOW/blob/hugo/SETUP_COLABORADORES.md)** - Guía de instalación y setup
- **[DATABASE_DEPLOYMENT.md](https://github.com/IDS-HUGO/BACK-DOJO-FLOW/blob/hugo/DATABASE_DEPLOYMENT.md)** - Especificación BD y deployment
- **[README.md](https://github.com/IDS-HUGO/BACK-DOJO-FLOW)** - Overview del proyecto

---

## 💻 Stack Tecnológico

### Frontend
- **React 18** + TypeScript
- **Vite** (bundler)
- **React Router 6** (navegación)
- **CSS3** (sin frameworks, diseño profesional)

### Backend
- **FastAPI** (framework web)
- **SQLAlchemy 2.0** (ORM)
- **MySQL 8.0** (base de datos)
- **Pydantic** (validación de datos)
- **JWT** (autenticación)

### DevOps
- **Git** (control de versiones)
- **GitHub** (repositorio remoto)
- Preparado para **AWS/Azure/GCP**

---

## 🔄 Flujo de Checkout (Nuevo)

```
Usuario en Landing
        ↓
    Selecciona Plan
        ↓
    Completa Formulario
    (Nombre, Email, Ciudad, etc.)
        ↓
    POST /api/v1/orders
        ↓
    Orden creada (status: PENDING)
        ↓
    Simulación Checkout Stripe
        ↓
    POST /api/v1/orders/{id}/confirm-payment
        ↓
    ✅ Credenciales Generadas
    📧 Email: dojo_123@dojoflow.local
    🔐 Password: aleatorio
        ↓
    User creado en BD
        ↓
    Admin puede ver orden en listado privado
```

---

## 🛠️ Tareas Pendientes

- [ ] Integración real Stripe API (actualmente mock)
- [ ] Panel Admin UI para gestionar órdenes/dojos
- [ ] Sistema de notificaciones por email
- [ ] Rate limiting en endpoints públicos
- [ ] Tests unitarios e integración
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Documentación API OpenAPI completa
- [ ] Mobile app para alumnos

---

## 👥 Equipo

| Rol | Persona | Contacto |
|-----|---------|----------|
| Product Owner | Hugo | @IDS-HUGO |
| Lead Developer | TBD | - |
| Frontend Dev | TBD | - |
| Backend Dev | TBD | - |

---

## 📊 Estructura de Repositorios

### FRONT-DOJO-FLOW (React)
```
src/
├── pages/              # Páginas principales
│   ├── LandingPage.tsx (♻️ REDISEÑADA - B2B sales funnel)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── ...
├── components/         # Componentes reutilizables
├── styles/            # CSS profesional
├── lib/              # Utilidades (API client)
└── main.tsx          # Entrada de la app
```

### BACK-DOJO-FLOW (FastAPI)
```
app/
├── models/           # SQLAlchemy ORM
│   └── order.py (🆕 Nuevo modelo de órdenes)
├── schemas/          # Pydantic validators
│   └── order.py (🆕 Schemas de órdenes)
├── api/routes/       # Endpoints FastAPI
│   └── orders.py (🆕 6 endpoints de checkout)
├── db/              # Base de datos
├── core/            # Configuración y seguridad
└── init_db.py       # Inicialización BD
```

---

## 🔧 Verificación Rápida

### ¿Frontend corriendo?
```bash
# Terminal: npm run dev
# Navega a: http://localhost:5173
# ✅ Deberías ver: Landing page con 3 planes de precio
```

### ¿Backend corriendo?
```bash
# Terminal: uvicorn app.main:app --reload --port 8000
# Navega a: http://localhost:8000/docs
# ✅ Deberías ver: Swagger UI con todos los endpoints
```

### ¿Base de datos?
```bash
# Terminal: mysql -h localhost -u root -p dojoflow
# Comando: SELECT * FROM orders;
# ✅ Deberías ver: Tabla vacía (lista para crear órdenes)
```

---

## 🚀 Deployment

Para desplegar a producción, consulta:
- **[DATABASE_DEPLOYMENT.md](./DATABASE_DEPLOYMENT.md)** - Especificación BD
- **[TESTING.md](./TESTING.md)** - Testing checklist

Soporta:
- AWS RDS + Elastic Beanstalk
- GCP Cloud SQL + App Engine
- Azure Database for MySQL + App Service
- Heroku (simple)

---

## 📞 Soporte

- 🐛 Bugs: Abre un issue en GitHub
- 💬 Preguntas: Contacta a Hugo
- 📝 Documentación: Lee markdown files en repos

---

## 📅 Historial

| Fecha | Evento |
|-------|--------|
| **Marzo 2026** | ✅ Checkout flow implementado |
| **Marzo 2026** | ✅ Landing page rediseñada (B2B sales) |
| **Marzo 2026** | ✅ Rama `hugo` creada para colaboración |
| **Próximo** | Integración Stripe real |
| **Próximo** | Panel admin UI |

---

## 📄 Licencia

Privado - Solo para equipo DojoFlow

---

**Mantén esta rama (`hugo`) como rama principal de desarrollo. `main` es solo para releases.**

