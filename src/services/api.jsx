import axios from 'axios'; // importa a biblioteca axios para fazer requisições HTTP

const api = axios.create({ // cria uma instância do axios com uma configuração base de URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// interceptor de requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@superfrango:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Erro inesperado';

    if (status === 429) { // mensagem do rate limit
      message = 'Muitas tentativas. Tente novamente mais tarde.';
    }

    // dispara global do rate limit
    window.dispatchEvent(
      new CustomEvent('apiError', {
        detail: { message }
      })
    );

    return Promise.reject({
      ...error,
      customMessage: message
    });
  }
);
export default api; // exporta a instância do axios para ser usada em outros arquivos do projeto