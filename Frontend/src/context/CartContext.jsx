// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'aeco_cart_v2';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

    const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      
      // Get the correct image from gallery first
      const featureImg = product.images?.find(img => img.is_feature) || product.images?.[0];
      const imageUrl = featureImg ? featureImg.image : (product.image_url || '');

      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.price),
          imageUrl: imageUrl, 
          quantity,
        },
      ];
    });
  };
  const updateQuantity = (productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    });
  };

  const removeItem = (productId) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const clear = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      totalItems,
      totalPrice,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}