import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'https://machine-pk-sealing-platform.onrender.com/api';

// Dedicated instance for authenticated requests
const authApi = axios.create({ baseURL: API_BASE });

authApi.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem('aeco_token');
  if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
    config.headers.Authorization = `Token ${storedToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aeco_token'));

  const login = async (username, password) => {
    const res = await authApi.post('/auth/login/', { username, password });
    setToken(res.data.token);
    localStorage.setItem('aeco_token', res.data.token);
    setUser({ username, email: res.data.email || '' });
  };

  const register = async (username, email, password) => {
    // CRITICAL: Use plain axios — NO interceptor, NO Authorization header
    await axios.post(`${API_BASE}/auth/users/`, { username, email, password });
    await login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aeco_token');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);