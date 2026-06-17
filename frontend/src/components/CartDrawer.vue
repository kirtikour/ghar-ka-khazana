<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <!-- Backdrop overlay -->
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
      @click="closeCart"
    >
      <transition
        enter-active-class="transition duration-300 ease-out transform"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in transform"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <!-- Drawer Panel -->
        <div
          v-if="cartStore.isOpen"
          class="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative"
          @click.stop
        >
          <!-- Header -->
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🛒</span>
              <h2 class="text-xl font-bold text-text-dark">Your Shopping Cart</h2>
              <span class="bg-primary-red/10 text-primary-red text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                {{ cartStore.cartCount }}
              </span>
            </div>
            <button
              @click="closeCart"
              class="p-2 text-gray-400 hover:text-primary-red rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Cart Items List -->
          <div class="flex-grow overflow-y-auto p-6 space-y-4">
            <!-- Empty state -->
            <div v-if="cartStore.items.length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-4xl animate-bounce">
                🫙
              </div>
              <h3 class="text-lg font-bold text-text-dark">Your cart is empty</h3>
              <p class="text-gray-500 text-sm max-w-xs">
                Looks like you haven't added any of our delicious homemade pickles or papads yet.
              </p>
              <button
                @click="startShopping"
                class="bg-primary-red hover:bg-primary-red-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-md cursor-pointer hover:scale-105"
              >
                Start Shopping
              </button>
            </div>

            <!-- Items list -->
            <div
              v-else
              v-for="item in cartStore.items"
              :key="item.productId + '_' + item.weight"
              class="flex items-center gap-4 bg-bg-light p-4 rounded-xl border border-red-50/50 hover:border-red-100/50 transition-colors"
            >
              <!-- Image / Icon -->
              <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-150 shrink-0 flex items-center justify-center text-2xl">
                <img
                  v-if="item.image"
                  :src="`/api/uploads/${item.image}`"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <span v-else>🫙</span>
              </div>

              <!-- Product Details -->
              <div class="flex-grow min-w-0">
                <h4 class="font-bold text-text-dark text-sm truncate">{{ item.name }}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xxs font-semibold bg-accent-mustard/20 text-accent-mustard-hover px-2 py-0.5 rounded">
                    {{ item.weight }}
                  </span>
                  <span class="text-xs text-gray-500">Rs. {{ item.price }}</span>
                </div>

                <!-- Quantity controls -->
                <div class="flex items-center gap-3 mt-3">
                  <button
                    @click="updateQty(item, item.quantity - 1)"
                    class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-primary-red hover:border-primary-red hover:bg-red-50/30 transition-colors cursor-pointer text-sm font-bold"
                  >
                    <MinusIcon class="w-3.5 h-3.5" />
                  </button>
                  <span class="text-sm font-bold text-text-dark w-6 text-center">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="updateQty(item, item.quantity + 1)"
                    :disabled="item.quantity >= item.stock"
                    class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-primary-red hover:border-primary-red hover:bg-red-50/30 transition-colors cursor-pointer text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <PlusIcon class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Price & Remove -->
              <div class="flex flex-col items-end justify-between h-16 shrink-0">
                <span class="font-extrabold text-primary-red text-sm">
                  Rs. {{ item.price * item.quantity }}
                </span>
                <button
                  @click="removeItem(item)"
                  class="text-gray-400 hover:text-primary-red p-1 rounded-lg transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Footer Summary / CTA -->
          <div v-if="cartStore.items.length > 0" class="p-6 border-t border-gray-100 bg-bg-light/60 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 font-medium">Subtotal</span>
              <span class="text-2xl font-black text-text-dark">Rs. {{ cartStore.cartTotal }}</span>
            </div>
            
            <p class="text-xxs text-gray-400 leading-normal">
              Prices exclude any delivery charges. All deliveries are currently dispatched as Cash-on-Delivery (COD) inside Karachi.
            </p>

            <div class="grid grid-cols-1 gap-2 pt-2">
              <button
                @click="proceedToCheckout"
                class="w-full bg-primary-red hover:bg-primary-red-hover text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRightIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import { X as XIcon, Plus as PlusIcon, Minus as MinusIcon, Trash2 as TrashIcon, ArrowRight as ArrowRightIcon } from 'lucide-vue-next';

const cartStore = useCartStore();
const router = useRouter();

const closeCart = () => {
  cartStore.isOpen = false;
};

const updateQty = (item, newQty) => {
  cartStore.updateQuantity(item.productId, item.weight, newQty);
};

const removeItem = (item) => {
  cartStore.removeFromCart(item.productId, item.weight);
  if (window.showToast) {
    window.showToast(`Removed "${item.name}" from cart`, 'info');
  }
};

const startShopping = () => {
  closeCart();
  router.push('/products');
};

const proceedToCheckout = () => {
  closeCart();
  cartStore.isCheckoutOpen = true;
};
</script>
