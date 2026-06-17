<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-whatsapp-green hover:bg-whatsapp-green-hover text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-whatsapp-green"
    aria-label="Order on WhatsApp"
  >
    <!-- Tooltip -->
    <span class="absolute right-16 scale-0 transition-all rounded bg-text-dark p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap shadow-md">
      Chat with us on WhatsApp!
    </span>
    
    <!-- WhatsApp Icon SVG -->
    <svg 
      class="w-6 h-6 fill-current" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.493 5.348 1.495 5.247.002 9.518-4.265 9.522-9.518.002-2.546-.988-4.941-2.79-6.746a9.467 9.467 0 0 0-6.727-2.793c-5.25 0-9.521 4.265-9.525 9.52-.001 2.11.561 4.18 1.625 5.955l-.986 3.6 3.693-.97c1.61.879 3.328 1.341 4.863 1.341h.003zm9.052-5.466c-.302-.15-1.785-.882-2.062-.983-.277-.101-.478-.15-.678.15-.2.3-.775.983-.95 1.183-.175.2-.35.226-.652.076-.302-.15-1.276-.47-2.43-1.499-.899-.802-1.505-1.792-1.681-2.093-.176-.3-.019-.462.132-.612.136-.135.302-.35.454-.526.15-.175.2-.3.302-.5.101-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.24-.244-.59-.493-.51-.678-.52-.176-.01-.377-.012-.578-.012-.2 0-.527.075-.803.376-.277.301-1.056 1.033-1.056 2.52 0 1.488 1.082 2.923 1.232 3.124.15.201 2.13 3.253 5.16 4.56.72.311 1.282.497 1.72.637.724.229 1.382.197 1.902.12.58-.087 1.785-.73 2.036-1.433.252-.704.252-1.307.176-1.433-.075-.126-.277-.201-.579-.352z"/>
    </svg>
  </a>
</template>

<script setup>
import { computed } from 'vue';
import { brand } from '../lib/brand';

const whatsappUrl = computed(() => {
  const message = encodeURIComponent("Assalam-o-Alaikum! I'm interested in ordering some delicious pickles and papads from GharKaZaika.");
  return `https://wa.me/${brand.whatsappNumber}?text=${message}`;
});
</script>
