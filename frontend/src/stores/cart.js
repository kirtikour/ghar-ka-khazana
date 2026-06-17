import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items')) || [],
    isOpen: false,
    isCheckoutOpen: false
  }),
  
  getters: {
    cartCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  
  actions: {
    addToCart(product, weight, quantity = 1) {
      // Find price for this weight
      let price = 0;
      if (product.price) {
        price = product.price[weight] || 0;
      }
      
      const existingItemIndex = this.items.findIndex(
        (item) => item.productId === product._id && item.weight === weight
      );
      
      if (existingItemIndex !== -1) {
        const newQty = this.items[existingItemIndex].quantity + quantity;
        if (newQty <= product.stock) {
          this.items[existingItemIndex].quantity = newQty;
        } else {
          this.items[existingItemIndex].quantity = product.stock;
        }
      } else {
        const initialQty = Math.min(quantity, product.stock);
        if (initialQty > 0) {
          this.items.push({
            productId: product._id,
            name: product.name,
            weight,
            price,
            quantity: initialQty,
            image: product.image,
            stock: product.stock
          });
        }
      }
      this.saveToLocalStorage();
    },
    
    removeFromCart(productId, weight) {
      this.items = this.items.filter(
        (item) => !(item.productId === productId && item.weight === weight)
      );
      this.saveToLocalStorage();
    },
    
    updateQuantity(productId, weight, quantity) {
      const item = this.items.find(
        (i) => i.productId === productId && i.weight === weight
      );
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId, weight);
        } else {
          item.quantity = Math.min(quantity, item.stock);
        }
      }
      this.saveToLocalStorage();
    },
    
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },

    validateCartItems(availableProducts) {
      if (!availableProducts || availableProducts.length === 0) return;
      this.items = this.items.filter(item => {
        const prod = availableProducts.find(p => p._id === item.productId);
        if (!prod) return false;
        
        item.stock = prod.stock;
        if (prod.price) {
          const price = (prod.price instanceof Map) ? prod.price.get(item.weight) : prod.price[item.weight];
          if (price !== undefined) {
            item.price = price;
          }
        }
        return true;
      });
      this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    }
  }
});
