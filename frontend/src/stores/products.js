import { defineStore } from 'pinia';
import axios from 'axios';
import { useCartStore } from './cart';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchProducts(adminMode = false) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/api/products${adminMode ? '?admin=true' : ''}`);
        this.products = response.data;
        if (!adminMode) {
          const cartStore = useCartStore();
          cartStore.validateCartItems(this.products);
        }
      } catch (err) {
        console.error('Fetch products error:', err);
        this.error = err.response?.data?.message || 'Failed to fetch products';
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/products/${id}`);
        return response.data;
      } catch (err) {
        console.error('Fetch product by ID error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(formData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.products.unshift(response.data);
        return response.data;
      } catch (err) {
        console.error('Create product error:', err);
        this.error = err.response?.data?.message || 'Failed to create product';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id, formData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`/api/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const index = this.products.findIndex(p => p._id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return response.data;
      } catch (err) {
        console.error('Update product error:', err);
        this.error = err.response?.data?.message || 'Failed to update product';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`/api/products/${id}`);
        this.products = this.products.filter(p => p._id !== id);
        return true;
      } catch (err) {
        console.error('Delete product error:', err);
        this.error = err.response?.data?.message || 'Failed to delete product';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
