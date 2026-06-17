<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="relative w-16 h-16">
      <div class="absolute inset-0 rounded-full border-4 border-gray-100"></div>
      <div class="absolute inset-0 rounded-full border-4 border-t-primary-red border-r-accent-mustard animate-spin"></div>
      <div class="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🫙</div>
    </div>
    <p class="mt-4 text-sm font-medium text-gray-500 animate-pulse">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Serving you the taste of home...'
  }
});
</script>
