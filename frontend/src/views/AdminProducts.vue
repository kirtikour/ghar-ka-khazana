<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-800">Product Manager</h1>
        <p class="text-sm text-gray-500">Add, edit, delete, or toggle visibility of store products.</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-primary-red hover:bg-primary-red-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow flex items-center gap-2 cursor-pointer"
      >
        ➕ Add New Product
      </button>
    </div>

    <!-- Spinner -->
    <LoadingSpinner v-if="productsStore.loading" message="Loading products list..." />

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-400 text-xxs uppercase tracking-wider font-bold border-b border-gray-100">
              <th class="px-6 py-4">Image</th>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Price (variants)</th>
              <th class="px-6 py-4">Stock</th>
              <th class="px-6 py-4">Visible</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-if="productsStore.products.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-400 italic">No products available. Add one!</td>
            </tr>
            
            <tr v-for="product in productsStore.products" :key="product._id" class="hover:bg-gray-50/50 transition-colors">
              <!-- Thumbnail -->
              <td class="px-6 py-4 shrink-0">
                <img
                  :src="getImageUrl(product.image)"
                  :alt="product.name"
                  class="w-12 h-12 object-cover rounded-lg border border-gray-100"
                />
              </td>
              
              <!-- Name & Description -->
              <td class="px-6 py-4">
                <p class="font-bold text-gray-800 leading-tight">{{ product.name }}</p>
                <p class="text-xxs text-gray-400 max-w-xs truncate">{{ product.description }}</p>
              </td>
              
              <!-- Category -->
              <td class="px-6 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-xxs font-bold bg-bg-light text-primary-red uppercase tracking-wider">
                  {{ product.category }}
                </span>
              </td>
              
              <!-- Price variants -->
              <td class="px-6 py-4 text-xs font-semibold">
                <div class="space-y-0.5">
                  <p v-for="w in getWeights(product)" :key="w">
                    <span class="text-gray-400 font-medium">{{ w }}:</span> Rs. {{ getPriceForWeight(product, w) }}
                  </p>
                </div>
              </td>
              
              <!-- Stock -->
              <td class="px-6 py-4">
                <span 
                  class="font-semibold text-xs px-2 py-0.5 rounded-lg"
                  :class="product.stock < 5 ? 'bg-red-50 text-primary-red font-extrabold animate-pulse' : 'bg-gray-100 text-gray-600'"
                >
                  {{ product.stock }} units
                </span>
              </td>
              
              <!-- Visibility Toggle -->
              <td class="px-6 py-4">
                <button
                  @click="toggleVisibility(product)"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="product.visible ? 'bg-green-500' : 'bg-gray-200'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="product.visible ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4 space-x-2">
                <button
                  @click="openEditModal(product)"
                  class="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(product)"
                  class="text-primary-red hover:text-red-800 font-bold hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal (Add / Edit) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
      <div class="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        <!-- Title -->
        <header class="px-8 py-5 bg-bg-light border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 class="font-extrabold text-gray-800 text-lg">
            {{ editMode ? 'Edit Product' : 'Add New Product' }}
          </h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 font-bold cursor-pointer text-xl">✕</button>
        </header>

        <!-- Form Scroll Area -->
        <form @submit.prevent="handleSubmit" class="flex-grow p-8 overflow-y-auto space-y-5">
          <!-- Name -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Garlic Chatni"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50"
            />
          </div>

          <!-- Category & Stock -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50 cursor-pointer"
              >
                <option>Achaar</option>
                <option>Papad</option>
                <option>Chutney</option>
                <option>Seasonal</option>
              </select>
            </div>
            
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Quantity</label>
              <input
                v-model="form.stock"
                type="number"
                required
                min="0"
                placeholder="e.g. 15"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              placeholder="Enter product flavor notes, curation style, spices..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent text-sm bg-gray-50/50"
            ></textarea>
          </div>

          <!-- Weight Toggle & Price configuration -->
          <div class="space-y-3 p-4 bg-bg-light rounded-2xl border border-red-50/50">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Weight & Pricing Options</label>
            <p class="text-xxs text-gray-400">Toggle weights to activate them, and enter the price for each.</p>
            
            <div class="space-y-3 pt-2">
              <div 
                v-for="w in allWeightOptions" 
                :key="w"
                class="flex items-center justify-between gap-4 p-2 rounded-xl bg-white border border-gray-50"
              >
                <label class="flex items-center gap-2 font-semibold text-sm cursor-pointer select-none text-gray-700">
                  <input
                    type="checkbox"
                    :value="w"
                    v-model="form.weights"
                    class="rounded text-primary-red focus:ring-primary-red cursor-pointer"
                  />
                  {{ w }} Variant
                </label>
                
                <div v-if="form.weights.includes(w)" class="flex items-center gap-2">
                  <span class="text-xs text-gray-400 font-bold">Rs.</span>
                  <input
                    v-model.number="form.price[w]"
                    type="number"
                    required
                    min="1"
                    placeholder="Price"
                    class="w-28 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-red"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Product Image</label>
            <div class="flex items-center gap-4">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*"
                class="hidden"
                id="file-upload"
              />
              <label 
                for="file-upload"
                class="px-4 py-2 border-2 border-dashed border-gray-300 hover:border-primary-red hover:bg-red-50/10 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer select-none transition-colors"
              >
                {{ editMode ? 'Change Image File' : 'Choose Image File' }}
              </label>
              
              <span class="text-xs text-gray-400 font-medium truncate max-w-xs">
                {{ selectedFileName || 'No file selected (JPG, PNG, WebP)' }}
              </span>
            </div>
          </div>

          <!-- Visible Toggle -->
          <div class="flex items-center justify-between p-2">
            <div>
              <label class="block font-bold text-sm text-gray-700 select-none">Visible on Storefront</label>
              <p class="text-xxs text-gray-400">If unchecked, customers cannot browse or order this item.</p>
            </div>
            <button
              type="button"
              @click="form.visible = !form.visible"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="form.visible ? 'bg-green-500' : 'bg-gray-200'"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="form.visible ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>

          <!-- Actions Footer -->
          <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
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
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductsStore } from '../stores/products';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const productsStore = useProductsStore();

const isModalOpen = ref(false);
const editMode = ref(false);
const activeProductId = ref(null);

const allWeightOptions = ['250g', '500g', '1kg'];

const form = ref({
  name: '',
  category: 'Achaar',
  description: '',
  price: {},
  weights: ['250g', '500g', '1kg'],
  stock: 10,
  visible: true
});

const imageFile = ref(null);
const selectedFileName = ref('');
const fileInput = ref(null);

onMounted(() => {
  productsStore.fetchProducts(true);
});

const getImageUrl = (imageName) => {
  return `/api/uploads/${imageName}`;
};

const getWeights = (product) => {
  if (product.weights && product.weights.length > 0) return product.weights;
  return Object.keys(product.price || {});
};

const getPriceForWeight = (product, weight) => {
  if (!product.price) return 0;
  if (product.price instanceof Map) {
    return product.price.get(weight) || 0;
  }
  return product.price[weight] || 0;
};

// Toggle Visibility
const toggleVisibility = async (product) => {
  try {
    const fd = new FormData();
    fd.append('visible', !product.visible);
    await productsStore.updateProduct(product._id, fd);
    if (window.showToast) {
      window.showToast(`Product visibility set to ${!product.visible ? 'Visible' : 'Hidden'}`, 'success');
    }
  } catch (err) {
    if (window.showToast) {
      window.showToast('Failed to toggle visibility', 'error');
    }
  }
};

// Open Modals
const openAddModal = () => {
  editMode.value = false;
  activeProductId.value = null;
  selectedFileName.value = '';
  imageFile.value = null;
  
  form.value = {
    name: '',
    category: 'Achaar',
    description: '',
    price: { '250g': 200, '500g': 380, '1kg': 700 },
    weights: ['250g', '500g', '1kg'],
    stock: 15,
    visible: true
  };
  
  isModalOpen.value = true;
};

const openEditModal = (product) => {
  editMode.value = true;
  activeProductId.value = product._id;
  selectedFileName.value = product.image; // current image
  imageFile.value = null;

  // Convert map to plain object
  const priceObj = {};
  const weightsArr = getWeights(product);
  weightsArr.forEach(w => {
    priceObj[w] = getPriceForWeight(product, w);
  });

  form.value = {
    name: product.name,
    category: product.category,
    description: product.description,
    price: priceObj,
    weights: [...weightsArr],
    stock: product.stock,
    visible: product.visible
  };

  isModalOpen.value = true;
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    selectedFileName.value = file.name;
  }
};

const handleSubmit = async () => {
  // Validate weight price selection
  if (form.value.weights.length === 0) {
    if (window.showToast) {
      window.showToast('Select at least one weight variant', 'error');
    }
    return;
  }

  for (const w of form.value.weights) {
    if (!form.value.price[w] || form.value.price[w] <= 0) {
      if (window.showToast) {
        window.showToast(`Please enter a valid price for the ${w} variant`, 'error');
      }
      return;
    }
  }

  // Build FormData
  const fd = new FormData();
  fd.append('name', form.value.name);
  fd.append('category', form.value.category);
  fd.append('description', form.value.description);
  fd.append('stock', form.value.stock);
  fd.append('visible', form.value.visible);

  // Clean prices (only submit toggled weights)
  const finalPriceMap = {};
  form.value.weights.forEach(w => {
    finalPriceMap[w] = form.value.price[w];
  });

  fd.append('price', JSON.stringify(finalPriceMap));
  fd.append('weights', JSON.stringify(form.value.weights));

  if (imageFile.value) {
    fd.append('image', imageFile.value);
  }

  try {
    if (editMode.value) {
      await productsStore.updateProduct(activeProductId.value, fd);
      if (window.showToast) {
        window.showToast('Product updated successfully!', 'success');
      }
    } else {
      if (!imageFile.value) {
        if (window.showToast) {
          window.showToast('Image file upload is required for new products!', 'error');
        }
        return;
      }
      await productsStore.createProduct(fd);
      if (window.showToast) {
        window.showToast('New product created successfully!', 'success');
      }
    }
    isModalOpen.value = false;
  } catch (err) {
    if (window.showToast) {
      window.showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  }
};

// Confirm Delete
const confirmDelete = async (product) => {
  const confirmed = confirm(`Are you sure you want to permanently delete "${product.name}"?`);
  if (confirmed) {
    try {
      await productsStore.deleteProduct(product._id);
      if (window.showToast) {
        window.showToast('Product deleted successfully', 'success');
      }
    } catch (err) {
      if (window.showToast) {
        window.showToast('Failed to delete product', 'error');
      }
    }
  }
};
</script>
