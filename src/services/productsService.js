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
import productsData from "../data/products.json";

const COLLECTION_NAME = "products";

// Inicializar Firestore con productos por defecto (solo ejecutar una vez)
export const initializeProducts = async () => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(productsRef);
    
    // Si no hay productos en Firestore, cargar los datos iniciales
    if (snapshot.empty) {
      console.log("Inicializando productos en Firestore...");
      
      for (const product of productsData) {
        await addDoc(productsRef, {
          ...product,
          createdAt: new Date().toISOString()
        });
      }
      
      console.log("Productos inicializados exitosamente!");
    }
  } catch (error) {
    console.error("Error al inicializar productos:", error);
  }
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