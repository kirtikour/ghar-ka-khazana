<template>
  <div class="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
    <!-- Header Bar -->
    <div class="bg-primary-red h-4 w-full"></div>
    
    <div class="p-8 sm:p-12 space-y-8">
      <!-- Logo / Heading -->
      <div class="text-center space-y-2">
        <span class="text-5xl block animate-pulse">🫙</span>
        <h1 class="text-2xl font-bold tracking-tight text-text-dark">
          <span class="text-primary-red">GharKa</span><span class="text-accent-mustard">Zaika</span>
        </h1>
        <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Admin Control Login</p>
      </div>

      <!-- Error Message -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="authStore.error" class="bg-red-50 text-red-600 text-xs font-semibold p-4 rounded-xl border border-red-100 flex items-center justify-between">
          <span>{{ authStore.error }}</span>
          <button @click="authStore.error = null" class="text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      </transition>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div class="space-y-1">
          <label for="email" class="block text-xxs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="admin@example.com"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50 shadow-inner"
            :disabled="authStore.loading"
          />
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label for="password" class="block text-xxs font-bold text-gray-500 uppercase tracking-widest">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50 shadow-inner"
            :disabled="authStore.loading"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-primary-red hover:bg-primary-red-hover text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    if (window.showToast) {
      window.showToast('Login successful! Welcome back.', 'success');
    }
    router.push('/admin/dashboard');
  } else {
    if (window.showToast) {
      window.showToast('Login failed. Check credentials.', 'error');
    }
  }
};
</script>
