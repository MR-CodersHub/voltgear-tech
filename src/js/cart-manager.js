/**
 * cart-manager.js
 * Global cart state management system using localStorage
 * Single source of truth: voltgear_cart per user
 */

class CartManager {
  constructor() {
    this.CART_KEY = 'voltgear_cart';
    this.ORDERS_KEY = 'voltgear_orders';
    this.cart = this.loadCart();
    this.initializeEventSystem();
    
    // Listen for logout to clear cart
    window.addEventListener('logout', () => this.clearCart());
  }

  // Get user-specific cart key
  getUserCartKey() {
    try {
      const user = JSON.parse(localStorage.getItem('techgear_current_user') || 'null');
      return user && user.id ? `${this.CART_KEY}_${user.id}` : this.CART_KEY;
    } catch (e) {
      return this.CART_KEY;
    }
  }

  // ===== CART STORAGE =====
  loadCart() {
    try {
      const key = this.getUserCartKey();
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load cart:', e);
      return [];
    }
  }

  saveCart() {
    try {
      const key = this.getUserCartKey();
      localStorage.setItem(key, JSON.stringify(this.cart));
      this.dispatchCartUpdate();
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }

  // ===== ADD TO CART =====
  addToCart(product) {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return false;
    }

    const existingItem = this.cart.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        productId: product.id,
        title: product.title,
        categoryId: product.id,
        image: product.image,
        price: product.price || 0,
        quantity: 1
      });
    }

    this.saveCart();
    return true;
  }

  // ===== QUANTITY MANAGEMENT =====
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.productId === productId);
    if (!item) return false;

    const newQuantity = Math.max(0, quantity);

    if (newQuantity === 0) {
      this.removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      this.saveCart();
    }

    return true;
  }

  increaseQuantity(productId) {
    const item = this.cart.find(item => item.productId === productId);
    if (item) {
      item.quantity += 1;
      this.saveCart();
      return true;
    }
    return false;
  }

  decreaseQuantity(productId) {
    const item = this.cart.find(item => item.productId === productId);
    if (!item) return false;

    if (item.quantity > 1) {
      item.quantity -= 1;
      this.saveCart();
      return true;
    } else {
      return this.removeFromCart(productId);
    }
  }

  // ===== CART OPERATIONS =====
  removeFromCart(productId) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => item.productId !== productId);

    if (this.cart.length < initialLength) {
      this.saveCart();
      return true;
    }
    return false;
  }

  getCart() {
    return [...this.cart];
  }

  // Clear cart (used on logout)
  clearCart() {
    const key = this.getUserCartKey();
    this.cart = [];
    localStorage.removeItem(key);
    this.dispatchCartUpdate();
  }

  getCartItem(productId) {
    return this.cart.find(item => item.productId === productId);
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotalItems() {
    return this.cart.length;
  }

  isEmpty() {
    return this.cart.length === 0;
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // ===== ORDER MANAGEMENT =====
  createOrder(orderData) {
    const orders = this.getOrders();

    const order = {
      id: 'ORD-' + Date.now(),
      userId: orderData.userId || null,
      userEmail: orderData.email || '',
      items: [...this.cart],
      subtotal: this.getCartTotal(),
      tax: this.calculateTax(this.getCartTotal()),
      total: this.getOrderTotal(),
      shippingAddress: {
        fullName: orderData.fullName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city
      },
      paymentMethod: orderData.paymentMethod,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    orders.push(order);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));

    // Log activity
    if (window.ActivityLogger) {
      ActivityLogger.log('Place Order', {
        orderId: order.id,
        total: order.total,
        itemCount: this.cart.length
      });
    }

    this.clearCart();
    return order;
  }

  getOrders() {
    try {
      const stored = localStorage.getItem(this.ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load orders:', e);
      return [];
    }
  }

  getUserOrders(userEmail) {
    const orders = this.getOrders();
    return orders.filter(order => order.userEmail === userEmail);
  }

  // ===== CALCULATIONS =====
  calculateTax(subtotal, taxRate = 0.1) {
    return parseFloat((subtotal * taxRate).toFixed(2));
  }

  getOrderTotal() {
    const subtotal = this.getCartTotal();
    const tax = this.calculateTax(subtotal);
    return parseFloat((subtotal + tax).toFixed(2));
  }

  // ===== EVENT SYSTEM =====
  initializeEventSystem() {
    if (!window.cartEvents) {
      window.cartEvents = new EventTarget();
    }
  }

  dispatchCartUpdate() {
    const event = new CustomEvent('cartUpdated', {
      detail: {
        cart: this.getCart(),
        count: this.getCartCount(),
        total: this.getCartTotal()
      }
    });
    window.cartEvents.dispatchEvent(event);
  }

  onCartUpdate(callback) {
    window.cartEvents.addEventListener('cartUpdated', callback);
  }

  offCartUpdate(callback) {
    window.cartEvents.removeEventListener('cartUpdated', callback);
  }
}

// Initialize global cart manager
window.Cart = new CartManager();
