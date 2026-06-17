<template>
  <div class="space-y-8">
    <!-- Title -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-800">Dashboard Overview</h1>
        <p class="text-sm text-gray-500">Real-time stats and performance of your homemade pickle business.</p>
      </div>
      
      <!-- Quick Actions -->
      <div class="flex items-center gap-3">
        <router-link
          to="/admin/products"
          class="bg-primary-red hover:bg-primary-red-hover text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow flex items-center gap-2 cursor-pointer"
        >
          ➕ Add New Product
        </router-link>
        <router-link
          to="/admin/orders"
          class="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer"
        >
          📋 View All Orders
        </router-link>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="productsStore.loading || ordersStore.loading">
      <LoadingSpinner message="Fetching dashboard stats..." />
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1: Total Products -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-50 text-primary-red flex items-center justify-center text-2xl">
            🫙
          </div>
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Products</p>
            <h3 class="text-2xl font-black text-gray-800">{{ totalProducts }}</h3>
          </div>
        </div>

        <!-- Card 2: Orders This Week -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-yellow-50 text-accent-mustard flex items-center justify-center text-2xl">
            📦
          </div>
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Orders This Week</p>
            <h3 class="text-2xl font-black text-gray-800">{{ ordersThisWeek }}</h3>
          </div>
        </div>

        <!-- Card 3: Low Stock Items -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4" :class="lowStockItems > 0 ? 'bg-red-50/30 border-red-100' : ''">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" :class="lowStockItems > 0 ? 'bg-red-100 text-primary-red animate-pulse' : 'bg-green-50 text-green-600'">
            ⚠️
          </div>
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Low Stock Items</p>
            <h3 class="text-2xl font-black" :class="lowStockItems > 0 ? 'text-primary-red font-black' : 'text-gray-800'">{{ lowStockItems }}</h3>
          </div>
        </div>

        <!-- Card 4: Most Ordered Product -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Top Product</p>
            <h3 class="text-sm font-bold text-gray-800 truncate max-w-[150px]" :title="mostOrderedProduct">{{ mostOrderedProduct }}</h3>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-800 text-lg">Recent Orders</h3>
          <span class="text-xs text-primary-red font-semibold">Showing latest 5 orders</span>
        </div>

        <!-- Table container -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-400 text-xxs uppercase tracking-wider font-bold border-b border-gray-100">
                <th class="px-6 py-3">Customer</th>
                <th class="px-6 py-3">Items Ordered</th>
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Total</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
              <tr v-if="recentOrders.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-400 italic">No orders received yet.</td>
              </tr>
              
              <tr v-for="order in recentOrders" :key="order._id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <p class="font-bold text-gray-800">{{ order.customerName }}</p>
                  <p class="text-xs text-gray-400">{{ order.phone }}</p>
                </td>
                
                <td class="px-6 py-4 max-w-xs truncate">
                  <div class="space-y-0.5">
                    <p v-for="item in order.items" :key="item._id" class="text-xs">
                      {{ item.name }} ({{ item.weight }}) <span class="text-gray-400 font-medium">x{{ item.quantity }}</span>
                    </p>
                  </div>
                </td>
                
                <td class="px-6 py-4 text-xs">
                  {{ formatDate(order.createdAt) }}
                </td>
                
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider shadow-sm"
                    :class="{
                      'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                      'bg-blue-100 text-blue-800': order.status === 'Confirmed',
                      'bg-green-100 text-green-800': order.status === 'Delivered',
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>
                
                <td class="px-6 py-4 font-bold text-gray-800">
                  Rs. {{ order.total }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useProductsStore } from '../stores/products';
import { useOrdersStore } from '../stores/orders';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const productsStore = useProductsStore();
const ordersStore = useOrdersStore();

onMounted(async () => {
  await productsStore.fetchProducts(true);
  await ordersStore.fetchOrders();
});

// Dynamic stats calculations
const totalProducts = computed(() => productsStore.products.length);

const ordersThisWeek = computed(() => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return ordersStore.orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo).length;
});

const lowStockItems = computed(() => {
  return productsStore.products.filter(p => p.stock < 5).length;
});

const mostOrderedProduct = computed(() => {
  if (ordersStore.orders.length === 0) return 'None';
  
  const counts = {};
  ordersStore.orders.forEach(order => {
    order.items.forEach(item => {
      counts[item.name] = (counts[item.name] || 0) + item.quantity;
    });
  });
  
  let topProduct = 'None';
  let maxCount = 0;
  for (const name in counts) {
    if (counts[name] > maxCount) {
      maxCount = counts[name];
      topProduct = name;
    }
  }
  
  return topProduct;
});

// Recent orders slice
const recentOrders = computed(() => {
  return ordersStore.orders.slice(0, 5);
});

// Date formatting
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
