# 🚀 DojoFlow - Guía de Setup para Colaboradores

## Estado Actual del Proyecto
✅ **Sistema B2B Checkout completamente funcional**
- Landing page rediseñada con flujo de compra profesional
- Backend con API de órdenes/pedidos
- Base de datos MySQL con tabla de órdenes
- Generación automática de credenciales tras pago

---

## 🛠️ Requisitos Previos

Antes de empezar, asegúrate de tener instalado en tu máquina:

1. **Node.js 18+** (incluye npm)
   ```bash
   node --version  # Verifica la versión
   npm --version
   ```

2. **Python 3.10+**
   ```bash
   python --version
   ```

3. **MySQL 8.0+** (corriendo localmente o en cloud)
   ```bash
   mysql --version
   ```

4. **Git**
   ```bash
   git --version
   ```

---

## 📋 Clonar Repositorios

### Frontend (React + Vite + TypeScript)
```bash
git clone https://github.com/IDS-HUGO/FRONT-DOJO-FLOW.git
cd FRONT-DOJO-FLOW
git checkout hugo  # Rama principal de colaboración
```

### Backend (FastAPI + SQLAlchemy)
```bash
git clone https://github.com/IDS-HUGO/BACK-DOJO-FLOW.git
cd BACK-DOJO-FLOW
git checkout hugo  # Rama principal de colaboración
```

---

## ⚙️ Setup Backend (API)

### 1. Crear Entorno Virtual Python
```bash
cd BACK-DOJO-FLOW
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno
Crea archivo `.env` en la raíz:
```
# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=dojoflow

# App Config
SECRET_KEY=change_this_secret_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# API
APP_NAME=DojoFlow API
```

### 4. Inicializar Base de Datos
```bash
python -m app.init_db
# Esto crea todas las tablas: users, orders, plans, students, etc.
```

### 5. Iniciar Servidor API
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Output esperado:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 📍 Endpoints Principales
- `GET /health` - Health check
- `POST /api/v1/orders` - Crear orden de compra
- `GET /api/v1/orders` - Listar órdenes (admin)
- `POST /api/v1/orders/{id}/confirm-payment` - Confirmar pago
- Docs interactiva: `http://localhost:8000/docs` (Swagger UI)

---

## 🎨 Setup Frontend (React)

### 1. Instalar Dependencias
```bash
cd FRONT-DOJO-FLOW
npm install
```

### 2. Iniciar Servidor Desarrollo
```bash
npm run dev
```

**Output esperado:**
```
VITE v6.4.1  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Si puerto 5173 está ocupado, Vite usa 5174 automáticamente.

### 🔗 Variables de Entorno Frontend
No requiere .env, pero verifica en `src/lib/api.ts`:
```typescript
const API_BASE_URL = "http://localhost:8000/api/v1";
```

---

## ✅ Verificar que Todo Funcione

### 1. Backend Health Check
Navega a: `http://localhost:8000/health`

**Respuesta esperada:**
```json
{
  "status": "ok",
  "service": "DojoFlow API"
}
```

### 2. Swagger API Docs
Navega a: `http://localhost:8000/docs`
- Verás todos los endpoints
- Puedes probarlos desde el navegador

### 3. Frontend Landing Page
Navega a: `http://localhost:5173` (o 5174)

**Deberías ver:**
- Navbar con Logo + Ingresar
- Hero section "Profesionaliza tu Academia"
- Grid de 3 planes (Blanco, Negro, Maestro)
- Modal de compra al hacer click en "Comienza ahora"

### 4. Prueba Flujo Checkout (E2E)
1. Click en botón "Comienza ahora" en cualquier plan
2. Rellena formulario:
   - Nombre Dojo: "Mi Academia"
   - Nombre Propietario: "Juan Pérez"
   - Email: "juan@example.com"
   - Teléfono: "+52 5512345678"
   - Ciudad: "CDMX"
3. Click "Proceder al Pago"
4. Deberías ver: "Orden creada exitosamente" (mock)

---

## 📁 Estructura de Carpetas

### Frontend (`FRONT-DOJO-FLOW/`)
```
src/
├── pages/              # Páginas principales
│   ├── LandingPage.tsx     # ← Landing B2B (contiene PurchaseForm)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── ...
├── components/         # Componentes reutilizables
├── styles/            # CSS global
│   ├── landing-new.css     # ← Estilos profesionales landing
│   └── ...
├── lib/              # Utilidades
│   └── api.ts        # Cliente HTTP (fetch)
└── main.tsx          # Entrada de la app
```

### Backend (`BACK-DOJO-FLOW/`)
```
app/
├── models/           # SQLAlchemy ORM
│   ├── order.py          # ← Modelo Order (NEW)
│   ├── user.py
│   ├── plan.py
│   └── ...
├── schemas/          # Pydantic validators
│   ├── order.py          # ← Schemas Order (NEW)
│   └── ...
├── api/
│   └── routes/
│       ├── orders.py         # ← Endpoints Order (NEW)
│       ├── auth.py
│       ├── students.py
│       └── ...
├── db/
│   ├── session.py
│   └── base.py
├── core/
│   ├── config.py     # Variables de entorno
│   └── security.py   # Hashing JWT
└── init_db.py        # Script para crear tablas
```

---

## 🔄 Workflow Git para Colaboradores

### Crear Rama Feature
```bash
# Desde la rama hugo
git checkout hugo
git pull origin hugo

# Crear rama feature
git checkout -b feature/nombre-feature
```

### Hacer Cambios
```bash
# Editar archivos...

# Commit frecuente
git add .
git commit -m "feat: descripción breve del cambio"
```

### Push y Pull Request
```bash
git push origin feature/nombre-feature
```

Luego en GitHub:
1. Ve a tu fork
2. Haz click en "Create Pull Request"
3. Selecciona rama base: `hugo`
4. Describe los cambios
5. Solicita revisión a otros colaboradores

### Merge
Solo el admin (Hugo) aprueba y mergea a `hugo` (rama principal).

---

## 🐛 Solución de Problemas

### "Cannot find module" en Backend
```bash
# Verifica que venv está activado
python -m pip list | grep SQLAlchemy
# Si no está, reinstala:
pip install -r requirements.txt
```

### "Module not found" en Frontend
```bash
# Limpia node_modules y reinstala
rm -r node_modules
npm install
```

### "Port 8000 already in use"
```bash
# Usa otro puerto
uvicorn app.main:app --reload --port 8001
# Actualiza CORS_ORIGINS en .env a http://localhost:5173
```

### MySQL connection refused
```bash
# Verifica que MySQL está corriendo
# En Windows: Services > MySQL80 > Start
# En Mac: mysql.server start
# En Linux: sudo systemctl start mysql

# Prueba conexión
mysql -h localhost -u root -p
```

### Login no funciona
```bash
# Usuario default para testing:
# Email: owner@dojoflow.com
# Password: admin123
# (Creado automáticamente en init_db.py)
```

---

## 📚 Documentación Interna

- **[DATABASE_DEPLOYMENT.md](./DATABASE_DEPLOYMENT.md)** - Especificación BD para producción
- **[TESTING.md](./TESTING.md)** - Guía de testing E2E
- **[README.md](./README.md)** - Overview del proyecto

---

## 🎯 Próximos Pasos (Tareas Abiertas)

- [ ] Integración Stripe (endpoints mock listos)
- [ ] Panel admin para gestionar dojos/órdenes
- [ ] Sistema de notificaciones por email
- [ ] Rate limiting en endpoints públicos
- [ ] Tests unitarios e integración
- [ ] CI/CD pipeline (GitHub Actions)

---

## 💬 Preguntas / Soporte

Si tienes problemas:
1. Verifica que sigues los pasos de setup exactamente
2. Revisa archivo `.env` está configurado correctamente
3. Confirma que MySQL está corriendo
4. Revisa logs de uvicorn/frontend en terminal
5. Abre un issue en GitHub o contacta a Hugo

---

**Última actualización:** Marzo 22, 2026  
**Rama de colaboración:** `hugo`  
**Rama de producción:** `main`
