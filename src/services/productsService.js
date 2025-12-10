
import productsData from "../data/products.json";

const STORAGE_KEY = "olimpo_products";

// Inicializar localStorage con productos por defecto si no existe
export const initializeProducts = () => {
  const storedProducts = localStorage.getItem(STORAGE_KEY);
  if (!storedProducts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsData));
  }
};

// Obtener todos los productos
export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      resolve(products);
    }, 800);
  });
};

// Obtener productos por categoría
export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const filtered = products.filter((p) => p.category === categoryId);
      resolve(filtered);
    }, 800);
  });
};

// Obtener un producto por ID
export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const product = products.find((p) => p.id === id);
      
      if (product) {
        resolve(product);
      } else {
        reject(new Error("Producto no encontrado"));
      }
    }, 800);
  });
};

// Agregar un nuevo producto
export const addProduct = (product) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        type: "show",
      };
      
      products.push(newProduct);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      resolve(newProduct);
    }, 500);
  });
};

// Eliminar un producto
export const deleteProduct = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const filtered = products.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      resolve(true);
    }, 500);
  });
};

// Actualizar un producto
export const updateProduct = (id, updatedProduct) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const index = products.findIndex((p) => p.id === id);
      
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        resolve(products[index]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};