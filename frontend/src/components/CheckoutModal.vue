<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <!-- Modal backdrop -->
    <div
      v-if="cartStore.isCheckoutOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click="closeCheckout"
    >
      <transition
        enter-active-class="transition duration-300 ease-out transform"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in transform"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <!-- Modal panel -->
        <div
          v-if="cartStore.isCheckoutOpen"
          class="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
          @click.stop
        >
          <!-- Close button -->
          <button
            @click="closeCheckout"
            class="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-primary-red rounded-lg transition-colors cursor-pointer bg-white/80 backdrop-blur-sm shadow-sm"
            aria-label="Close modal"
          >
            <XIcon class="w-6 h-6" />
          </button>

          <!-- 1. Form Mode -->
          <template v-if="!isSuccess">
            <!-- Left Side: Form Details (60%) -->
            <div class="p-6 sm:p-8 md:w-3/5 space-y-6">
              <div class="space-y-1">
                <span class="text-xs font-bold uppercase tracking-widest text-accent-mustard-hover">Direct Checkout</span>
                <h2 class="text-2xl sm:text-3xl font-black text-text-dark">Delivery Details</h2>
                <p class="text-xs text-gray-400">Please provide your details below to place your Cash-on-Delivery (COD) order.</p>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Name -->
                <div>
                  <label for="name" class="block text-xs font-bold text-text-dark mb-1">Full Name *</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-bg-light/40"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="block text-xs font-bold text-text-dark mb-1">WhatsApp / Contact Number *</label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="e.g. 0335-2787538"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-bg-light/40"
                  />
                </div>

                <!-- Address -->
                <div>
                  <label for="address" class="block text-xs font-bold text-text-dark mb-1">Karachi Delivery Address *</label>
                  <textarea
                    id="address"
                    v-model="form.address"
                    rows="3"
                    required
                    placeholder="Enter your complete delivery address in Karachi (Area, Street, House #)"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-bg-light/40 resize-none"
                  ></textarea>
                </div>

                <!-- Notes -->
                <div>
                  <label for="notes" class="block text-xs font-bold text-text-dark mb-1">Special Instructions (Optional)</label>
                  <textarea
                    id="notes"
                    v-model="form.notes"
                    rows="2"
                    placeholder="Any preferences (e.g. Less spicy, call before delivery)"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-bg-light/40 resize-none"
                  ></textarea>
                </div>

                <!-- Error alerts -->
                <div v-if="errorMsg" class="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                  {{ errorMsg }}
                </div>

                <!-- Submit buttons -->
                <div class="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    @click="closeCheckout"
                    class="px-5 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="flex-grow bg-primary-red hover:bg-primary-red-hover text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LoaderIcon v-if="loading" class="w-4 h-4 animate-spin" />
                    Place Cash on Delivery Order (Rs. {{ cartStore.cartTotal }})
                  </button>
                </div>
              </form>
            </div>

            <!-- Right Side: Order Summary Panel (40%) -->
            <div class="bg-bg-light p-6 sm:p-8 md:w-2/5 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-4 border-b border-gray-200/60">
                  <ShoppingBagIcon class="w-5 h-5 text-primary-red" />
                  <h3 class="font-bold text-text-dark">Order Summary</h3>
                </div>

                <!-- Summary item list -->
                <div class="max-h-60 overflow-y-auto pr-1 space-y-4">
                  <div
                    v-for="item in cartStore.items"
                    :key="item.productId + '_' + item.weight"
                    class="flex items-start justify-between text-xs"
                  >
                    <div class="min-w-0 pr-4 space-y-0.5">
                      <p class="font-bold text-text-dark truncate">{{ item.name }}</p>
                      <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        {{ item.weight }} &times; {{ item.quantity }}
                      </p>
                    </div>
                    <span class="font-extrabold text-text-dark shrink-0">
                      Rs. {{ item.price * item.quantity }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Calculations -->
              <div class="pt-6 border-t border-gray-200/60 space-y-3 mt-6">
                <div class="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Subtotal</span>
                  <span>Rs. {{ cartStore.cartTotal }}</span>
                </div>
                <div class="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Delivery Fee</span>
                  <span class="text-primary-red uppercase tracking-wider text-[10px] font-bold">COD (Karachi)</span>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                  <span class="text-sm font-bold text-text-dark">Total Amount</span>
                  <span class="text-xl font-black text-primary-red">Rs. {{ cartStore.cartTotal }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 2. Success Receipt Mode -->
          <template v-else>
            <div class="p-6 sm:p-8 w-full space-y-6 flex flex-col items-center">
              <div class="text-center space-y-2 max-w-md">
                <div class="w-16 h-16 bg-green-50 text-whatsapp-green rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner animate-bounce">
                  ✓
                </div>
                <h2 class="text-2xl sm:text-3xl font-black text-text-dark">Order Placed! 🎉</h2>
                <p class="text-xs text-gray-500 leading-normal">
                  Thank you for ordering with us. Your order status is currently <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold text-[10px] uppercase">Pending</span>. We will call you soon to confirm details.
                </p>
              </div>

              <!-- Receipt Container -->
              <div class="w-full max-w-xl bg-bg-light border border-gray-150 rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
                <div class="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <span class="text-gray-400 font-medium">Order Reference:</span>
                    <p class="font-extrabold text-text-dark text-sm">#{{ placedOrder._id }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 font-medium">Order Date:</span>
                    <p class="font-extrabold text-text-dark">{{ formatDate(placedOrder.createdAt) }}</p>
                  </div>
                </div>

                <!-- Customer Details -->
                <div class="grid grid-cols-2 gap-4 pb-3 border-b border-gray-200">
                  <div>
                    <span class="text-gray-400 font-medium">Deliver To:</span>
                    <p class="font-bold text-text-dark mt-0.5">{{ placedOrder.customerName }}</p>
                    <p class="font-semibold text-gray-500 mt-0.5">{{ placedOrder.phone }}</p>
                  </div>
                  <div>
                    <span class="text-gray-400 font-medium">Delivery Location:</span>
                    <p class="text-gray-600 font-semibold leading-relaxed mt-0.5">{{ placedOrder.address }}</p>
                  </div>
                </div>

                <!-- Items list -->
                <div class="space-y-3">
                  <span class="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Items Ordered:</span>
                  <div class="space-y-2.5">
                    <div
                      v-for="item in placedOrder.items"
                      :key="item._id || item.product"
                      class="flex items-center justify-between"
                    >
                      <span class="font-bold text-text-dark">
                        {{ item.name }}
                        <span class="text-gray-400 font-semibold text-[10px] ml-1">
                          ({{ item.weight }} &times; {{ item.quantity }})
                        </span>
                      </span>
                      <span class="font-extrabold text-text-dark">Rs. {{ item.price * item.quantity }}</span>
                    </div>
                  </div>
                </div>

                <!-- Notes if any -->
                <div v-if="placedOrder.notes" class="bg-white p-3 rounded-lg border border-gray-150 mt-2">
                  <span class="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Notes:</span>
                  <p class="text-gray-500 italic font-medium leading-relaxed">{{ placedOrder.notes }}</p>
                </div>

                <!-- Calculation Summary -->
                <div class="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span class="font-bold text-text-dark text-sm">Amount Payable (COD):</span>
                  <span class="text-lg font-black text-primary-red">Rs. {{ placedOrder.total }}</span>
                </div>
              </div>

              <!-- Success Actions -->
              <div class="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl pt-2">
                <!-- Share on WhatsApp -->
                <a
                  :href="whatsappShareUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full sm:flex-grow bg-whatsapp-green hover:bg-whatsapp-green-hover text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.493 5.348 1.495 5.247.002 9.518-4.265 9.522-9.518.002-2.546-.988-4.941-2.79-6.746a9.467 9.467 0 0 0-6.727-2.793c-5.25 0-9.521 4.265-9.525 9.52-.001 2.11.561 4.18 1.625 5.955l-.986 3.6 3.693-.97c1.61.879 3.328 1.341 4.863 1.341h.003zm9.052-5.466c-.302-.15-1.785-.882-2.062-.983-.277-.101-.478-.15-.678.15-.2.3-.775.983-.95 1.183-.175.2-.35.226-.652.076-.302-.15-1.276-.47-2.43-1.499-.899-.802-1.505-1.792-1.681-2.093-.176-.3-.019-.462.132-.612.136-.135.302-.35.454-.526.15-.175.2-.3.302-.5.101-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.24-.244-.59-.493-.51-.678-.52-.176-.01-.377-.012-.578-.012-.2 0-.527.075-.803.376-.277.301-1.056 1.033-1.056 2.52 0 1.488 1.082 2.923 1.232 3.124.15.201 2.13 3.253 5.16 4.56.72.311 1.282.497 1.72.637.724.229 1.382.197 1.902.12.58-.087 1.785-.73 2.036-1.433.252-.704.252-1.307.176-1.433-.075-.126-.277-.201-.579-.352z"/>
                  </svg>
                  Share Receipt on WhatsApp
                </a>

                <!-- Close / Finish -->
                <button
                  @click="handleSuccessClose"
                  class="w-full sm:w-auto px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Close & Keep Shopping
                </button>
              </div>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useCartStore } from '../stores/cart';
import { useOrdersStore } from '../stores/orders';
import { useRouter } from 'vue-router';
import { brand } from '../lib/brand';
import { X as XIcon, ShoppingBag as ShoppingBagIcon, Loader2 as LoaderIcon } from 'lucide-vue-next';

const cartStore = useCartStore();
const ordersStore = useOrdersStore();
const router = useRouter();

const loading = ref(false);
const isSuccess = ref(false);
const errorMsg = ref('');
const placedOrder = ref({});

const form = reactive({
  name: '',
  phone: '',
  address: '',
  notes: ''
});

const closeCheckout = () => {
  if (isSuccess.value) {
    handleSuccessClose();
  } else {
    cartStore.isCheckoutOpen = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleSubmit = async () => {
  if (cartStore.items.length === 0) {
    errorMsg.value = 'Your cart is empty. Please add items to checkout.';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  const orderItems = cartStore.items.map(item => ({
    productId: item.productId,
    weight: item.weight,
    quantity: item.quantity
  }));

  const payload = {
    customerName: form.name.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    items: orderItems,
    notes: form.notes.trim()
  };

  try {
    const result = await ordersStore.createOrder(payload);
    placedOrder.value = result;
    isSuccess.value = true;
    
    // Clear shopping cart on successful checkout
    cartStore.clearCart();
    
    if (window.showToast) {
      window.showToast('Order placed successfully!', 'success');
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = err.response?.data?.message || 'Failed to place order. Please try again.';
  } finally {
    loading.value = false;
  }
};

const whatsappShareUrl = computed(() => {
  if (!placedOrder.value || !placedOrder.value._id) return '';
  
  const o = placedOrder.value;
  let itemsText = '';
  o.items.forEach((item, index) => {
    itemsText += `\n${index + 1}. ${item.quantity}x ${item.name} (${item.weight}) - Rs. ${item.price * item.quantity}`;
  });

  const text = `Assalam-o-Alaikum GharKaZaika! 
I just placed a direct order on your web app. Here is my receipt:

*Order Reference:* #${o._id}
*Name:* ${o.customerName}
*Phone:* ${o.phone}
*Address:* ${o.address}
*Notes:* ${o.notes || 'N/A'}

*Items Ordered:*${itemsText}

*Total Payable Amount (COD):* Rs. ${o.total}

Please confirm my order. Thank you!`;

  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`;
});

const handleSuccessClose = () => {
  // Reset local state
  isSuccess.value = false;
  placedOrder.value = {};
  form.name = '';
  form.phone = '';
  form.address = '';
  form.notes = '';
  
  // Close the modal
  cartStore.isCheckoutOpen = false;
  
  // Route back to products catalog
  router.push('/products');
};
</script>
