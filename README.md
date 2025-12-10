# Las Puertas del Olimpo 🎸

E-commerce de entradas y merchandise para shows de rock y metal.

## 🚀 Descripción

Aplicación web desarrollada con React para la venta de entradas de shows musicales y merchandise. Los usuarios pueden navegar por diferentes shows, seleccionar ubicaciones, agregar productos al carrito y finalizar la compra.

## 📋 Características

- ✅ Catálogo de shows con múltiples espacios/ubicaciones
- ✅ Sistema de carrito de compras persistente
- ✅ Filtrado por categorías (artistas/bandas)
- ✅ Vista detallada de cada show
- ✅ Gestión de stock en tiempo real
- ✅ Sistema de checkout con formulario de comprador
- ✅ Generación de órdenes de compra en Firebase
- ✅ Panel de administración para crear shows
- ✅ Responsive design (mobile-first)

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework principal
- **React Router DOM** - Navegación entre páginas
- **React Bootstrap** - Componentes UI
- **Firebase Firestore** - Base de datos NoSQL
- **Vite** - Build tool y dev server
- **Context API** - Manejo de estado global del carrito

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git https://github.com/LucasAlvarez99/react-Entrega-Final-L-Alvarez.git
cd react-Entrega-Final-L-Alvarez
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
   
   a. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   
   b. Habilita Firestore Database
   
   c. Copia tus credenciales de Firebase
   
   d. Edita `src/services/firebase.js` y reemplaza las credenciales:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_PROJECT_ID.firebaseapp.com",
     projectId: "TU_PROJECT_ID",
     storageBucket: "TU_PROJECT_ID.appspot.com",
     messagingSenderId: "TU_MESSAGING_SENDER_ID",
     appId: "TU_APP_ID"
   };
   ```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

## 🔥 Configuración de Firebase

### Reglas de Firestore (para desarrollo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read: if true;
      allow write: if true;
    }
    match /orders/{document} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Para producción, debes implementar reglas de seguridad apropiadas.


## 🎯 Funcionalidades Principales

### 1. Navegación
- Página principal con listado de shows
- Filtrado por categorías (bandas)
- Vista detallada de cada show

### 2. Carrito de Compras
- Agregar/quitar productos
- Modificar cantidades
- Persistencia en Context API
- Cálculo automático de totales

### 3. Checkout
- Formulario de datos del comprador
- Validación de email
- Creación de orden en Firestore
- Generación de ID único de compra

### 4. Panel de Administración
- Crear nuevos shows
- Definir múltiples espacios con precios
- Agregar merchandise
- Cargar hasta 3 imágenes por show

## 🎨 Diseño

El proyecto utiliza:
- **Bootstrap 5.3** para componentes UI
- **React Bootstrap** para integración con React
- **Font Awesome** para iconos
- Paleta de colores personalizada (azul/verde/gris)

## 📱 Responsive Design

La aplicación es totalmente responsive y se adapta a:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 992px)
- 💻 Desktop (> 992px)

## 🔐 Variables de Entorno (Opcional)

Para mayor seguridad, puedes usar variables de entorno:

1. Crea un archivo `.env` en la raíz:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

2. Actualiza `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... resto de configuración
};
```

## 🚀 Deploy

### Opción 1: Vercel
```bash
npm run build
# Sube la carpeta /dist a Vercel
```

### Opción 2: Netlify
```bash
npm run build
# Conecta tu repo con Netlify
```

### Opción 3: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Genera build de producción
npm run preview  # Preview del build
npm run lint     # Ejecuta ESLint
```

## 👨‍💻 Autor

**[Tu Nombre]**
- GitHub: [@LucasAlvarez99](https://github.com/LucasAlvarez99)
- Email: lucas.alvarez.bernardez.99@gmail.com

## 📄 Licencia

Este proyecto fue desarrollado como parte del curso de React JS en CoderHouse.

## 🙏 Agradecimientos

- CoderHouse por el curso de React JS
- Firebase por la plataforma
- Bootstrap por los componentes UI

---

⭐ Si te gustó el proyecto, ¡dale una estrella en GitHub!