<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Public Layout -->
    <template v-if="!isAdminRoute">
      <Navbar />
      
      <!-- Main Content -->
      <main class="flex-grow">
        <router-view />
      </main>
      
      <Footer />
      <FloatingWhatsApp />
      <CartDrawer />
      <CheckoutModal />
    </template>

    <!-- Admin Login Layout (Standalone) -->
    <template v-else-if="isLoginRoute">
      <main class="flex-grow flex items-center justify-center bg-bg-light min-h-screen">
        <router-view />
      </main>
    </template>

    <!-- Admin Dashboard Layout (Sidebar + Top Bar) -->
    <template v-else>
      <div class="flex min-h-screen bg-gray-50">
        <!-- Admin Sidebar -->
        <aside class="w-64 bg-primary-red-hover text-white flex flex-col shadow-xl z-20 shrink-0">
          <div class="p-6 border-b border-red-800 flex items-center gap-3">
            <span class="text-2xl">🫙</span>
            <div>
              <h1 class="font-bold text-lg leading-none tracking-wide">GharKaZaika</h1>
              <span class="text-xs text-red-300">Admin Control Panel</span>
            </div>
          </div>
          
          <nav class="flex-grow p-4 space-y-1">
            <router-link
              to="/admin/dashboard"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
              :class="isActive('/admin/dashboard') ? 'bg-red-800 text-white font-medium shadow-inner' : 'text-red-100 hover:bg-red-800/50 hover:text-white'"
            >
              <LayoutDashboardIcon class="w-5 h-5" />
              Dashboard
            </router-link>
            
            <router-link
              to="/admin/products"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
              :class="isActive('/admin/products') ? 'bg-red-800 text-white font-medium shadow-inner' : 'text-red-100 hover:bg-red-800/50 hover:text-white'"
            >
              <PackageIcon class="w-5 h-5" />
              Products
            </router-link>
            
            <router-link
              to="/admin/orders"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
              :class="isActive('/admin/orders') ? 'bg-red-800 text-white font-medium shadow-inner' : 'text-red-100 hover:bg-red-800/50 hover:text-white'"
            >
              <ShoppingCartIcon class="w-5 h-5" />
              Orders
            </router-link>
            
            <router-link
              to="/admin/inventory"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
              :class="isActive('/admin/inventory') ? 'bg-red-800 text-white font-medium shadow-inner' : 'text-red-100 hover:bg-red-800/50 hover:text-white'"
            >
              <ClipboardListIcon class="w-5 h-5" />
              Inventory
            </router-link>
          </nav>

          <div class="p-4 border-t border-red-800">
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-900 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <LogOutIcon class="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        <!-- Admin Content Area -->
        <div class="flex-grow flex flex-col min-w-0">
          <!-- Top Bar -->
          <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
            <h2 class="text-xl font-semibold text-gray-800">Welcome back, Admin</h2>
            <div class="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <CalendarIcon class="w-4 h-4 text-gray-400" />
              <span>{{ currentDate }}</span>
            </div>
          </header>

          <!-- Dynamic Admin View -->
          <main class="flex-grow p-8 overflow-y-auto">
            <router-view />
          </main>
        </div>
      </div>
    </template>
    
    <!-- Shared Global Toast Notifications Container -->
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none" id="toast-container"></div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

// Icons
import {
  LayoutDashboard as LayoutDashboardIcon,
  Package as PackageIcon,
  ShoppingCart as ShoppingCartIcon,
  ClipboardList as ClipboardListIcon,
  LogOut as LogOutIcon,
  Calendar as CalendarIcon
} from 'lucide-vue-next';

// Components
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import FloatingWhatsApp from './components/FloatingWhatsApp.vue';
import CartDrawer from './components/CartDrawer.vue';
import CheckoutModal from './components/CheckoutModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Route checks
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const isLoginRoute = computed(() => route.path === '/admin/login');

// Format current date
const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
});

const isActive = (path) => {
  return route.path === path;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/admin/login');
  
  // Custom toast notification helper (will trigger standard Toast notification)
  showToast('Logged out successfully', 'success');
};

// Global toast utility helper
const showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto flex items-center justify-between gap-4 ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  }`;
  
  toast.innerHTML = `
    <span>${message}</span>
    <button class="text-white/80 hover:text-white cursor-pointer font-bold text-xs" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-[-10px]');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

// Expose toast function globally on window
onMounted(() => {
  window.showToast = showToast;
  authStore.initializeAuth();
});
</script>

<style>
/* Transitions */
.router-link-active {
  transition: all 0.2s ease-in-out;
}
</style>
