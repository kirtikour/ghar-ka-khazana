<template>
  <div class="space-y-16 pb-16">
    <!-- Header -->
    <section class="bg-bg-light py-16 relative overflow-hidden">
      <div class="max-w-4xl mx-auto text-center space-y-4 px-4 sm:px-6 relative z-10">
        <span class="text-primary-red font-bold text-xs uppercase tracking-widest">Our Heritage</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-text-dark">Our Story</h1>
        <p class="text-base text-gray-500 max-w-xl mx-auto italic">
          "Bringing the taste of grandma's traditional kitchen straight to your dining table in Karachi."
        </p>
      </div>
      <div class="absolute bottom-0 left-0 right-0 hand-divider"></div>
    </section>

    <!-- Main Story -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-1 w-full max-w-md lg:max-w-none">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1">
            <img 
              :src="kitchenImg" 
              alt="Hygienic Home Kitchen Spice Mix" 
              class="w-full h-[400px] object-cover"
            />
          </div>
        </div>
        
        <div class="flex-1 space-y-6">
          <h2 class="text-3xl font-extrabold text-text-dark">How We Started</h2>
          <p class="text-gray-600 leading-relaxed">
            GharKaZaika began during a hot summer in Karachi as a small family gathering. Craving the authentic, spicy pickles of our childhood—pickles aged slowly under the sun and packed with warm whole spices—we realized modern store-bought pickles lacked that comforting desi taste and were filled with chemical preservatives.
          </p>
          <p class="text-gray-600 leading-relaxed">
            We decided to prepare a small batch of our signature **Teekha Mango Achaar** using a traditional recipe passed down by our grandmother. We shared jars with neighbors in Karachi, and the response was overwhelming. That's when GharKaZaika was born: a mission to preserve the authentic culinary heritage of Pakistan, and deliver it straight to your doorstep.
          </p>
          
          <div class="border-l-4 border-accent-mustard pl-4 italic text-gray-500 text-sm">
            "We do not cook in massive industrial vats. We prepare our pickles in small, careful batches under strict home hygiene standards, letting sunlight do the curing."
          </div>
        </div>
      </div>
    </section>

    <!-- Values Bullet Points -->
    <section class="bg-bg-light py-16 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 hand-divider-top"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center space-y-2">
          <h2 class="text-3xl font-extrabold text-text-dark">Why Choose GharKaZaika?</h2>
          <div class="w-24 h-1 bg-accent-mustard mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white p-6 rounded-2xl shadow-md space-y-3 border border-gray-100 flex flex-col items-center text-center">
            <span class="text-3xl">🚫🎨</span>
            <h3 class="font-bold text-text-dark text-base">No Artificial Colors</h3>
            <p class="text-xs text-gray-500">We use pure Kashmiri red chilies and organic turmeric to achieve our beautiful golden mustard and deep red hues.</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-md space-y-3 border border-gray-100 flex flex-col items-center text-center">
            <span class="text-3xl">📜👵</span>
            <h3 class="font-bold text-text-dark text-base">Traditional Recipes</h3>
            <p class="text-xs text-gray-500">Every pickle jar is cured over weeks using cold-pressed mustard oil, and authentic spice mixes passed down generations.</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-md space-y-3 border border-gray-100 flex flex-col items-center text-center">
            <span class="text-3xl">🥣✨</span>
            <h3 class="font-bold text-text-dark text-base">Fresh Batches</h3>
            <p class="text-xs text-gray-500">We do not store stock for months. We package and deliver fresh batches weekly to ensure crispness and max aroma.</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-md space-y-3 border border-gray-100 flex flex-col items-center text-center">
            <span class="text-3xl">📦👩‍🍳</span>
            <h3 class="font-bold text-text-dark text-base">Made to Order</h3>
            <p class="text-xs text-gray-500">Your jars are sealed and labeled with love right before they go out for delivery across Karachi, ensuring top-tier quality.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Info summary -->
    <section class="max-w-3xl mx-auto text-center px-4 sm:px-6 space-y-6">
      <h2 class="text-2xl font-bold text-text-dark">Have Questions or Custom Orders?</h2>
      <p class="text-gray-500 text-sm">
        We cater to custom packing requests, low-salt variations, and catering orders for weddings or family events. Reach out to us directly!
      </p>
      <div>
        <router-link
          to="/contact"
          class="inline-flex items-center gap-2 bg-primary-red hover:bg-primary-red-hover text-white px-8 py-3 rounded-full font-bold shadow-md transition-all duration-300"
        >
          Contact Our Kitchen
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { brand } from '../lib/brand';
import kitchenImg from '../assets/kitchen.jpg';
</script>
