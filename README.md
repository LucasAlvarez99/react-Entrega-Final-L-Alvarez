# Las Puertas del Olimpo 🎸

**E-commerce de entradas y merchandise para shows de rock y metal**

---

## 📋 Descripción del Proyecto

**Las Puertas del Olimpo** es una Single Page Application (SPA) de e-commerce desarrollada con React, diseñada para la venta de entradas de shows musicales y merchandise de bandas de rock y metal. El proyecto implementa patrones y conceptos específicos de React, gestión de estado global con Context API, y Firebase/Firestore como base de datos en la nube.

---

## ✨ Características Principales

### 🎯 Requisitos Obligatorios Cumplidos

#### ✅ **Listado y Detalle de Productos**
- ✅ Generación dinámica del listado de productos mediante `ItemListContainer`
- ✅ Vista detallada de cada producto con `ItemDetailContainer`
- ✅ Separación de componentes contenedores y de presentación (`ItemListContainer` → `ItemList` → `Item`)
- ✅ Componente `ItemCount` con validaciones (mínimo, stock disponible)
- ✅ ItemCount se oculta después de agregar al carrito

#### ✅ **Navegación**
- ✅ Navegación con React Router DOM entre todas las secciones
- ✅ Modelo Single Page App (sin recargas del navegador)
- ✅ Rutas implementadas:
  - `/` - Inicio (catálogo completo)
  - `/category/:categoryId` - Filtrado por categoría/banda
  - `/item/:itemId` - Detalle del producto
  - `/cart` - Carrito de compras
  - `/contacto` - Página de contacto
  - `/admin` - Panel de administración
  - `/admin/manage` - Gestión de productos

#### ✅ **Carrito de Compras**
- ✅ Context API para gestión global del estado del carrito
- ✅ Componente `Cart` con productos, cantidades, subtotales y totales
- ✅ `CartWidget` en NavBar mostrando total de unidades
- ✅ Persistencia del carrito en localStorage
- ✅ Funciones de agregar, eliminar y actualizar cantidades
- ✅ Cálculo automático de totales con service charge (10%)

#### ✅ **Firebase & Firestore**
- ✅ Base de datos Firestore implementada
- ✅ Colección `products` con todos los shows
- ✅ Colección `orders` para registrar compras
- ✅ Consultas en tiempo real desde React
- ✅ Generación de documento en Firestore al confirmar compra
- ✅ Variables de entorno para credenciales (.env)

#### ✅ **Experiencia de Usuario**
- ✅ Renderizado condicional con loaders y spinners
- ✅ Mensajes condicionales ("carrito vacío", "sin stock", "producto no encontrado")
- ✅ Confirmación de orden con ID único generado
- ✅ Pantalla de éxito después de la compra
- ✅ Email de confirmación al usuario

### 🚀 **Funcionalidades Adicionales**

#### 💎 **Panel de Administración Completo**
- ✅ Crear nuevos shows desde interfaz web
- ✅ Gestionar shows existentes (ver/eliminar)
- ✅ **Carga de imágenes desde dispositivo** (Base64)
- ✅ Sistema de seed para cargar datos de ejemplo
- ✅ Validaciones de formulario
- ✅ Vista previa de imágenes antes de guardar
- ✅ Soporte para hasta 3 imágenes por show

#### 💳 **Sistema de Pago Completo**
- ✅ Formulario de pago con múltiples métodos:
  - Tarjeta de crédito/débito
  - Transferencia bancaria
  - Efectivo
- ✅ Validación de tarjetas (Algoritmo de Luhn)
- ✅ Detección automática de tipo de tarjeta (Visa, Mastercard, Amex)
- ✅ Formateo automático de campos
- ✅ Validación de fecha de expiración
- ✅ CVV con validación

#### 🎨 **Diseño y Estilos**
- ✅ Bootstrap 5.3 + React Bootstrap
- ✅ Font Awesome para iconos
- ✅ Diseño responsive (mobile-first)
- ✅ Tema dark personalizado para navbar
- ✅ Animaciones y transiciones CSS
- ✅ Cards con hover effects
- ✅ Carrusel de imágenes en detalle de productos

#### ⚡ **Optimizaciones**
- ✅ Sistema de caché en memoria + localStorage
- ✅ Caché con duración de 1 hora
- ✅ Lazy loading de imágenes
- ✅ Fallback para imágenes rotas
- ✅ Code splitting optimizado
- ✅ Reducción de llamadas a Firestore

---

## 🛠️ Tecnologías Utilizadas

### **Core**
- ⚛️ **React 19.1.1**
- 🔥 **Firebase 12.6.0** (Firestore)
- 🧭 **React Router DOM 7.9.6**
- 🎨 **Bootstrap 5.3.8**
- 🎨 **React Bootstrap 2.10.10**

### **Herramientas de Desarrollo**
- ⚡ **Vite 7.1.7** (Build tool)
- 📦 **ESLint** (Linting)
- 🎯 **Font Awesome 7.1.0** (Iconos)
- 📊 **Vercel Speed Insights**

---

## 🚀 Instalación y Uso

### **1. Clonar el repositorio**
```bash
git clone https://github.com/LucasAlvarez99/react-Entrega-Final-L-Alvarez.git
cd react-Entrega-Final-L-Alvarez
```

### **2. Instalar dependencias**
```bash
npm install
```
### **3. Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### **4. Cargar datos de ejemplo (Opcional)**

En el panel de administración (`/admin`), haz clic en **"Cargar Datos de Ejemplo"** para poblar la base de datos con 6 shows de ejemplo.

---

## 🎯 Funcionalidades por Sección

### **🏠 Inicio**
- Listado completo de shows disponibles (Extrañamente tarda en cargar las imagenes)
- Cards con imagen, título, fecha, lugar y precio desde
- Botón "Ver Detalles" para acceder al show completo
- Lazy loading de imágenes con spinners

### **🎸 Categorías**
- Filtrado por banda/artista en el navbar
- URLs amigables (`/category/metallica`)
- Mismo diseño que el inicio pero filtrado

### **📝 Detalle de Producto**
- Carrusel de hasta 3 imágenes
- Información completa del show (artista, fecha, lugar)
- Selector de ubicación (Campo, Platea VIP, etc.)
- Componente ItemCount para seleccionar cantidad
- Agregado de merchandise adicional
- Botón "Agregar al Carrito" con validación de stock

### **🛒 Carrito**
- Lista de productos agregados con imagen
- Cantidades editables (+/-)
- Subtotales y total calculado automáticamente
- Service charge incluido (10%)
- Botón "Vaciar Carrito"
- Botón "Proceder al Pago"
- Indicadores de "Carrito Vacío"

### **💳 Checkout**
- Formulario del comprador (nombre, teléfono, email)
- Selección de método de pago
- Formulario de tarjeta con validaciones
- Confirmación con ID de orden único
- Pantalla de éxito con detalles de la compra

### **⚙️ Panel Admin**
- Crear nuevos shows
- Cargar hasta 3 imágenes desde dispositivo
- Definir espacios con precios y stock
- Agregar merchandise
- Botón "Cargar Datos de Ejemplo"

### **📊 Gestión de Shows**
- Tabla con todos los shows
- Vista previa de imágenes
- Botón "Ver" (redirige al detalle)
- Botón "Eliminar" con confirmación
- Estadísticas (total shows, categorías)

---

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

---

## 🤝 Convenciones y Buenas Prácticas

### ✅ Convenciones Cumplidas
- ✅ Nombres de componentes en PascalCase
- ✅ Nombres de funciones en camelCase
- ✅ Arquitectura de carpetas organizada
- ✅ Separación de componentes contenedores/presentacionales
- ✅ Context API para estado global
- ✅ Services para lógica de negocio
- ✅ Manejo de errores con try-catch
- ✅ Loading states y renderizado condicional
- ✅ PropTypes implícitos con TypeScript comments

---

## 🐛 Troubleshooting

### **Los shows no aparecen:**
```javascript
// En la consola del navegador:
localStorage.clear();
location.reload();

---

## 👨‍💻 Autor

**Lucas Alvarez Bernardez**

- 📧 Email: lucas.alvarez.bernardez.99@gmail.com
- 💼 LinkedIn: [lucas-alvarez-bernardez](https://www.linkedin.com/in/lucas-alvarez-bernardez/)
- 🐙 GitHub: [@LucasAlvarez99](https://github.com/LucasAlvarez99)
- 📸 Instagram: [@el_mago_lucas](https://www.instagram.com/el_mago_lucas/)

---

## 📄 Licencia

Este proyecto fue desarrollado como **Proyecto Final** del curso de **React JS** en **CoderHouse** (Comisión 81725).

---

## 🙏 Agradecimientos

- **CoderHouse** por el curso de React JS
- **Firebase** por la plataforma en la nube
- **Bootstrap** por los componentes UI
- **Vercel** por el hosting gratuito
- **Font Awesome** por los iconos

---

## 📌 Notas Finales

### **Estado del Proyecto: ✅ COMPLETO**

Todos los requisitos obligatorios del proyecto final han sido implementados y probados. Funcionalidades adicionales como el panel de administración completo, sistema de pago, y carga de imágenes desde dispositivo fueron agregadas para enriquecer la experiencia del usuario.

---

⭐ **Si te gustó el proyecto, ¡dale una estrella en GitHub! (pa ayudarme a conseguir trabajo)** ⭐