<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <!-- Header -->
    <div class="text-center space-y-3">
      <h1 class="text-4xl font-extrabold text-text-dark inline-block relative">
        Our Products
        <span class="absolute -bottom-2 left-0 right-0 h-1 bg-accent-mustard rounded-full"></span>
      </h1>
      <p class="text-gray-500 text-sm max-w-md mx-auto pt-2">
        Freshly hand-spiced pickles, sun-dried papads, and sweet/sour chutneys made with love.
      </p>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-bg-light p-6 rounded-2xl border border-red-50/50 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
      <!-- Categories -->
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
          :class="selectedCategory === cat 
            ? 'bg-primary-red text-white shadow-md' 
            : 'bg-white text-text-dark hover:bg-red-50 hover:text-primary-red border border-gray-100'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search pickles & papads..."
          class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm shadow-inner"
        />
      </div>
    </div>

    <!-- Loading Spinner -->
    <LoadingSpinner v-if="productsStore.loading" message="Preparing our delicious items..." />

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="text-center py-12 text-red-600 font-medium bg-red-50 rounded-xl">
      {{ productsStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-16 space-y-4">
      <span class="text-5xl block animate-bounce">🫙</span>
      <h3 class="text-xl font-bold text-gray-700">No products found</h3>
      <p class="text-gray-400 text-sm max-w-xs mx-auto">We couldn't find any items matching your category or search. Check back soon for fresh batches!</p>
      <button 
        @click="resetFilters" 
        class="bg-accent-mustard hover:bg-accent-mustard-hover text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1 group"
      >
        <!-- Category Badge & Image -->
        <div class="relative h-60 bg-gray-50 overflow-hidden shrink-0">
          <img
            :src="getImageUrl(product.image)"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span class="absolute top-4 left-4 bg-primary-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {{ product.category }}
          </span>
          <span v-if="product.stock < 5" class="absolute top-4 right-4 bg-yellow-500 text-text-dark text-xxs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            Low Stock
          </span>
        </div>

        <!-- Details -->
        <div class="p-6 flex flex-col flex-grow justify-between space-y-6">
          <div class="space-y-3">
            <h3 class="font-bold text-text-dark text-xl leading-tight">{{ product.name }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">{{ product.description }}</p>
          </div>

          <div class="space-y-4 pt-4 border-t border-gray-50">
            <!-- Price and Weight Variants Selection -->
            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="block text-xxs text-gray-400 uppercase tracking-widest font-bold mb-1">Select Weight</label>
                <select
                  v-model="selectedWeights[product._id]"
                  class="bg-bg-light border border-red-50 text-text-dark font-semibold text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-red cursor-pointer"
                >
                  <option 
                    v-for="w in getAvailableWeights(product)" 
                    :key="w" 
                    :value="w"
                  >
                    {{ w }}
                  </option>
                </select>
              </div>

              <div class="text-right">
                <span class="text-xxs text-gray-400 uppercase tracking-widest font-bold block">Price</span>
                <span class="text-xl font-extrabold text-primary-red">
                  Rs. {{ getPriceForSelectedWeight(product) }}
                </span>
              </div>
            </div>

            <!-- Out of Stock State -->
            <div v-if="product.stock <= 0" class="w-full text-center py-3.5 bg-gray-100 text-gray-400 font-bold rounded-xl text-xs border border-gray-250 shrink-0">
              Out of Stock
            </div>

            <!-- Dual Action Buttons when in stock -->
            <div v-else class="flex gap-2">
              <!-- Add to Cart -->
              <button
                @click="addToCart(product)"
                class="flex-grow bg-primary-red hover:bg-primary-red-hover text-white py-3 rounded-xl font-bold text-[11px] transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] cursor-pointer"
              >
                <ShoppingCartIcon class="w-3.5 h-3.5" />
                Add to Cart
              </button>

              <!-- Order on WhatsApp -->
              <a
                :href="getWhatsAppCheckoutUrl(product)"
                target="_blank"
                rel="noopener noreferrer"
                class="w-28 bg-whatsapp-green hover:bg-whatsapp-green-hover text-white py-3 rounded-xl font-bold text-[11px] transition-all duration-300 shadow-sm flex items-center justify-center gap-1 hover:scale-[1.02] shrink-0"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.493 5.348 1.495 5.247.002 9.518-4.265 9.522-9.518.002-2.546-.988-4.941-2.79-6.746a9.467 9.467 0 0 0-6.727-2.793c-5.25 0-9.521 4.265-9.525 9.52-.001 2.11.561 4.18 1.625 5.955l-.986 3.6 3.693-.97c1.61.879 3.328 1.341 4.863 1.341h.003zm9.052-5.466c-.302-.15-1.785-.882-2.062-.983-.277-.101-.478-.15-.678.15-.2.3-.775.983-.95 1.183-.175.2-.35.226-.652.076-.302-.15-1.276-.47-2.43-1.499-.899-.802-1.505-1.792-1.681-2.093-.176-.3-.019-.462.132-.612.136-.135.302-.35.454-.526.15-.175.2-.3.302-.5.101-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.24-.244-.59-.493-.51-.678-.52-.176-.01-.377-.012-.578-.012-.2 0-.527.075-.803.376-.277.301-1.056 1.033-1.056 2.52 0 1.488 1.082 2.923 1.232 3.124.15.201 2.13 3.253 5.16 4.56.72.311 1.282.497 1.72.637.724.229 1.382.197 1.902.12.58-.087 1.785-.73 2.036-1.433.252-.704.252-1.307.176-1.433-.075-.126-.277-.201-.579-.352z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { brand } from '../lib/brand';
import { useProductsStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { ShoppingCart as ShoppingCartIcon } from 'lucide-vue-next';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const productsStore = useProductsStore();
const cartStore = useCartStore();

const addToCart = (product) => {
  const selectedW = selectedWeights.value[product._id] || '250g';
  cartStore.addToCart(product, selectedW, 1);
  if (window.showToast) {
    window.showToast(`Added ${product.name} (${selectedW}) to cart!`, 'success');
  }
};
const searchQuery = ref('');
const selectedCategory = ref('All');

// Categories filter list
const categories = ['All', 'Achaar', 'Papad', 'Chutney', 'Seasonal'];

// Map to track active selected weight per product ID
const selectedWeights = ref({});

onMounted(async () => {
  await productsStore.fetchProducts(false);
  
  // Set default weight for each loaded product
  productsStore.products.forEach(product => {
    const available = getAvailableWeights(product);
    if (available.length > 0) {
      selectedWeights.value[product._id] = available[0];
    }
  });
});

// Reset filters
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'All';
};

// Retrieve available weights array
const getAvailableWeights = (product) => {
  if (product.weights && product.weights.length > 0) {
    return product.weights;
  }
  
  // Fallback to keys of price if weights array missing
  if (product.price) {
    if (product.price instanceof Map) {
      return Array.from(product.price.keys());
    } else {
      return Object.keys(product.price);
    }
  }
  
  return ['250g'];
};

// Get image upload path
const getImageUrl = (imageName) => {
  return `/api/uploads/${imageName}`;
};

// Resolve price dynamically
const getPriceForSelectedWeight = (product) => {
  const selectedW = selectedWeights.value[product._id];
  if (!selectedW || !product.price) return 0;
  
  if (product.price instanceof Map) {
    return product.price.get(selectedW) || 0;
  } else {
    return product.price[selectedW] || 0;
  }
};

// Build click-to-chat URL
const getWhatsAppCheckoutUrl = (product) => {
  const selectedW = selectedWeights.value[product._id] || '250g';
  const price = getPriceForSelectedWeight(product);
  
  const text = `Assalam-o-Alaikum! I want to order "${product.name}" - ${selectedW} for Rs. ${price}. Please confirm my order.`;
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`;
};

// Filtered and searched list
const filteredProducts = computed(() => {
  return productsStore.products.filter(product => {
    const matchesCategory = selectedCategory.value === 'All' || product.category === selectedCategory.value;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

// Watch products list to initialize selectedWeights map on async load
watch(() => productsStore.products, (newProducts) => {
  newProducts.forEach(product => {
    if (!selectedWeights.value[product._id]) {
      const available = getAvailableWeights(product);
      if (available.length > 0) {
        selectedWeights.value[product._id] = available[0];
      }
    }
  });
}, { deep: true });
</script>
