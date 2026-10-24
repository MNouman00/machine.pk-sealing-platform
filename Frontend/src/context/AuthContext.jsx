import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'https://machine-pk-sealing-platform.onrender.com/api';

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
    localStorage.removeItem('aeco_token');
    delete authApi.defaults.headers.common['Authorization'];
    
    const res = await authApi.post('/auth/login/', { username, password });
    setToken(res.data.token);
    localStorage.setItem('aeco_token', res.data.token);
    setUser({ username, email: res.data.email || '' });
  };

  const register = async (username, email, password) => {
    try {
      // Use plain axios so no stale token interferes
      await axios.post(`${API_BASE}/auth/users/`, 
        { username, email, password },
        { headers: { 'Authorization': undefined } }
      );
      // After successful registration, log in
      await login(username, password);
    } catch (err) {
      // Throw the real Django error
      if (err.response && err.response.data) {
        const data = err.response.data;
        let message;
        if (typeof data === 'string') {
          message = data;
        } else {
          message = Object.entries(data)
            .map(([field, msgs]) => {
              const msg = Array.isArray(msgs) ? msgs.join(', ') : msgs;
              return field === 'non_field_errors' || field === 'detail' 
                ? msg 
                : `${field}: ${msg}`;
            })
            .join(' | ');
        }
        throw new Error(message);
      }
      throw err;
    }
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