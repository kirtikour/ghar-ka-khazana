<template>
  <footer class="bg-text-dark text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Info -->
        <div class="space-y-4 md:col-span-2">
          <div class="flex items-center gap-2">
            <span class="text-3xl">🫙</span>
            <span class="text-2xl font-bold tracking-tight text-white">
              <span class="text-primary-red">GharKa</span><span class="text-accent-mustard">Zaika</span>
            </span>
          </div>
          <p class="text-sm text-gray-400 max-w-sm italic">
            "{{ brand.tagline }}"
          </p>
          <p class="text-xs text-gray-500">
            Every jar is made by hand in clean, hygienic home conditions using traditional recipes passed down through generations.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-base tracking-wider uppercase">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/" class="hover:text-accent-mustard transition-colors duration-200">Home</router-link>
            </li>
            <li>
              <router-link to="/products" class="hover:text-accent-mustard transition-colors duration-200">Our Products</router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-accent-mustard transition-colors duration-200">About Our Kitchen</router-link>
            </li>
            <li>
              <router-link to="/contact" class="hover:text-accent-mustard transition-colors duration-200">Contact Us</router-link>
            </li>
            <li>
              <router-link to="/admin/login" class="text-gray-500 hover:text-gray-400 transition-colors duration-200 text-xs">Admin Access</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Details -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-base tracking-wider uppercase">Contact</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-center gap-2">
              <span class="text-lg">📍</span>
              <span>{{ brand.address }}</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-lg">📞</span>
              <span>{{ brand.whatsappDisplay }}</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-lg">✉️</span>
              <a :href="'mailto:' + brand.email" class="hover:text-accent-mustard transition-colors duration-200">{{ brand.email }}</a>
            </li>
            <li class="flex items-center gap-4 pt-2">
              <!-- Instagram -->
              <a :href="brand.instagram" target="_blank" rel="noopener noreferrer" class="hover:text-accent-mustard text-xl" aria-label="Instagram">
                📸
              </a>
              <!-- Facebook -->
              <a :href="brand.facebook" target="_blank" rel="noopener noreferrer" class="hover:text-accent-mustard text-xl" aria-label="Facebook">
                👥
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {{ new Date().getFullYear() }} {{ brand.name }}. All rights reserved.</p>
        <p class="flex items-center gap-1">
          Made with ❤️ in Karachi, Pakistan
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { brand } from '../lib/brand';
</script>
