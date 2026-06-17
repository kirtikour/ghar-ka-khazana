import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set axios default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return true;
      } catch (err) {
        console.error('Login error:', err);
        this.error = err.response?.data?.message || 'Login failed. Please check your credentials.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Remove axios default auth header
      delete axios.defaults.headers.common['Authorization'];
    },
    
    initializeAuth() {
      // Set initial token header if it exists
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  }
});
