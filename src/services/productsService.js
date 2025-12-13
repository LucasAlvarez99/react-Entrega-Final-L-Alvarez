// src/services/productsService.js - ARCHIVO COMPLETO CORREGIDO
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "products";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora
const CACHE_KEY = "olimpo_products_cache";
const CACHE_VERSION = "v2";

// ===== MEMORY CACHE (más rápido que localStorage) =====
let memoryCache = null;
let memoryCacheTimestamp = 0;

const isMemoryCacheValid = () => {
  return memoryCache && (Date.now() - memoryCacheTimestamp < CACHE_DURATION);
};

// ===== LOCALSTORAGE CACHE =====
const loadFromLocalStorage = () => {
  try {
    // Primero revisar memoria
    if (isMemoryCacheValid()) {
      console.log(`⚡ Productos desde memoria RAM (${memoryCache.length} items)`);
      return memoryCache;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    
    if (parsed.version !== CACHE_VERSION) {
      console.log("🗑️ Cache desactualizado");
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
    if (isExpired) {
      console.log("⏰ Cache expirado");
      return null;
    }
    
    // Guardar en memoria para próximas consultas
    memoryCache = parsed.data;
    memoryCacheTimestamp = parsed.timestamp;
    
    console.log(`📦 Productos desde localStorage (${parsed.data.length} items)`);
    return parsed.data;
    
  } catch (error) {
    console.warn("Error al leer cache:", error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const saveToCache = (data) => {
  try {
    // Guardar en memoria
    memoryCache = data;
    memoryCacheTimestamp = Date.now();
    
    // Guardar en localStorage
    const cacheObject = {
      version: CACHE_VERSION,
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    console.log(`💾 ${data.length} productos en caché`);
  } catch (error) {
    console.warn("Error guardando caché:", error);
  }
};

// ===== OBTENER TODOS LOS PRODUCTOS =====
export const getProducts = async (useCache = true) => {
  try {
    if (useCache) {
      const cached = loadFromLocalStorage();
      if (cached) return cached;
    }

    console.log("🔄 Cargando desde Firestore...");
    const productsRef = collection(db, COLLECTION_NAME);
    
    // SIN orderBy para evitar problemas de índice
    const snapshot = await getDocs(productsRef);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Ordenar manualmente por fecha (más recientes primero)
    products.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });
    
    saveToCache(products);
    
    console.log(`✅ ${products.length} productos cargados`);
    return products;
    
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    
    // Intentar devolver cache expirado como fallback
    if (memoryCache) {
      console.log("⚠️ Usando cache en memoria (fallback)");
      return memoryCache;
    }
    
    const expiredCache = localStorage.getItem(CACHE_KEY);
    if (expiredCache) {
      const { data } = JSON.parse(expiredCache);
      console.log("⚠️ Usando cache expirado (fallback)");
      return data;
    }
    
    return [];
  }
};

// ===== OBTENER POR CATEGORÍA =====
export const getProductsByCategory = async (categoryId) => {
  try {
    // Filtrar desde cache si está disponible
    const cached = loadFromLocalStorage();
    if (cached) {
      const filtered = cached.filter(p => p.category === categoryId);
      if (filtered.length > 0) {
        console.log(`📦 Categoría "${categoryId}" desde cache`);
        return filtered;
      }
    }

    console.log(`🔄 Consultando categoría "${categoryId}"...`);
    const productsRef = collection(db, COLLECTION_NAME);
    
    const q = query(
      productsRef, 
      where("category", "==", categoryId)
    );
    
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ ${products.length} en "${categoryId}"`);
    return products;
    
  } catch (error) {
    console.error("❌ Error:", error);
    return [];
  }
};

// ===== OBTENER POR ID =====
export const getProductById = async (id) => {
  try {
    const cached = loadFromLocalStorage();
    if (cached) {
      const found = cached.find(p => p.id === id);
      if (found) {
        console.log(`⚡ Producto ${id} desde cache`);
        return found;
      }
    }

    console.log(`🔄 Consultando producto ${id}...`);
    const productRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(productRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
};

// ===== AGREGAR PRODUCTO =====
export const addProduct = async (product) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const newProduct = {
      ...product,
      type: "show",
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(productsRef, newProduct);
    clearCache();
    
    return { id: docRef.id, ...newProduct };
  } catch (error) {
    console.error("❌ Error al agregar:", error);
    throw error;
  }
};

// ===== ELIMINAR PRODUCTO =====
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(productRef);
    clearCache();
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
    throw error;
  }
};

// ===== LIMPIAR CACHE =====
export const clearCache = () => {
  memoryCache = null;
  memoryCacheTimestamp = 0;
  localStorage.removeItem(CACHE_KEY);
  console.log("🗑️ Cache limpiado");
};

// ===== INICIALIZACIÓN =====
export const initializeProducts = async () => {
  console.log("🔥 Firebase conectado");
  
  // FORZAR CARGA DESDE FIRESTORE (sin cache)
  console.log("📡 Cargando productos desde Firestore...");
  getProducts(false).catch(() => {
    console.log("⚠️ Pre-carga fallida");
  });
};

// ===== ESTADÍSTICAS =====
export const getCacheStats = () => {
  try {
    if (memoryCache) {
      const ageMinutes = Math.floor((Date.now() - memoryCacheTimestamp) / 60000);
      return {
        source: 'memory',
        itemCount: memoryCache.length,
        ageMinutes,
        isExpired: ageMinutes > 60
      };
    }
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return { hasCache: false };
    
    const parsed = JSON.parse(cached);
    const ageMinutes = Math.floor((Date.now() - parsed.timestamp) / 60000);
    
    return {
      source: 'localStorage',
      itemCount: parsed.data.length,
      ageMinutes,
      isExpired: ageMinutes > 60,
      version: parsed.version
    };
  } catch {
    return { hasCache: false };
  }
};