# [NOMBRE DE LA TIENDA] – E-commerce SPA

SPA de e-commerce con dos roles (cliente y administrador), desarrollada con React 18, TypeScript y Vite. Usa Firebase (Auth + Firestore), AWS S3 para imágenes y Vercel para el deploy y las funciones serverless.

🔗 **URL en producción:** [COMPLETAR]
📦 **Repositorio:** [COMPLETAR]

---

## 1. Funcionalidades

**Clientes**
- Registro e inicio de sesión (email/password y/o Google), persistencia de sesión
- Catálogo con filtro por categoría, búsqueda con debounce y detalle de producto
- Carrito (agregar, eliminar, actualizar cantidad, total automático)
- Checkout con pago simulado, historial de órdenes y detalle

**Administradores**
- Panel protegido con layout propio
- CRUD de productos con subida de imágenes a S3
- Listado de órdenes, filtro por estado y cambio de estado

---

## 2. Tech stack

| Área | Tecnología |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router, TailwindCSS, Context API |
| Backend / servicios | Firebase Auth, Firestore, AWS S3, Vercel Serverless Functions |
| Testing | Vitest, React Testing Library |
| Deploy | Vercel + GitHub (CI/CD) |

---

## 3. Arquitectura

### 3.1 Estructura de carpetas
```
[COMPLETAR con la estructura real del proyecto]
```

### 3.2 Modelo de datos (Firestore)
```
users/{uid}        → { email, displayName, role: 'customer' | 'admin', createdAt }
products/{id}      → { name, description, price, category, imageUrl, stock, createdAt }
orders/{id}        → { userId, items[], total, status, createdAt }
[AJUSTAR según lo que realmente implementes]
```

### 3.3 Flujo de comunicación
[COMPLETAR: pegar diagrama o describir cómo se comunican frontend, Firebase, función serverless y S3]

### 3.4 Decisiones de diseño
- **Estado global:** [COMPLETAR: por qué Context + useReducer]
- **Roles:** [COMPLETAR: dónde se guarda el rol y cómo se valida]
- **Subida de imágenes:** [COMPLETAR: URL prefirmada de S3 generada en una función serverless, por qué]

---

## 4. Instalación y ejecución local

```bash
git clone [URL]
cd [carpeta]
npm install
cp .env.example .env     # completar con tus propios valores
npm run dev
```

### Variables de entorno

Ver `.env.example`. **Nunca** se suben valores reales al repositorio.

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Frontend | [COMPLETAR] |
| `VITE_FIREBASE_AUTH_DOMAIN` | Frontend | [COMPLETAR] |
| `VITE_FIREBASE_PROJECT_ID` | Frontend | [COMPLETAR] |
| `VITE_FIREBASE_STORAGE_BUCKET` | Frontend | [COMPLETAR] |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Frontend | [COMPLETAR] |
| `VITE_FIREBASE_APP_ID` | Frontend | [COMPLETAR] |
| `AWS_ACCESS_KEY_ID` | Solo Vercel Functions | Credencial de AWS (backend) |
| `AWS_SECRET_ACCESS_KEY` | Solo Vercel Functions | Credencial de AWS (backend) |
| `AWS_REGION` | Solo Vercel Functions | [COMPLETAR] |
| `AWS_S3_BUCKET` | Solo Vercel Functions | [COMPLETAR] |

> Las variables con prefijo `VITE_` quedan expuestas en el bundle del navegador. Por eso las credenciales de AWS no llevan ese prefijo y viven únicamente en el backend serverless.

---

## 5. Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |
| `npm run test` | Ejecuta los tests con Vitest |
| `npm run test -- --coverage` | Tests con cobertura |

---

## 6. Testing

- **Wrapper de providers** para componentes que dependen de varios contexts
- **Hooks:** `useCart` y `useAuth` con `renderHook`
- **Reducer:** `cartReducer`, una prueba por cada action
- **Integración:** flujo agregar al carrito → checkout
- **Mocks:** Firebase y AWS SDK (los tests no dependen de servicios externos)

**Resultado de cobertura:** [COMPLETAR con captura o porcentaje]

---

## 7. Seguridad

- [ ] `.env` en `.gitignore` y `.env.example` sin valores reales
- [ ] Credenciales de AWS solo en Vercel Functions
- [ ] Reglas de seguridad de Firestore por rol
- [ ] Rutas protegidas por rol en el frontend
- [ ] Revisé el historial de commits para confirmar que no hay secretos

**Reglas de Firestore:**
```
[COMPLETAR: pegar las reglas finales]
```

---

## 8. Deploy

- Plataforma: Vercel, con integración continua desde GitHub
- Variables de entorno configuradas en el panel de Vercel
- Verificación en producción: [COMPLETAR: lista de flujos probados]

---

## 9. Bitácora de uso de IA

Durante el proyecto usé herramientas de IA para planificar, validar decisiones, revisar código, generar tests y resolver problemas. Las entradas siguientes documentan momentos concretos, incluyendo correcciones cuando la IA se equivocó o tuve que ajustar su respuesta.

| # | Fase | Tema | Herramienta |
|---|---|---|---|
| 1 | [COMPLETAR] | Decisión de arquitectura | [COMPLETAR] |
| 2 | [COMPLETAR] | Code review | [COMPLETAR] |
| 3 | [COMPLETAR] | Generación de tests | [COMPLETAR] |
| 4 | [COMPLETAR] | Resolución de un bug | [COMPLETAR] |
| 5 | [COMPLETAR] | Validación de seguridad | [COMPLETAR] |

---

###Título: Decisión de arquitectura y modelo de datos

Fecha: [COMPLETAR]
Herramienta de IA: ChatGPT
Fase / contexto: Planificación inicial del e-commerce.
Prompt que usé: [COMPLETAR]
Qué respondió la IA: Se analizaron arquitectura, roles, colecciones de Firestore y separación entre UI, Context, services y tipos.
Decisión que tomé: [COMPLETAR]
Qué aprendí: [COMPLETAR con tus palabras]
Cómo lo verifiqué: [COMPLETAR]
Correcciones: Inicialmente consideré separar el login de customer/admin y ubicar las órdenes dentro de cada usuario. Después entendí que una autenticación única con roles y una colección raíz orders se adapta mejor a los requisitos.

---

### Entrada 2: [título corto]
- **Fecha:**
- **Herramienta de IA:**
- **Fase / contexto:**
- **Prompt que usé:**
- **Qué respondió la IA:**
- **Decisión que tomé:**
- **Qué aprendí:**
- **Cómo lo verifiqué:**
- **Correcciones:**

---

### Entrada 3: [título corto]
- **Fecha:**
- **Herramienta de IA:**
- **Fase / contexto:**
- **Prompt que usé:**
- **Qué respondió la IA:**
- **Decisión que tomé:**
- **Qué aprendí:**
- **Cómo lo verifiqué:**
- **Correcciones:**

---

### Entrada 4: [título corto]
- **Fecha:**
- **Herramienta de IA:**
- **Fase / contexto:**
- **Prompt que usé:**
- **Qué respondió la IA:**
- **Decisión que tomé:**
- **Qué aprendí:**
- **Cómo lo verifiqué:**
- **Correcciones:**

---

### Entrada 5: [título corto]
- **Fecha:**
- **Herramienta de IA:**
- **Fase / contexto:**
- **Prompt que usé:**
- **Qué respondió la IA:**
- **Decisión que tomé:**
- **Qué aprendí:**
- **Cómo lo verifiqué:**
- **Correcciones:**

---

### Reflexión final sobre el uso de la IA
[COMPLETAR: qué me ayudó más, en qué me equivoqué yo o se equivocó la IA, qué haría distinto, y qué concepto siento que ahora puedo explicar sin ayuda]

---

## 10. Mejoras futuras / Extra credit
- [COMPLETAR]

## 11. Autor
[TU NOMBRE] – [CONTACTO / GITHUB]