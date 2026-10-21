// src/context/ProductContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../lib/api';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prod, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      const productList = Array.isArray(prod) ? prod : prod.results || [];
      const catList = Array.isArray(cats) ? cats : cats.results || [];
      setProducts(productList);
      setCategories(catList);
    } catch (err) {
      console.error('Product load failed:', err);
      setError('Could not load products. Is the backend running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, categories, loading, error, reload: load }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductProvider');
  return ctx;
}