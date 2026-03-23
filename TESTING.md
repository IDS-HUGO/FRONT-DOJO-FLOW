# DojoFlow - Guía de Pruebas del Flujo de Checkout

## 1. Ambiente Requerido

- **Frontend**: Corriendo en `http://localhost:5173` (npm run dev)
- **Backend API**: Corriendo en `http://localhost:8000` (uvicorn)
- **MySQL**: Corriendo en `localhost:3306` (usuario: root, contraseña: root)

## 2. Flujo de Checkout End-to-End

### Paso 1: Acceder a Landing Page
```
URL: http://localhost:5173
Resultado esperado:
- Página profesional con hero section
- 3 tarjetas de planes visibles (Blanco $0, Negro $520, Maestro $870)
- Botón "Comienza ahora" en cada tarjeta
```

### Paso 2: Hacer Click en Plan
```
Acción: Click en "Comienza ahora" del Plan Negro
Resultado esperado:
- Modal con formulario PurchaseForm aparece
- Campos visibles: dojo_name, owner_name, owner_email, owner_phone, city, timezone
- Botón "Proceder al pago" al final del formulario
```

### Paso 3: Llenar Formulario
```
Completar con datos de prueba:
- Dojo Name: "Academia de Karate Test"
- Owner Name: "Juan Pérez"
- Owner Email: "juan@gmail.com"
- Owner Phone: "+52-5555555555"
- City: "Mexico City"
- Timezone: "America/Mexico_City"
```

### Paso 4: Enviar Formulario
```
Acción: Click en "Proceder al pago"
Resultado esperado:
- POST request a /api/v1/orders con plan_id=2 (Plan Negro)
- Respuesta: {"order_id": 1, "status": "pending", ...}
- Modal se cierra y muestra mensaje de éxito
```

### Paso 5: Verificar Orden en BD
```bash
# Conectar a MySQL
mysql -h localhost -u root -p
# Usar BD
use dojoflow;
# Listar órdenes
SELECT * FROM orders WHERE owner_email='juan@gmail.com';
```

Resultado esperado:
```
id: 1
plan_id: 2
dojo_name: Academia de Karate Test
owner_email: juan@gmail.com
status: pending
amount: 520
created_at: 2024-03-22 12:34:56
```

## 3. Flujo de Pago Confirmado (Demo)

### Paso 1: Acceder a endpoint de confirmación
```bash
# En terminal o Postman
curl -X POST http://localhost:8000/api/v1/orders/1/confirm-payment \
  -H "Content-Type: application/json"
```

Respuesta esperada:
```json
{
  "order_id": 1,
  "status": "paid",
  "generated_email": "dojo_1@dojoflow.local",
  "generated_password": "Tt9kL#m5Qx@2nP"
}
```

### Paso 2: Verificar Orden Actualizada
```sql
SELECT * FROM orders WHERE id=1;
```

Resultado esperado:
- `status`: "paid"
- `paid_at`: timestamp actual
- `generated_email`: "dojo_1@dojoflow.local"
- `generated_password`: (hashed en BD, visible en respuesta API)
- `credentials_sent_at`: timestamp actual

### Paso 3: Verificar Usuario Creado
```sql
SELECT * FROM users WHERE email='dojo_1@dojoflow.local';
```

Resultado esperado:
- `email`: "dojo_1@dojoflow.local"
- `is_active`: true
- `hashed_password`: bcrypt hash

## 4. Flujo de Login Con Credenciales Generadas

### Paso 1: Acceder a Login
```
URL: http://localhost:5173/login
```

### Paso 2: Ingresar Credenciales Generadas
```
Email: dojo_1@dojoflow.local
Password: Tt9kL#m5Qx@2nP  (la que fue retornada en payload)
```

### Paso 3: Click en "Ingresar"
```
Resultado esperado:
- POST request a /api/v1/auth/login
- Respuesta contiene JWT token
- Sesión iniciada, usuario redirigido a Dashboard
```

## 5. Endpoints Admin Para Testing

### Listar Todas las Órdenes (Admin Only)
```bash
# Requiere ser autenticado como owner@dojoflow.com
curl -X GET http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer <token>"
```

Respuesta esperada:
```json
{
  "status": "success",
  "data": [
    {
      "order_id": 1,
      "plan_id": 2,
      "dojo_name": "Academia de Karate Test",
      "owner_email": "juan@gmail.com",
      "status": "paid",
      "amount": 520
    }
  ]
}
```

### Obtener Orden Específica
```bash
curl -X GET http://localhost:8000/api/v1/orders/1
```

Respuesta esperada:
```json
{
  "order_id": 1,
  "status": "paid",
  "dojo_name": "Academia de Karate Test",
  "plan_id": 2,
  "amount": 520,
  "paid_at": "2024-03-22T12:35:10"
}
```

### Rastrear Orden por Email
```bash
curl -X GET "http://localhost:8000/api/v1/orders/status/juan@gmail.com"
```

Respuesta esperada:
```json
{
  "order_id": 1,
  "email": "juan@gmail.com",
  "status": "paid",
  "generated_email": "dojo_1@dojoflow.local"
}
```

## 6. Casos de Error a Validar

### Error 1: Email Duplicado
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 2, "dojo_name": "Test 2", "owner_name": "Juan", "owner_email": "juan@gmail.com", ...}'
```

Resultado esperado:
```json
{
  "detail": "Email already has an order"
}
```

### Error 2: Plan No Existe
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 999, "dojo_name": "Test", "owner_name": "Juan", "owner_email": "newemail@gmail.com", ...}'
```

Resultado esperado:
```json
{
  "detail": "Plan not found"
}
```

### Error 3: Confirmación de Pago en Orden Inexistente
```bash
curl -X POST http://localhost:8000/api/v1/orders/9999/confirm-payment
```

Resultado esperado:
```json
{
  "detail": "Order not found"
}
```

## 7. Campos del Formulario PurchaseForm

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|-----------|
| plan_id | int | Sí | Debe existir Plan con este ID |
| dojo_name | string(255) | Sí | No vacío |
| owner_name | string(255) | Sí | No vacío |
| owner_email | email | Sí | Formato email válido, único en órdenes |
| owner_phone | string(50) | Sí | No vacío |
| city | string(120) | Sí | No vacío |
| timezone | string(80) | No | Default: "America/Mexico_City" |
| currency | string(10) | No | Default: "MXN" |

## 8. Datos de Planes Para Testing

```sql
SELECT * FROM plans;
```

Resultado esperado:
```
id: 1, name: "Plan Blanco", price: 0
id: 2, name: "Plan Negro", price: 520
id: 3, name: "Plan Maestro", price: 870
```

## 9. Checklist de Pruebas

- [ ] Landing page carga sin errores
- [ ] Modal PurchaseForm abre al clickear plan
- [ ] Formulario valida campos requeridos
- [ ] POST /orders crea orden con estado PENDING
- [ ] Orden se guarda correctamente en MySQL
- [ ] POST /confirm-payment marca orden como PAID
- [ ] Credenciales se generan automáticamente
- [ ] Usuario se crea automáticamente en tabla users
- [ ] Email duplicado retorna error 400
- [ ] Plan no existente retorna error 404
- [ ] GET /orders retorna lista de órdenes (admin)
- [ ] GET /orders/{id} retorna orden específica
- [ ] GET /orders/status/{email} rastrea por email
- [ ] Login funciona con credenciales generadas
- [ ] Mensajes de error se muestran correctamente en UI

## 10. Notas para QA

- **Ambiente Local**: Todos los datos persistidos en MySQL local
- **Credenciales de Admin**: owner@dojoflow.com / admin123
- **Base de Datos de Test**: dojoflow (recreada cada vez que se corre init_db.py)
- **Stripe Integration**: Actualmente mocked (responde con checkout_url fake)
- **Rate Limiting**: No configurado en desarrollo (habilitar en producción)

---

**Última actualización**: Marzo 22, 2024  
**Estado**: Flujo completo funcional, listo para E2E testing
