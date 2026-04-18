# Manual para principiantes 0 - DojoFlow Frontend

Este archivo explica, en modo muy simple, como se usa el frontend web de DojoFlow y que hace cada parte.

## 1. Que es este frontend

DojoFlow Frontend es la aplicacion web hecha en React + Vite. Sirve para tres cosas principales:

- Mostrar la pagina publica del producto.
- Entrar al panel del dojo con usuarios de staff o dueño.
- Entrar al portal del alumno.

Este frontend necesita la API corriendo aparte para funcionar de verdad.

## 2. Lo que debes tener abierto antes de probar

1. La API en `http://localhost:8000`.
2. El frontend en `http://localhost:5173` o el puerto que te marque Vite.
3. La base de datos inicializada con los datos semilla.

Si no arrancas la API, el frontend cargara la pantalla pero fallara en login, pagos y consultas.

## 3. Credenciales de prueba

### Administrador principal

- Usuario: `owner@dojoflow.com`
- Contraseña: `admin123`

Este usuario es el unico que puede entrar al panel de administracion global en `/admin`.

### Dojo de ejemplo

- Usuario: `dojo_1@dojoflow.local`
- Contraseña: `dojo1234`

Este usuario sirve para probar el panel operativo del dojo en `/app`.

### Alumno

No hay un alumno semilla fijo en el seed inicial. Para entrar al portal de alumno en `/student`, primero tienes que crear un alumno desde la API o desde el modulo de alumnos con un usuario valido.

## 4. Flujo completo desde cero

### Paso 1. Abre la pagina publica

Entra a `/`.

Ahí veras:

- La presentacion general del producto.
- Los planes disponibles.
- El boton para ir al login.
- El formulario de compra inicial.

### Paso 2. Si eres dueño o staff, entra al login

Entra a `/login`.

El formulario ya trae precargado:

- Usuario: `owner@dojoflow.com`
- Contraseña: `admin123`

Cuando inicias sesion:

- Si el usuario pertenece a un alumno, te manda a `/student`.
- Si el correo es `owner@dojoflow.com`, te manda a `/admin`.
- Cualquier otro usuario staff va a `/app`.

### Paso 3. Si eres alumno, usa el portal de alumno

Entra a `/student/login` y luego a `/student`.

Desde ahi puedes:

- Ver tus pagos.
- Pagar mensualidades con PayPal.
- Cambiar tu contraseña.
- Revisar tu correo registrado.

### Paso 4. Si eres dueño del dojo, usa el panel operativo

Entra a `/app`.

Ese panel requiere:

- Token valido en el navegador.
- Que no seas usuario tipo `student`.

### Paso 5. Si eres administrador global, usa el admin

Entra a `/admin`.

Ese panel solo acepta el correo `owner@dojoflow.com`.

## 5. Que hace cada pantalla

### `/` - LandingPage

Es la pagina publica.

Sirve para:

- Ver el producto.
- Elegir un plan.
- Abrir el formulario de compra del dojo.
- Ir al login.

El formulario publica crea una orden en la API con datos del dojo.

### `/login` - LoginPage

Es la entrada principal del sistema.

Sirve para:

- Entrar como staff.
- Entrar como administrador principal.
- Redirigir automaticamente segun el tipo de cuenta.

Tambien da acceso a:

- Recuperar contraseña.
- Ir al login de alumno.

### `/forgot-password`

Pides un enlace para recuperar la contraseña.

### `/reset-password`

Usas el token recibido por correo para crear una nueva contraseña.

### `/student/login` y `/student`

Es el acceso del alumno.

Desde el portal el alumno puede:

- Ver su nombre y correo.
- Ver total pagado.
- Ver pagos pendientes.
- Hacer un pago con PayPal.
- Cambiar su contraseña.

### `/admin`

Es el panel global del sistema.

Ahí el admin ve:

- Total de ordenes.
- Ordenes pendientes.
- Ordenes pagadas.
- Ordenes completadas.
- Ingresos totales.
- Usuarios activos.
- Tabla de ordenes.

### `/app`

Es el panel operativo del dojo.

Incluye:

- Dashboard.
- Alumnos.
- Asistencias.
- Pagos.
- Cinturones y examenes.
- Planes.
- Marketplace.
- Instructores.
- Horarios.
- Cupones.
- Reportes.
- Configuracion.

### `/register`

No es un registro publico normal.

En este proyecto esta reservado para el owner y redirige a configuracion.

## 6. Que hace cada modulo del panel `/app`

### Dashboard

Muestra indicadores generales de la operacion del dojo.

### Students

Sirve para administrar alumnos:

- Crear.
- Buscar.
- Filtrar.
- Revisar listado.

### Attendance

Sirve para registrar asistencia y ver el historial.

### Payments

Sirve para revisar pagos por alumno, metodo y estado.

### Belts

Sirve para controlar grados, examenes y avances.

### Plans

Sirve para ver los planes SaaS y contratarlos por PayPal.

### Marketplace

Sirve para administrar productos del dojo.

### Teachers

Sirve para crear y editar instructores.

### Schedules

Sirve para crear horarios de clase y asignar instructor.

### Coupons

Sirve para crear codigos de descuento y controlar vigencia/uso.

### Reports

Sirve para ver graficas y resumentes de negocio.

### Settings

Sirve para cambiar los datos de la academia.

## 7. Que datos guarda el navegador

El frontend usa `localStorage` para recordar la sesion.

Guarda estas claves:

- `dojo_token`
- `dojo_user_email`
- `dojo_account_type`
- `dojo_student_id`

Si borras el almacenamiento del navegador, tendras que volver a iniciar sesion.

## 8. Flujo real de compra

### Compra del plan

1. El usuario abre la pagina publica.
2. Selecciona un plan.
3. Completa los datos del dojo.
4. El frontend envia la orden a la API.
5. La API devuelve el numero de orden y la referencia.
6. El frontend muestra el resultado y deja listo el pago.

### Pago de suscripcion desde `/app/plans`

1. El staff ve los planes.
2. Elige uno.
3. La app pide checkout a la API.
4. La API crea una orden en PayPal.
5. El navegador va al checkout de PayPal.
6. Al volver, la app valida la respuesta con la API.

### Pago de mensualidad desde `/student`

1. El alumno escribe un monto.
2. La app pide checkout a la API.
3. La API crea el pago y la orden de PayPal.
4. El navegador va al checkout.
5. Al volver, el portal verifica si fue aprobado.

## 9. Flujo de recuperacion de contraseña

### Olvide mi contraseña

1. Abres `/forgot-password`.
2. Escribes tu correo.
3. La API intenta mandar un correo con enlace.
4. Si el correo existe, el sistema responde de forma segura.

### Reset de contraseña

1. Abres el enlace recibido.
2. El frontend carga `/reset-password`.
3. Escribes la nueva contraseña.
4. La API la guarda con hash.

### Cambio de contraseña dentro del portal del alumno

1. El alumno entra a `/student`.
2. Va al formulario de seguridad.
3. Escribe contraseña actual y nueva.
4. La API valida y actualiza.

## 10. Cosas importantes que debes saber

- El admin global solo es `owner@dojoflow.com`.
- El portal de alumno no funciona con cualquier cuenta staff.
- Si la API no esta encendida, veras errores al hacer login o pagos.
- El frontend no contiene la logica real de negocio; solo la muestra y la llama a la API.
- El sistema esta pensado para trabajar en español y en MXN.

## 11. Orden recomendado para probar todo

1. Arranca la API.
2. Arranca el frontend.
3. Entra con `owner@dojoflow.com` y `admin123`.
4. Revisa `/admin`.
5. Entra a `/app` y recorre los modulos.
6. Crea un alumno desde la API.
7. Inicia sesion como alumno.
8. Prueba `/student` y el flujo de pago.

## 12. Si algo no te cuadra

- Si el login falla, revisa que la API este corriendo.
- Si PayPal falla, revisa las credenciales y el `.env` de la API.
- Si no ves datos, corre el seed otra vez con la API.
- Si el navegador sigue mandandote a login, borra `localStorage` y vuelve a entrar.
