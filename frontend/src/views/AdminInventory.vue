<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-gray-800">Inventory Stock Manager</h1>
      <p class="text-sm text-gray-500">
        Monitor raw inventory. Click directly on any stock quantity to edit inline and press Enter to save.
      </p>
    </div>

    <!-- Spinner -->
    <LoadingSpinner v-if="ordersStore.loading" message="Fetching inventory levels..." />

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-400 text-xxs uppercase tracking-wider font-bold border-b border-gray-100">
              <th class="px-6 py-4">Product Name</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Current Stock</th>
              <th class="px-6 py-4">Last Updated</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-if="ordersStore.inventory.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400 italic">No products available in inventory.</td>
            </tr>
            
            <tr 
              v-for="item in ordersStore.inventory" 
              :key="item._id" 
              class="hover:bg-gray-50/50 transition-colors"
              :class="item.stock < 5 ? 'bg-red-50/10' : ''"
            >
              <!-- Name -->
              <td class="px-6 py-4 font-bold text-gray-800">
                {{ item.name }}
                <span v-if="item.stock < 5" class="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-primary-red animate-pulse">
                  ⚠️ Low Stock
                </span>
              </td>
              
              <!-- Category -->
              <td class="px-6 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-xxs font-bold bg-bg-light text-primary-red uppercase tracking-wider">
                  {{ item.category }}
                </span>
              </td>
              
              <!-- Stock (Inline Edit) -->
              <td class="px-6 py-4 font-semibold">
                <div v-if="editingId === item._id" class="flex items-center gap-2">
                  <input
                    v-model.number="editStockVal"
                    type="number"
                    min="0"
                    class="w-20 px-2 py-1 text-sm border border-primary-red rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-red bg-white"
                    @keyup.enter="saveStock(item._id)"
                    @keyup.esc="cancelEdit"
                    @blur="saveStock(item._id)"
                    ref="stockInput"
                  />
                  <span class="text-xxs text-gray-400">(Enter to save)</span>
                </div>
                
                <div 
                  v-else 
                  @click="startEdit(item)"
                  class="inline-block px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-accent-mustard hover:bg-yellow-50/30 cursor-pointer select-none transition-all"
                  :class="item.stock < 5 ? 'text-primary-red font-black underline decoration-2 decoration-red-400' : 'text-gray-700'"
                  title="Click to edit quantity inline"
                >
                  {{ item.stock }} units
                </div>
              </td>
              
              <!-- Last Updated -->
              <td class="px-6 py-4 text-xs text-gray-400">
                {{ formatDate(item.updatedAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useOrdersStore } from '../stores/orders';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const ordersStore = useOrdersStore();

const editingId = ref(null);
const editStockVal = ref(0);
const stockInput = ref(null);

onMounted(() => {
  ordersStore.fetchInventory();
});

const startEdit = (item) => {
  editingId.value = item._id;
  editStockVal.value = item.stock;
  
  // Focus the input field on the next tick
  nextTick(() => {
    if (stockInput.value && stockInput.value[0]) {
      stockInput.value[0].focus();
      stockInput.value[0].select();
    }
  });
};

const saveStock = async (id) => {
  // Prevent double trigger (enter key and blur event at the same time)
  if (editingId.value !== id) return;

  if (editStockVal.value === undefined || editStockVal.value === '' || editStockVal.value < 0) {
    if (window.showToast) {
      window.showToast('Please enter a valid non-negative number', 'error');
    }
    editingId.value = null;
    return;
  }

  try {
    await ordersStore.updateInventoryStock(id, editStockVal.value);
    if (window.showToast) {
      window.showToast('Stock Updated successfully!', 'success');
    }
  } catch (err) {
    if (window.showToast) {
      window.showToast('Failed to update inventory', 'error');
    }
  } finally {
    editingId.value = null;
  }
};

const cancelEdit = () => {
  editingId.value = null;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
