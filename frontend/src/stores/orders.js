import { defineStore } from 'pinia';
import axios from 'axios';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    inventory: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchOrders(status = '') {
      this.loading = true;
      this.error = null;
      try {
        const url = status ? `/api/orders?status=${status}` : '/api/orders';
        const response = await axios.get(url);
        this.orders = response.data;
      } catch (err) {
        console.error('Fetch orders error:', err);
        this.error = err.response?.data?.message || 'Failed to fetch orders';
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/orders', orderData);
        this.orders.unshift(response.data);
        return response.data;
      } catch (err) {
        console.error('Create order error:', err);
        this.error = err.response?.data?.message || 'Failed to create order';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(id, status) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`/api/orders/${id}`, { status });
        const index = this.orders.findIndex(o => o._id === id);
        if (index !== -1) {
          this.orders[index] = response.data;
        }
        return response.data;
      } catch (err) {
        console.error('Update order status error:', err);
        this.error = err.response?.data?.message || 'Failed to update order status';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchInventory() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/inventory');
        this.inventory = response.data;
      } catch (err) {
        console.error('Fetch inventory error:', err);
        this.error = err.response?.data?.message || 'Failed to fetch inventory';
      } finally {
        this.loading = false;
      }
    },

    async updateInventoryStock(id, stock) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`/api/inventory/${id}`, { stock });
        const index = this.inventory.findIndex(item => item._id === id);
        if (index !== -1) {
          this.inventory[index] = response.data;
        }
        return response.data;
      } catch (err) {
        console.error('Update inventory stock error:', err);
        this.error = err.response?.data?.message || 'Failed to update stock quantity';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
