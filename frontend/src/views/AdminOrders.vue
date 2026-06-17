<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-800">Order Manager</h1>
        <p class="text-sm text-gray-500">Record manual WhatsApp orders and manage statuses.</p>
      </div>
      <button
        @click="openAddOrderModal"
        class="bg-primary-red hover:bg-primary-red-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow flex items-center gap-2 cursor-pointer"
      >
        📝 Record New Order
      </button>
    </div>

    <!-- Filters & Summary -->
    <div class="bg-white p-4 rounded-xl border border-gray-100 flex flex-wrap gap-4 items-center justify-between shadow-sm">
      <div class="flex items-center gap-2">
        <label class="text-xs font-bold uppercase tracking-wider text-gray-400">Filter Status:</label>
        <select
          v-model="statusFilter"
          @change="filterOrders"
          class="bg-bg-light border border-red-50 text-text-dark font-semibold text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-red cursor-pointer"
        >
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div class="text-xs text-gray-400 font-medium">
        Total Orders: <span class="text-gray-800 font-bold">{{ ordersStore.orders.length }}</span>
      </div>
    </div>

    <!-- Spinner -->
    <LoadingSpinner v-if="ordersStore.loading" message="Loading orders..." />

    <!-- Orders Table -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-400 text-xxs uppercase tracking-wider font-bold border-b border-gray-100">
              <th class="px-6 py-4">Order ID</th>
              <th class="px-6 py-4">Customer Details</th>
              <th class="px-6 py-4">Items Ordered</th>
              <th class="px-6 py-4">Total</th>
              <th class="px-6 py-4">Notes</th>
              <th class="px-6 py-4">Status</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-if="ordersStore.orders.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-400 italic">No orders logged. Record one!</td>
            </tr>
            
            <tr v-for="order in ordersStore.orders" :key="order._id" class="hover:bg-gray-50/50 transition-colors">
              <!-- Order ID -->
              <td class="px-6 py-4 text-xs font-mono font-bold text-gray-400">
                #{{ order._id.slice(-6) }}
              </td>
              
              <!-- Customer -->
              <td class="px-6 py-4">
                <p class="font-bold text-gray-800">{{ order.customerName }}</p>
                <p class="text-xs text-gray-400">{{ order.phone }}</p>
                <p class="text-xxs text-gray-400 pt-0.5">{{ formatDate(order.createdAt) }}</p>
                <p class="text-[10px] text-gray-500 font-medium italic mt-1.5 bg-gray-50 p-1.5 rounded border border-gray-100 max-w-xs break-words leading-tight" :title="order.address">
                  📍 {{ order.address || 'No Address' }}
                </p>
              </td>
              
              <!-- Items -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <p v-for="item in order.items" :key="item._id" class="text-xs">
                    🍪 {{ item.name }} ({{ item.weight }}) 
                    <span class="text-gray-800 font-bold">x{{ item.quantity }}</span> 
                    <span class="text-gray-400 text-xxs">@ Rs. {{ item.price }}</span>
                  </p>
                </div>
              </td>
              
              <!-- Total -->
              <td class="px-6 py-4 font-bold text-gray-800">
                Rs. {{ order.total }}
              </td>
              
              <!-- Notes -->
              <td class="px-6 py-4 max-w-xs text-xs text-gray-400 truncate" :title="order.notes">
                {{ order.notes || '—' }}
              </td>
              
              <!-- Status Update Dropdown -->
              <td class="px-6 py-4">
                <select
                  v-model="order.status"
                  @change="updateStatus(order)"
                  class="bg-gray-100 text-gray-800 border-none font-bold text-xxs px-2.5 py-1 rounded-full cursor-pointer uppercase tracking-wider focus:outline-none"
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                    'bg-blue-100 text-blue-800': order.status === 'Confirmed',
                    'bg-green-100 text-green-800': order.status === 'Delivered',
                  }"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Order Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
      <div class="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        <!-- Title -->
        <header class="px-8 py-5 bg-bg-light border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 class="font-extrabold text-gray-800 text-lg">Record Manual Order</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 font-bold cursor-pointer text-xl">✕</button>
        </header>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex-grow p-8 overflow-y-auto space-y-5">
          <!-- Customer Name & Phone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Name</label>
              <input
                v-model="form.customerName"
                type="text"
                required
                placeholder="e.g. Zainab Ahmed"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50"
              />
            </div>
            
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
              <input
                v-model="form.phone"
                type="text"
                required
                placeholder="e.g. 03001234567"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <!-- Delivery Address -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Delivery Address *</label>
            <textarea
              v-model="form.address"
              rows="2"
              required
              placeholder="e.g. House 12-C, Block 3, Gulshan-e-Iqbal, Karachi"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50 resize-none"
            ></textarea>
          </div>

          <!-- Items Ordered Section -->
          <div class="space-y-3 p-4 bg-bg-light rounded-2xl border border-red-50/50">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Items Selection</label>
              <button
                type="button"
                @click="addItemRow"
                class="text-xxs font-bold text-primary-red hover:underline flex items-center gap-1 cursor-pointer"
              >
                ➕ Add Item Row
              </button>
            </div>
            
            <div v-if="form.items.length === 0" class="text-center py-4 text-xs text-gray-400 italic">
              No items selected. Add a product to configure this order.
            </div>

            <!-- Item Rows -->
            <div v-else class="space-y-3">
              <div 
                v-for="(item, idx) in form.items" 
                :key="idx"
                class="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-gray-50 shadow-xs relative"
              >
                <!-- Select Product -->
                <div class="flex-grow w-full">
                  <label class="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Select Product</label>
                  <select
                    v-model="item.productId"
                    @change="onProductChange(idx)"
                    required
                    class="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-primary-red cursor-pointer"
                  >
                    <option value="" disabled>-- Select Product --</option>
                    <option 
                      v-for="p in productsStore.products" 
                      :key="p._id" 
                      :value="p._id"
                      :disabled="p.stock <= 0"
                    >
                      {{ p.name }} (Stock: {{ p.stock }})
                    </option>
                  </select>
                </div>

                <!-- Weight Selection -->
                <div class="w-full sm:w-28">
                  <label class="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Weight</label>
                  <select
                    v-model="item.weight"
                    required
                    class="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-primary-red cursor-pointer"
                  >
                    <option 
                      v-for="w in getProductWeights(item.productId)" 
                      :key="w" 
                      :value="w"
                    >
                      {{ w }}
                    </option>
                  </select>
                </div>

                <!-- Quantity -->
                <div class="w-full sm:w-20">
                  <label class="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Qty</label>
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    required
                    min="1"
                    :max="getProductStock(item.productId)"
                    class="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-primary-red"
                  />
                </div>

                <!-- Live Subtotal -->
                <div class="text-right shrink-0 px-2">
                  <span class="block text-[9px] text-gray-400 font-bold uppercase">Subtotal</span>
                  <span class="text-xs font-bold text-gray-800">
                    Rs. {{ getItemSubtotal(item) }}
                  </span>
                </div>

                <!-- Remove Row -->
                <button
                  type="button"
                  @click="removeItemRow(idx)"
                  class="absolute top-1 right-2 sm:static text-red-500 hover:text-red-700 text-xs font-bold font-mono p-1 select-none cursor-pointer"
                  title="Remove Item"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Delivery / Special Notes</label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="e.g. Gift packing, deliver after 5pm..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50"
            ></textarea>
          </div>

          <!-- Summary footer -->
          <div class="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span class="text-sm text-gray-500">Recalculated Order Total:</span>
            <span class="text-xl font-black text-primary-red">Rs. {{ calculatedTotal }}</span>
          </div>

          <!-- Actions Footer -->
          <div class="pt-4 flex justify-end gap-3 border-t border-gray-100 shrink-0">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-primary-red hover:bg-primary-red-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition-colors cursor-pointer"
              :disabled="form.items.length === 0"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOrdersStore } from '../stores/orders';
import { useProductsStore } from '../stores/products';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const ordersStore = useOrdersStore();
const productsStore = useProductsStore();

const statusFilter = ref('');
const isModalOpen = ref(false);

const form = ref({
  customerName: '',
  phone: '',
  address: '',
  items: [],
  notes: ''
});

onMounted(() => {
  ordersStore.fetchOrders();
  productsStore.fetchProducts(true);
});

// Filtering orders
const filterOrders = () => {
  ordersStore.fetchOrders(statusFilter.value);
};

// Date Format
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Update order status
const updateStatus = async (order) => {
  try {
    await ordersStore.updateOrderStatus(order._id, order.status);
    if (window.showToast) {
      window.showToast(`Order status updated to "${order.status}"`, 'success');
    }
  } catch (err) {
    if (window.showToast) {
      window.showToast('Failed to update status', 'error');
    }
  }
};

// Create Order helper functions
const openAddOrderModal = () => {
  form.value = {
    customerName: '',
    phone: '',
    address: '',
    items: [],
    notes: ''
  };
  addItemRow(); // Start with 1 empty row
  isModalOpen.value = true;
};

const addItemRow = () => {
  form.value.items.push({
    productId: '',
    weight: '250g',
    quantity: 1
  });
};

const removeItemRow = (idx) => {
  form.value.items.splice(idx, 1);
};

const onProductChange = (idx) => {
  const item = form.value.items[idx];
  const prod = productsStore.products.find(p => p._id === item.productId);
  if (prod) {
    const weights = getProductWeights(prod._id);
    item.weight = weights[0] || '250g';
    item.quantity = 1;
  }
};

const getProductWeights = (productId) => {
  if (!productId) return ['250g'];
  const prod = productsStore.products.find(p => p._id === productId);
  if (!prod) return ['250g'];
  if (prod.weights && prod.weights.length > 0) return prod.weights;
  return Object.keys(prod.price || {});
};

const getProductStock = (productId) => {
  if (!productId) return 99;
  const prod = productsStore.products.find(p => p._id === productId);
  return prod ? prod.stock : 99;
};

const getItemSubtotal = (item) => {
  if (!item.productId) return 0;
  const prod = productsStore.products.find(p => p._id === item.productId);
  if (!prod) return 0;
  
  let price = 0;
  if (prod.price instanceof Map) {
    price = prod.price.get(item.weight) || 0;
  } else {
    price = prod.price[item.weight] || 0;
  }
  
  return price * item.quantity;
};

const calculatedTotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + getItemSubtotal(item), 0);
});

const handleSubmit = async () => {
  // Validate items
  if (form.value.items.length === 0) return;
  
  const hasEmptyItem = form.value.items.some(item => !item.productId);
  if (hasEmptyItem) {
    if (window.showToast) {
      window.showToast('Please select products for all items', 'error');
    }
    return;
  }

  // Check stock before submitting
  for (const item of form.value.items) {
    const stock = getProductStock(item.productId);
    if (item.quantity > stock) {
      const prod = productsStore.products.find(p => p._id === item.productId);
      if (window.showToast) {
        window.showToast(`Insufficient stock for ${prod.name}. Available: ${stock}`, 'error');
      }
      return;
    }
  }

  try {
    await ordersStore.createOrder(form.value);
    if (window.showToast) {
      window.showToast('Order logged successfully! Inventory stock updated.', 'success');
    }
    isModalOpen.value = false;
    
    // Refresh products list to reflect updated stock levels
    productsStore.fetchProducts(true);
  } catch (err) {
    if (window.showToast) {
      window.showToast(err.response?.data?.message || 'Failed to log manual order', 'error');
    }
  }
};
</script>
