import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Use the Render URL, with a fallback to localhost for local testing
const API_BASE = import.meta.env.VITE_API_URL || 'https://machine-pk-sealing-platform.onrender.com/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aeco_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post(`${API_BASE}/auth/login/`, { username, password });
    setToken(res.data.token);
    localStorage.setItem('aeco_token', res.data.token);
    setUser({ username, email: res.data.email || '' });
  };

  const register = async (username, email, password) => {
    await axios.post(`${API_BASE}/auth/users/`, { username, email, password });
    await login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aeco_token');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);