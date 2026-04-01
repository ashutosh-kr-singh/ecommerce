import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔐 Token from localStorage:', token ? '✅ Present' : '❌ Missing');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header set');
  } else {
    console.warn('⚠️ No token found in localStorage!');
  }
  
  console.log('📤 Request to:', config.baseURL + config.url);
  console.log('Headers:', config.headers);
  
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token may be invalid or expired');
      console.log('Current token:', localStorage.getItem('token'));
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============

export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ PRODUCT ENDPOINTS ============

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ CART ENDPOINTS ============

export const addToCartAPI = async (items, totalPrice, shippingAddress) => {
  try {
    const response = await api.post('/cart', {
      items,
      totalPrice,
      shippingAddress: shippingAddress || '123 Main St',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;