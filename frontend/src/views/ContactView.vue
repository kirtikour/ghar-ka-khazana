<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <!-- Header -->
    <div class="text-center space-y-3">
      <h1 class="text-4xl font-extrabold text-text-dark inline-block relative">
        Contact Us
        <span class="absolute -bottom-2 left-0 right-0 h-1 bg-accent-mustard rounded-full"></span>
      </h1>
      <p class="text-gray-500 text-sm max-w-md mx-auto pt-2">
        Have questions about custom weights, wedding catering, or orders? Message us directly!
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <!-- Contact Details & Socials Card -->
      <div class="bg-primary-red-hover text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 h-full flex flex-col justify-between">
        <div class="space-y-6">
          <h2 class="text-2xl font-bold">GharKaZaika Kitchen</h2>
          <p class="text-red-100 text-sm leading-relaxed">
            We are based in Karachi, Sindh. Since we are a home kitchen operation, we manage our deliveries through local logistics partners. You can pick up your jars or get them delivered.
          </p>

          <div class="space-y-4 pt-4 text-sm">
            <div class="flex items-center gap-4">
              <span class="text-2xl bg-red-800 p-2.5 rounded-xl">📍</span>
              <div>
                <p class="text-xs text-red-300 uppercase tracking-widest font-bold">Location</p>
                <p class="font-semibold text-white">{{ brand.address }}</p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-2xl bg-red-800 p-2.5 rounded-xl">📞</span>
              <div>
                <p class="text-xs text-red-300 uppercase tracking-widest font-bold">WhatsApp / Call</p>
                <p class="font-semibold text-white">{{ brand.whatsappDisplay }}</p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-2xl bg-red-800 p-2.5 rounded-xl">✉️</span>
              <div>
                <p class="text-xs text-red-300 uppercase tracking-widest font-bold">Email</p>
                <a :href="'mailto:' + brand.email" class="font-semibold text-white hover:underline">{{ brand.email }}</a>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-8 border-t border-red-800">
          <p class="text-xs text-red-300 uppercase tracking-widest font-bold">Follow Our Kitchen Stories</p>
          <div class="flex gap-4">
            <a 
              :href="brand.instagram" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="flex items-center gap-2 bg-red-800 hover:bg-red-950 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow"
            >
              📸 Instagram
            </a>
            <a 
              :href="brand.facebook" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="flex items-center gap-2 bg-red-800 hover:bg-red-950 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow"
            >
              👥 Facebook
            </a>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <h2 class="text-2xl font-bold text-text-dark">Send a Message</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div class="space-y-1">
            <label for="name" class="block text-xs font-bold uppercase tracking-wider text-gray-500">Your Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Zainab Ahmed"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50 shadow-inner"
            />
          </div>

          <!-- Phone -->
          <div class="space-y-1">
            <label for="phone" class="block text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              placeholder="e.g. 03001234567"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50 shadow-inner"
            />
          </div>

          <!-- Message -->
          <div class="space-y-1">
            <label for="message" class="block text-xs font-bold uppercase tracking-wider text-gray-500">Your Message</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="4"
              placeholder="Tell us what you would like to order or ask..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50 shadow-inner"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              class="flex-1 bg-whatsapp-green hover:bg-whatsapp-green-hover text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              💬 Open in WhatsApp
            </button>
            <button
              type="button"
              @click="handleMailto"
              class="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              ✉️ Send Email Instead
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { brand } from '../lib/brand';

const form = ref({
  name: '',
  phone: '',
  message: ''
});

const buildWhatsAppText = () => {
  return `Assalam-o-Alaikum!
My Name: ${form.value.name}
My Phone: ${form.value.phone}
Message: ${form.value.message}`;
};

const handleSubmit = () => {
  const text = buildWhatsAppText();
  const url = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  
  // Optional toast
  if (window.showToast) {
    window.showToast('Redirecting to WhatsApp chat...', 'success');
  }
};

const handleMailto = () => {
  const subject = encodeURIComponent('GharKaZaika Inquiry');
  const body = encodeURIComponent(buildWhatsAppText());
  const url = `mailto:${brand.email}?subject=${subject}&body=${body}`;
  window.open(url, '_blank');
};
</script>
