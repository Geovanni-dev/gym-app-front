import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // imports basicos

const AuthContext = createContext({}); // cria o contexto

export const AuthProvider = ({ children }) => { // cria o provider
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('@superfrango:token'));

  useEffect(() => { // adiciona o interceptor para incluir o token de autenticação em todas as requisições
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      //Tenta carregar o usuário salvo no localStorage
      const savedUser = localStorage.getItem('@superfrango:user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, [token]);

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
    const status = error.response?.status;

    const isNotVerified =
      status === 403 && error.response?.data?.notVerified;

    const message =
      error.response?.data?.message ||
      error.response?.data?.error || // pega o 429 do rate limit
      (status === 429 && 'Muitas tentativas. Tente novamente mais tarde.') ||
      'Email ou senha incorretos';

    return {
      success: false,
      message,
      notVerified: isNotVerified
    };
  }
};
  // funçao ara o ProfileSideMenu atualizar a foto sem dar refresh na página
  const updateUserData = (newData) => {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('@superfrango:user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => { // cria a funcao de logout
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
      updateUserData, // Exportando a nova função
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // cria a funcao para usar o contexto