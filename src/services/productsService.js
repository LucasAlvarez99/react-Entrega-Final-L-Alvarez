// src/services/productsService.js - VERSIÓN OPTIMIZADA
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
  limit,
  startAfter
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "products";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos (antes era 5)
const CACHE_KEY = "olimpo_products_cache";
const CACHE_VERSION = "v1"; // Para invalidar cache si cambia estructura

// ===== CACHE CON LOCALSTORAGE =====
const loadFromLocalStorage = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    
    // Verificar versión del cache
    if (parsed.version !== CACHE_VERSION) {
      console.log("🗑️ Cache desactualizado, limpiando...");
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Verificar expiración
    const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
    if (isExpired) {
      console.log("⏰ Cache expirado");
      return null;
    }
    
    console.log(`📦 Productos desde localStorage (${parsed.data.length} items)`);
    return parsed.data;
    
  } catch (error) {
    console.warn("Error al leer cache:", error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const saveToLocalStorage = (data) => {
  try {
    const cacheObject = {
      version: CACHE_VERSION,
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    console.log(`💾 ${data.length} productos guardados en cache`);
  } catch (error) {
    console.warn("No se pudo guardar en localStorage:", error);
  }
};

// ===== OBTENER TODOS LOS PRODUCTOS (OPTIMIZADO) =====
export const getProducts = async (useCache = true) => {
  try {
    // 1. Intentar cargar desde localStorage
    if (useCache) {
      const cached = loadFromLocalStorage();
      if (cached) return cached;
    }

    // 2. Si no hay cache, cargar desde Firestore
    console.log("🔄 Cargando productos desde Firestore...");
    const productsRef = collection(db, COLLECTION_NAME);
    
    // OPTIMIZACIÓN: Limitar a 50 productos y ordenar
    const q = query(
      productsRef, 
      orderBy("createdAt", "desc"),
      limit(50) // ⚡ Limitar cantidad de documentos
    );
    
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 3. Guardar en cache
    saveToLocalStorage(products);
    
    console.log(`✅ ${products.length} productos cargados desde Firestore`);
    return products;
    
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    
    // Fallback: intentar devolver cache aunque esté expirado
    const expiredCache = localStorage.getItem(CACHE_KEY);
    if (expiredCache) {
      const { data } = JSON.parse(expiredCache);
      console.log("⚠️ Usando cache expirado como fallback");
      return data;
    }
    
    return [];
  }
};

// ===== OBTENER PRODUCTOS POR CATEGORÍA (OPTIMIZADO) =====
export const getProductsByCategory = async (categoryId) => {
  try {
    // 1. Intentar filtrar desde cache primero
    const cached = loadFromLocalStorage();
    if (cached) {
      const filtered = cached.filter(p => p.category === categoryId);
      if (filtered.length > 0) {
        console.log(`📦 Categoría "${categoryId}" desde cache (${filtered.length} items)`);
        return filtered;
      }
    }

    // 2. Si no hay cache, consultar Firestore
    console.log(`🔄 Consultando categoría "${categoryId}" en Firestore...`);
    const productsRef = collection(db, COLLECTION_NAME);
    
    // IMPORTANTE: Esta query requiere índice compuesto en Firestore
    const q = query(
      productsRef, 
      where("category", "==", categoryId),
      orderBy("date", "asc"),
      limit(30)
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
    
    // Si falla por falta de índice, intentar sin orderBy
    if (error.code === 'failed-precondition') {
      console.log("⚠️ Falta índice compuesto, consultando sin ordenar...");
      const productsRef = collection(db, COLLECTION_NAME);
      const q = query(
        productsRef, 
        where("category", "==", categoryId),
        limit(30)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    return [];
  }
};

// ===== OBTENER UN PRODUCTO POR ID (OPTIMIZADO) =====
export const getProductById = async (id) => {
  try {
    // 1. Buscar en cache primero
    const cached = loadFromLocalStorage();
    if (cached) {
      const found = cached.find(p => p.id === id);
      if (found) {
        console.log(`📦 Producto ${id} desde cache`);
        return found;
      }
    }

    // 2. Si no está en cache, consultar Firestore
    console.log(`🔄 Consultando producto ${id} en Firestore...`);
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

// ===== AGREGAR PRODUCTO (INVALIDA CACHE) =====
export const addProduct = async (product) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const newProduct = {
      ...product,
      type: "show",
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(productsRef, newProduct);
    
    // Invalidar cache para forzar recarga
    clearCache();
    
    return {
      id: docRef.id,
      ...newProduct
    };
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    throw error;
  }
};

// ===== ELIMINAR PRODUCTO (INVALIDA CACHE) =====
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(productRef);
    
    // Invalidar cache
    clearCache();
    
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    throw error;
  }
};

// ===== LIMPIAR CACHE =====
export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
  console.log("🗑️ Cache limpiado");
};

// ===== INICIALIZACIÓN =====
export const initializeProducts = async () => {
  console.log("🔥 Firebase conectado");
  
  // Pre-cargar productos en segundo plano si no hay cache
  const cached = loadFromLocalStorage();
  if (!cached) {
    console.log("📡 Pre-cargando productos...");
    getProducts(false).catch(() => {
      console.log("⚠️ No se pudieron pre-cargar productos");
    });
  } else {
    console.log("✅ Productos disponibles en cache local");
  }
};

// ===== FUNCIÓN DE UTILIDAD: OBTENER ESTADÍSTICAS =====
export const getCacheStats = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return { hasCache: false };
    
    const parsed = JSON.parse(cached);
    const ageMinutes = Math.floor((Date.now() - parsed.timestamp) / 60000);
    const isExpired = ageMinutes > 30;
    
    return {
      hasCache: true,
      itemCount: parsed.data.length,
      ageMinutes,
      isExpired,
      version: parsed.version
    };
  } catch {
    return { hasCache: false };
  }
};