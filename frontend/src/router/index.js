import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Views
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import AdminLogin from '../views/AdminLogin.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AdminProducts from '../views/AdminProducts.vue';
import AdminOrders from '../views/AdminOrders.vue';
import AdminInventory from '../views/AdminInventory.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: AdminDashboard
      },
      {
        path: 'products',
        name: 'admin-products',
        component: AdminProducts
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: AdminOrders
      },
      {
        path: 'inventory',
        name: 'admin-inventory',
        component: AdminInventory
      }
    ]
  },
  // Fallback to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Make sure Axios common headers are initialized
  authStore.initializeAuth();

  // Check if route requires auth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/admin/login');
  } else if (to.name === 'admin-login' && authStore.isAuthenticated) {
    next('/admin/dashboard');
  } else {
    next();
  }
});

export default router;
