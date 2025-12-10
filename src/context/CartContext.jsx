import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CART_STORAGE_KEY = "olimpo_cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Agregar item al carrito
  const addItem = (item, quantity) => {
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.spaceType === item.spaceType
    );

    if (existingItem) {
      // Si ya existe, actualizar cantidad
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.spaceType === item.spaceType
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      // Si no existe, agregarlo
      setCart([...cart, { ...item, quantity }]);
    }
  };

  // Remover item del carrito
  const removeItem = (itemId, spaceType) => {
    setCart(
      cart.filter(
        (item) => !(item.id === itemId && item.spaceType === spaceType)
      )
    );
  };

  // Limpiar todo el carrito
  const clear = () => {
    setCart([]);
  };

  // Verificar si un item está en el carrito
  const isInCart = (itemId, spaceType) => {
    return cart.some(
      (item) => item.id === itemId && item.spaceType === spaceType
    );
  };

  // Obtener cantidad de un item específico
  const getItemQuantity = (itemId, spaceType) => {
    const item = cart.find(
      (cartItem) =>
        cartItem.id === itemId && cartItem.spaceType === spaceType
    );
    return item ? item.quantity : 0;
  };

  // Calcular total de items en el carrito
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Calcular precio total
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Actualizar cantidad de un item
  const updateQuantity = (itemId, spaceType, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId, spaceType);
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId && item.spaceType === spaceType
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clear,
        isInCart,
        getItemQuantity,
        getTotalItems,
        getTotalPrice,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};