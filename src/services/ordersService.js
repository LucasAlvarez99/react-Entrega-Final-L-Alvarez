import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

const ORDERS_COLLECTION = "orders";
const PRODUCTS_COLLECTION = "products";

/**
 * Crear una nueva orden de compra en Firestore
 * @param {Object} orderData - Datos de la orden
 * @param {Object} buyer - Información del comprador
 * @param {Array} items - Items del carrito
 * @returns {Promise<string>} - ID de la orden creada
 */
export const createOrder = async (orderData, buyer, items) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    
    // Preparar la orden
    const order = {
      buyer: {
        name: buyer.name,
        phone: buyer.phone,
        email: buyer.email
      },
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        spaceType: item.spaceType,
        price: item.price,
        quantity: item.quantity
      })),
      total: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      date: new Date().toISOString(),
      status: "generada"
    };

    // Crear orden en Firestore
    const docRef = await addDoc(ordersRef, order);
    
    // Actualizar stock de productos
    for (const item of items) {
      await updateProductStock(item.id, item.spaceType, item.quantity);
    }
    
    console.log("Orden creada con ID:", docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error("Error al crear orden:", error);
    throw error;
  }
};

/**
 * Actualizar el stock de un producto después de la compra
 * @param {string} productId - ID del producto
 * @param {string} spaceType - Tipo de espacio/merchandise
 * @param {number} quantity - Cantidad a descontar
 */
const updateProductStock = async (productId, spaceType, quantity) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    
    // Nota: Esta es una simplificación. En producción deberías:
    // 1. Obtener el documento
    // 2. Encontrar el espacio específico
    // 3. Actualizar solo ese espacio
    // 4. Validar que haya stock suficiente ANTES de crear la orden
    
    // Por ahora, esto es conceptual para el proyecto del curso
    console.log(`Actualizando stock de ${productId} - ${spaceType}: -${quantity}`);
    
  } catch (error) {
    console.error("Error al actualizar stock:", error);
  }
};