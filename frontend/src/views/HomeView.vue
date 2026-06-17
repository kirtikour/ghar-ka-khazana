<template>
  <div class="space-y-20 pb-20 bg-white">
    <!-- Hero Section -->
    <section class="relative h-[500px] sm:h-[580px] lg:h-[640px] flex items-center overflow-hidden">
      <!-- Background Cover Image -->
      <div 
        class="absolute inset-0 bg-cover bg-center z-0" 
        :style="{ backgroundImage: `url(${heroImg})` }"
      ></div>
      <!-- Dark overlay for high contrast text readability -->
      <div class="absolute inset-0 bg-black/45 z-10"></div>
      
      <!-- Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div class="max-w-2xl space-y-6 text-left">
          <!-- Orange/Mustard Badge -->
          <div class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#F39C12] text-white">
            <span>🍯</span> Homemade in Karachi
          </div>
          
          <!-- Heading -->
          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Ghar ka swad, aapke darwaze tak
          </h1>
          
          <!-- Subheading -->
          <p class="text-base sm:text-lg text-gray-200 leading-relaxed font-light">
            Homemade pickles, papads, and chutneys made with love in Karachi
          </p>
          
          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <router-link
              to="/products"
              class="w-full sm:w-auto text-center bg-primary-red hover:bg-primary-red-hover text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              Browse Products
            </router-link>
            <a
              :href="whatsappHeroUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto text-center bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <!-- WhatsApp Icon -->
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.493 5.348 1.495 5.247.002 9.518-4.265 9.522-9.518.002-2.546-.988-4.941-2.79-6.746a9.467 9.467 0 0 0-6.727-2.793c-5.25 0-9.521 4.265-9.525 9.52-.001 2.11.561 4.18 1.625 5.955l-.986 3.6 3.693-.97c1.61.879 3.328 1.341 4.863 1.341h.003zm9.052-5.466c-.302-.15-1.785-.882-2.062-.983-.277-.101-.478-.15-.678.15-.2.3-.775.983-.95 1.183-.175.2-.35.226-.652.076-.302-.15-1.276-.47-2.43-1.499-.899-.802-1.505-1.792-1.681-2.093-.176-.3-.019-.462.132-.612.136-.135.302-.35.454-.526.15-.175.2-.3.302-.5.101-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.24-.244-.59-.493-.51-.678-.52-.176-.01-.377-.012-.578-.012-.2 0-.527.075-.803.376-.277.301-1.056 1.033-1.056 2.52 0 1.488 1.082 2.923 1.232 3.124.15.201 2.13 3.253 5.16 4.56.72.311 1.282.497 1.72.637.724.229 1.382.197 1.902.12.58-.087 1.785-.73 2.036-1.433.252-.704.252-1.307.176-1.433-.075-.126-.277-.201-.579-.352z"/>
              </svg>
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section v-reveal class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24">
      <div class="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="flex items-start gap-4 p-4 rounded-2xl hover:bg-bg-light/35 transition-colors">
          <div class="w-12 h-12 shrink-0 rounded-2xl bg-red-50 text-primary-red flex items-center justify-center text-2xl shadow-inner">
            🌿
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-text-dark text-base">Pure Ingredients</h3>
            <p class="text-xs text-gray-500 leading-relaxed">No added preservatives, artificial flavor enhancers, or coloring powders.</p>
          </div>
        </div>
        <!-- Feature 2 -->
        <div class="flex items-start gap-4 p-4 rounded-2xl hover:bg-bg-light/35 transition-colors border-y md:border-y-0 md:border-x border-gray-100">
          <div class="w-12 h-12 shrink-0 rounded-2xl bg-yellow-50 text-accent-mustard flex items-center justify-center text-2xl shadow-inner">
            🏠
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-text-dark text-base">Homemade Cleanliness</h3>
            <p class="text-xs text-gray-500 leading-relaxed">Prepared inside a hygienic home environment in small, monitored batches.</p>
          </div>
        </div>
        <!-- Feature 3 -->
        <div class="flex items-start gap-4 p-4 rounded-2xl hover:bg-bg-light/35 transition-colors">
          <div class="w-12 h-12 shrink-0 rounded-2xl bg-green-50 text-whatsapp-green flex items-center justify-center text-2xl shadow-inner">
            🚚
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-text-dark text-base">Karachi-wide Delivery</h3>
            <p class="text-xs text-gray-500 leading-relaxed">Packaged in leak-proof jars and delivered fresh to your doorstep.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Sellers Grid -->
    <section v-reveal class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center space-y-3">
        <span class="text-primary-red font-bold text-xs uppercase tracking-widest block">Customer Favorites</span>
        <h2 class="text-3xl font-extrabold text-text-dark inline-block relative">
          Featured Best Sellers
          <span class="absolute -bottom-1 left-4 right-4 h-1 bg-accent-mustard rounded-full"></span>
        </h2>
        <p class="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
          The jars that fly off our shelves fastest! Prepared fresh using authentic spice profiles.
        </p>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="productsStore.loading" message="Loading freshly loaded jars..." />

      <!-- Error State -->
      <div v-else-if="productsStore.error" class="text-center py-12 text-red-600 font-medium bg-red-50 rounded-2xl">
        {{ productsStore.error }}
      </div>

      <!-- Grid Layout for Featured Products -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="product in featuredProducts" 
          :key="product._id"
          class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
        >
          <!-- Product Image Container -->
          <div class="relative h-48 sm:h-52 bg-gray-50 overflow-hidden shrink-0">
            <img 
              :src="getImageUrl(product.image)" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span class="absolute top-3 left-3 bg-primary-red/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {{ product.category }}
            </span>
          </div>

          <!-- Product Body -->
          <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
            <div class="space-y-1">
              <h3 class="font-extrabold text-text-dark text-base leading-tight group-hover:text-primary-red transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-xxs text-gray-400 line-clamp-2 h-7 leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Price and Weight Variants Selection -->
            <div class="flex items-center justify-between gap-4 pt-3 border-t border-gray-50">
              <div>
                <label class="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Weight</label>
                <select
                  v-model="selectedWeights[product._id]"
                  class="bg-bg-light border border-red-50 text-text-dark font-semibold text-[11px] py-1 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-red cursor-pointer"
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
                <span class="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Price</span>
                <span class="text-sm font-extrabold text-primary-red">
                  Rs. {{ getPriceForSelectedWeight(product) }}
                </span>
              </div>
            </div>

            <!-- Dual Action Buttons / Out of Stock -->
            <div class="pt-1">
              <!-- Out of Stock State -->
              <div v-if="product.stock <= 0" class="w-full text-center py-2.5 bg-gray-100 text-gray-400 font-bold rounded-xl text-xs border border-gray-250 shrink-0">
                Out of Stock
              </div>

              <!-- Dual Action Buttons when in stock -->
              <div v-else class="flex gap-2">
                <!-- Add to Cart -->
                <button
                  @click="addToCart(product)"
                  class="flex-grow bg-primary-red hover:bg-primary-red-hover text-white py-2.5 rounded-xl font-bold text-[10px] transition-all duration-300 shadow-sm flex items-center justify-center gap-1 hover:scale-[1.02] cursor-pointer"
                >
                  <ShoppingCartIcon class="w-3.5 h-3.5" />
                  Add
                </button>

                <!-- Order on WhatsApp -->
                <a
                  :href="getWhatsAppCheckoutUrl(product)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-24 bg-whatsapp-green hover:bg-whatsapp-green-hover text-white py-2.5 rounded-xl font-bold text-[10px] transition-all duration-300 shadow-sm flex items-center justify-center gap-1 hover:scale-[1.02] shrink-0"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Catalog Redirect Button -->
      <div class="text-center pt-4">
        <router-link
          to="/products"
          class="inline-flex items-center gap-2 bg-bg-light hover:bg-red-50/70 border border-primary-red/10 text-primary-red px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-colors"
        >
          View Entire Menu ➔
        </router-link>
      </div>
    </section>

    <!-- Traditional Culinary Story Section -->
    <section v-reveal class="bg-bg-light relative py-20 overflow-hidden">
      <!-- Top wave divider -->
      <div class="absolute top-0 left-0 right-0 hand-divider-top"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <!-- Kitchen Photo Frame -->
          <div class="flex-1 w-full max-w-md lg:max-w-none">
            <div class="relative">
              <div class="absolute -inset-3 bg-accent-mustard/20 rounded-3xl blur-md rotate-2"></div>
              <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <img 
                  :src="kitchenImg" 
                  alt="Drying traditional spices and pickles" 
                  class="w-full h-[350px] object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Story Text Block -->
          <div class="flex-grow flex-1 space-y-6">
            <span class="text-primary-red font-bold text-xs uppercase tracking-widest block">Made With Love</span>
            <h2 class="text-3xl font-extrabold text-text-dark leading-tight">
              Recipes Passed Down Through Generations
            </h2>
            <p class="text-sm sm:text-base text-gray-500 leading-relaxed font-light">
              At GharKaZaika, we believe in the magic of slow curing. We don't use heavy machinery or chemical vinegar to rush the fermentation process. Our organic vegetables are hand-picked, washed, solar-dried, and cured in standard jars using cold-pressed mustard oil and local whole spices.
            </p>
            
            <!-- Key value bullets list -->
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-text-dark">
              <li class="flex items-center gap-2">
                <span class="text-accent-mustard text-base">✔</span> 👴 Authentic Family Spice Profiles
              </li>
              <li class="flex items-center gap-2">
                <span class="text-accent-mustard text-base">✔</span> 🌻 Pure, Unadulterated Oils
              </li>
              <li class="flex items-center gap-2">
                <span class="text-accent-mustard text-base">✔</span> 🧼 Strict Kitchen Hygiene Checks
              </li>
              <li class="flex items-center gap-2">
                <span class="text-accent-mustard text-base">✔</span> 🥣 Cured Natural Sunlight Aging
              </li>
            </ul>

            <div class="pt-4">
              <router-link 
                to="/about" 
                class="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary-red hover:text-primary-red-hover transition-colors"
              >
                Read Our Story ➔
              </router-link>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Bottom wave divider -->
      <div class="absolute bottom-0 left-0 right-0 hand-divider"></div>
    </section>

    <!-- Testimonials Grid Section -->
    <section v-reveal class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center space-y-3">
        <span class="text-primary-red font-bold text-xs uppercase tracking-widest block">Customer Reviews</span>
        <h2 class="text-3xl font-extrabold text-text-dark inline-block relative">
          Loved in Karachi Homes
          <span class="absolute -bottom-1 left-4 right-4 h-1 bg-accent-mustard rounded-full"></span>
        </h2>
        <p class="text-gray-500 text-xs sm:text-sm">
          Hear from real families who order GharKaZaika jars monthly.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Review 1 -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative">
          <span class="text-6xl text-gray-100 font-serif absolute top-4 right-6 pointer-events-none">“</span>
          <p class="text-xs sm:text-sm text-gray-500 italic leading-relaxed relative z-10">
            "The mango achaar is incredibly delicious! It takes me back to my grandmother's house. Pure mustard oil, perfect spices, and the mangoes are so tender. Best purchase in Karachi."
          </p>
          <div class="flex items-center gap-3 border-t border-gray-50 pt-4">
            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-black text-sm text-primary-red shrink-0">
              SK
            </div>
            <div>
              <h4 class="font-extrabold text-text-dark text-xs sm:text-sm">Sadia Khan</h4>
              <p class="text-[10px] text-yellow-500 tracking-wider">★★★★★</p>
            </div>
          </div>
        </div>

        <!-- Review 2 -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative">
          <span class="text-6xl text-gray-100 font-serif absolute top-4 right-6 pointer-events-none">“</span>
          <p class="text-xs sm:text-sm text-gray-500 italic leading-relaxed relative z-10">
            "Their Masala Papad is incredibly crispy and light. I roast it with onions and tomatoes every evening. It is completely oil-free and has a fantastic aroma of roasted cumin!"
          </p>
          <div class="flex items-center gap-3 border-t border-gray-50 pt-4">
            <div class="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center font-black text-sm text-accent-mustard shrink-0">
              AR
            </div>
            <div>
              <h4 class="font-extrabold text-text-dark text-xs sm:text-sm">Ali Rizvi</h4>
              <p class="text-[10px] text-yellow-500 tracking-wider">★★★★★</p>
            </div>
          </div>
        </div>

        <!-- Review 3 -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative">
          <span class="text-6xl text-gray-100 font-serif absolute top-4 right-6 pointer-events-none">“</span>
          <p class="text-xs sm:text-sm text-gray-500 italic leading-relaxed relative z-10">
            "I ordered their sweet & sour tamarind (imli) chutney and garlic chutney. Hands down the best condiments in town! The delivery was very fast and packaging was securely sealed."
          </p>
          <div class="flex items-center gap-3 border-t border-gray-50 pt-4">
            <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-black text-sm text-whatsapp-green shrink-0">
              MF
            </div>
            <div>
              <h4 class="font-extrabold text-text-dark text-xs sm:text-sm">Mariam Fatima</h4>
              <p class="text-[10px] text-yellow-500 tracking-wider">★★★★★</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { brand } from '../lib/brand';
import { useProductsStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { ShoppingCart as ShoppingCartIcon } from 'lucide-vue-next';
import LoadingSpinner from '../components/LoadingSpinner.vue';

// Static assets
import heroImg from '../assets/hero.jpg';
import kitchenImg from '../assets/kitchen.jpg';

const productsStore = useProductsStore();
const cartStore = useCartStore();
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

// Get first 4 products
const featuredProducts = computed(() => {
  return productsStore.products.slice(0, 4);
});

// Resolve image URL
const getImageUrl = (imageName) => {
  return `/uploads/${imageName}`;
};

// Retrieve starting price
const getStartingPrice = (priceMap) => {
  if (!priceMap) return 0;
  
  let prices = [];
  if (priceMap instanceof Map) {
    prices = Array.from(priceMap.values());
  } else {
    prices = Object.values(priceMap);
  }
  
  return prices.length > 0 ? Math.min(...prices) : 0;
};

// Retrieve available weights array
const getAvailableWeights = (product) => {
  if (product.weights && product.weights.length > 0) {
    return product.weights;
  }
  
  if (product.price) {
    if (product.price instanceof Map) {
      return Array.from(product.price.keys());
    } else {
      return Object.keys(product.price);
    }
  }
  
  return ['250g'];
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

const addToCart = (product) => {
  const selectedW = selectedWeights.value[product._id] || '250g';
  cartStore.addToCart(product, selectedW, 1);
  if (window.showToast) {
    window.showToast(`Added ${product.name} (${selectedW}) to cart!`, 'success');
  }
};

const whatsappHeroUrl = computed(() => {
  const message = encodeURIComponent("Assalam-o-Alaikum! I'm visiting your website and would like to order some homemade pickles/papads.");
  return `https://wa.me/${brand.whatsappNumber}?text=${message}`;
});
</script>
