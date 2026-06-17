<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center group">
          <span class="text-2xl font-black tracking-tight text-primary-red transition-colors">
            GharKaZaika
          </span>
        </router-link>

        <!-- Desktop Navigation links -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-primary-red font-medium transition-colors duration-200"
            :class="isActive('/') ? 'text-primary-red font-semibold' : ''"
          >
            Home
          </router-link>
          <router-link 
            to="/products" 
            class="text-gray-600 hover:text-primary-red font-medium transition-colors duration-200"
            :class="isActive('/products') ? 'text-primary-red font-semibold' : ''"
          >
            Products
          </router-link>
          <router-link 
            to="/about" 
            class="text-gray-600 hover:text-primary-red font-medium transition-colors duration-200"
            :class="isActive('/about') ? 'text-primary-red font-semibold' : ''"
          >
            About
          </router-link>
          <router-link 
            to="/contact" 
            class="text-gray-600 hover:text-primary-red font-medium transition-colors duration-200"
            :class="isActive('/contact') ? 'text-primary-red font-semibold' : ''"
          >
            Contact
          </router-link>
        </nav>

        <!-- Desktop Action button -->
        <div class="hidden md:flex items-center gap-6">
          <!-- Desktop Cart Button -->
          <button
            @click="cartStore.isOpen = !cartStore.isOpen"
            class="relative p-2.5 text-text-dark hover:text-primary-red transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingCartIcon class="w-6 h-6" />
            <span
              v-if="cartStore.cartCount > 0"
              class="absolute top-1 right-1 bg-primary-red text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm font-sans"
            >
              {{ cartStore.cartCount }}
            </span>
          </button>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-whatsapp-green hover:bg-whatsapp-green-hover text-white px-5 py-2.5 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105"
          >
            <MessageCircleIcon class="w-5 h-5" />
            Order on WhatsApp
          </a>
        </div>

        <!-- Mobile Right Actions -->
        <div class="flex items-center gap-4 md:hidden">
          <!-- Mobile Cart Button -->
          <button
            @click="cartStore.isOpen = !cartStore.isOpen"
            class="relative p-2.5 text-text-dark hover:text-primary-red transition-colors cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingCartIcon class="w-6 h-6" />
            <span
              v-if="cartStore.cartCount > 0"
              class="absolute top-1 right-1 bg-primary-red text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white font-sans"
            >
              {{ cartStore.cartCount }}
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 text-text-dark hover:text-primary-red focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <XIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
        <router-link 
          to="/" 
          class="block px-3 py-2.5 rounded-lg text-base font-medium text-text-dark hover:bg-bg-light hover:text-primary-red transition-all duration-200"
          :class="isActive('/') ? 'bg-bg-light text-primary-red font-semibold' : ''"
          @click="isMobileMenuOpen = false"
        >
          Home
        </router-link>
        <router-link 
          to="/products" 
          class="block px-3 py-2.5 rounded-lg text-base font-medium text-text-dark hover:bg-bg-light hover:text-primary-red transition-all duration-200"
          :class="isActive('/products') ? 'bg-bg-light text-primary-red font-semibold' : ''"
          @click="isMobileMenuOpen = false"
        >
          Products
        </router-link>
        <router-link 
          to="/about" 
          class="block px-3 py-2.5 rounded-lg text-base font-medium text-text-dark hover:bg-bg-light hover:text-primary-red transition-all duration-200"
          :class="isActive('/about') ? 'bg-bg-light text-primary-red font-semibold' : ''"
          @click="isMobileMenuOpen = false"
        >
          About
        </router-link>
        <router-link 
          to="/contact" 
          class="block px-3 py-2.5 rounded-lg text-base font-medium text-text-dark hover:bg-bg-light hover:text-primary-red transition-all duration-200"
          :class="isActive('/contact') ? 'bg-bg-light text-primary-red font-semibold' : ''"
          @click="isMobileMenuOpen = false"
        >
          Contact
        </router-link>
        
        <div class="pt-4 border-t border-gray-100">
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 bg-whatsapp-green hover:bg-whatsapp-green-hover text-white w-full py-3 rounded-xl font-medium shadow-md transition-colors duration-200"
          >
            <MessageCircleIcon class="w-5 h-5" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { brand } from '../lib/brand';
import { useCartStore } from '../stores/cart';
import { Menu as MenuIcon, X as XIcon, MessageSquare as MessageCircleIcon, ShoppingCart as ShoppingCartIcon } from 'lucide-vue-next';

const route = useRoute();
const cartStore = useCartStore();
const isMobileMenuOpen = ref(false);

const isActive = (path) => {
  return route.path === path;
};

const whatsappUrl = computed(() => {
  const message = encodeURIComponent("Assalam-o-Alaikum! I would like to query about ordering homemade pickles and papads.");
  return `https://wa.me/${brand.whatsappNumber}?text=${message}`;
});
</script>
