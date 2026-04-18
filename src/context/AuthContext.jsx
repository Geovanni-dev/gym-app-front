import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      const storedToken = localStorage.getItem('@superfrango:token');
      const storedUser = localStorage.getItem('@superfrango:user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      
      setIsLoading(false);
    };
    
    loadStoredData();
  }, []);

  const login = async (data) => {
    try {
      const response = await api.post('/users/login', data);
      const { token: receivedToken, user: userData } = response.data;

      setToken(receivedToken);
      setUser(userData);

      localStorage.setItem('@superfrango:token', receivedToken);
      localStorage.setItem('@superfrango:user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      const isNotVerified = error.response?.status === 403 && error.response?.data?.notVerified;

      return {
        success: false,
        message: error.response?.data?.message || 'Email ou senha incorretos',
        notVerified: isNotVerified
      };
    }
  };

  const updateUserData = (newData) => {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('@superfrango:user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('@superfrango:token');
    localStorage.removeItem('@superfrango:user');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUserData,
      isAuthenticated: !!token,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);