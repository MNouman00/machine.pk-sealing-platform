import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const fetchProducts = (params = {}) =>
  api.get('/products/', { params }).then((r) => r.data);

export const fetchProduct = (slug) =>
  api.get(`/products/${slug}/`).then((r) => r.data);

export const fetchCategories = () =>
  api.get('/categories/').then((r) => r.data);

export const createOrder = (payload) =>
  api.post('/orders/', payload).then((r) => r.data);