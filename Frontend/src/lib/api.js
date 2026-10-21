// src/lib/api.js
import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// This interceptor runs BEFORE every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aeco_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ─── Products ────────────────────────────────────────
export const fetchProducts = (params = {}) =>
  api.get('/products/', { params }).then((r) => r.data);

export const fetchProduct = (slug) =>
  api.get(`/products/${slug}/`).then((r) => r.data);

export const fetchCategories = () =>
  api.get('/categories/').then((r) => r.data);

// ─── Orders ──────────────────────────────────────────
export const createOrder = (payload) =>
  api.post('/orders/', payload).then((r) => r.data);

export const lookupOrder = (reference) =>
  api.get(`/orders/lookup/${reference}/`).then((r) => r.data);