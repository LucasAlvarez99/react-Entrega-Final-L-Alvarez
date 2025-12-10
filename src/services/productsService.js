// src/services/productsService.js
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "products";

// Ya no necesitamos inicializar productos desde JSON
// Los productos se crearán desde el panel de administración
export const initializeProducts = async () => {
  console.log("Firebase conectado. Los productos se gestionan desde el panel admin.");
};

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(productsRef);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Obtener productos por categoría
export const getProductsByCategory = async (categoryId) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef, where("category", "==", categoryId));
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return products;
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return [];
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(productRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    throw error;
  }
};

// Agregar un nuevo producto
export const addProduct = async (product) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const newProduct = {
      ...product,
      type: "show",
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(productsRef, newProduct);
    
    return {
      id: docRef.id,
      ...newProduct
    };
  } catch (error) {
    console.error("Error al agregar producto:", error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

// Actualizar un producto
export const updateProduct = async (id, updatedProduct) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, {
      ...updatedProduct,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id,
      ...updatedProduct
    };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};