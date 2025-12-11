import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "products";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Cache en memoria
let productsCache = {
  data: null,
  timestamp: null
};

// Verificar si el cache es válido
const isCacheValid = () => {
  if (!productsCache.data || !productsCache.timestamp) return false;
  return Date.now() - productsCache.timestamp < CACHE_DURATION;
};

// Obtener todos los productos (con cache)
export const getProducts = async (useCache = true) => {
  try {
    // Usar cache si está disponible y es válido
    if (useCache && isCacheValid()) {
      console.log("📦 Usando productos desde cache");
      return productsCache.data;
    }

    console.log("🔄 Obteniendo productos desde Firestore...");
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Actualizar cache
    productsCache = {
      data: products,
      timestamp: Date.now()
    };
    
    console.log(`✅ ${products.length} productos obtenidos`);
    return products;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    // Si hay cache, devolverlo aunque esté expirado
    if (productsCache.data) {
      console.log("⚠️ Usando cache expirado por error");
      return productsCache.data;
    }
    return [];
  }
};

// Obtener productos por categoría (con cache)
export const getProductsByCategory = async (categoryId) => {
  try {
    // Intentar obtener del cache primero
    if (isCacheValid()) {
      const filtered = productsCache.data.filter(p => p.category === categoryId);
      if (filtered.length > 0) {
        console.log(`📦 Categoría "${categoryId}" desde cache`);
        return filtered;
      }
    }

    console.log(`🔄 Obteniendo categoría "${categoryId}" desde Firestore...`);
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(
      productsRef, 
      where("category", "==", categoryId),
      orderBy("date", "asc")
    );
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ ${products.length} productos en categoría "${categoryId}"`);
    return products;
  } catch (error) {
    console.error("❌ Error al obtener productos por categoría:", error);
    return [];
  }
};

// Obtener un producto por ID (con cache)
export const getProductById = async (id) => {
  try {
    // Buscar en cache primero
    if (isCacheValid()) {
      const cached = productsCache.data.find(p => p.id === id);
      if (cached) {
        console.log(`📦 Producto ${id} desde cache`);
        return cached;
      }
    }

    console.log(`🔄 Obteniendo producto ${id} desde Firestore...`);
    const productRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(productRef);
    
    if (snapshot.exists()) {
      const product = {
        id: snapshot.id,
        ...snapshot.data()
      };
      console.log(`✅ Producto ${id} obtenido`);
      return product;
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    throw error;
  }
};

// Agregar un nuevo producto (invalida cache)
export const addProduct = async (product) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const newProduct = {
      ...product,
      type: "show",
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(productsRef, newProduct);
    
    // Invalidar cache
    productsCache = { data: null, timestamp: null };
    console.log("🗑️ Cache invalidado después de agregar producto");
    
    return {
      id: docRef.id,
      ...newProduct
    };
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    throw error;
  }
};

// Eliminar un producto (invalida cache)
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(productRef);
    
    // Invalidar cache
    productsCache = { data: null, timestamp: null };
    console.log("🗑️ Cache invalidado después de eliminar producto");
    
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    throw error;
  }
};

// Limpiar cache manualmente (útil para testing)
export const clearCache = () => {
  productsCache = { data: null, timestamp: null };
  console.log("🗑️ Cache limpiado manualmente");
};

// Inicialización (ya no es necesaria)
export const initializeProducts = async () => {
  console.log("🔥 Firebase conectado");
  // Pre-cargar productos en segundo plano para mejorar UX inicial
  getProducts(false).catch(() => {
    console.log("⚠️ No se pudieron pre-cargar productos");
  });
};