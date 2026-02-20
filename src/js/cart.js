/**
 * cart.js
 * Shopping cart page rendering and management
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  setupCartEventListeners();
  setupProceedButton();

  // Listen for cart updates
  if (window.Cart) {
    window.Cart.onCartUpdate(() => {
      renderCart();
    });
  }
});

// ===== RENDER CART =====
function renderCart() {
  const cart = window.Cart ? window.Cart.getCart() : [];
  const container = document.getElementById('cart-items-container');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="glass-panel p-20 text-center">
        <svg class="w-16 h-16 text-white/20 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <p class="text-secondary text-xl font-medium mb-6">Your cart is currently empty.</p>
        <a href="services.html" class="btn-primary inline-block">Explore Products</a>
      </div>
    `;
    updateCartSummary();
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="glass-panel p-6 flex gap-6 group border-white/5 hover:border-accent/20 transition-all glow-hover">
      <!-- Product Image -->
      <div class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
        <img src="../../${item.image}" alt="${item.title}" class="w-full h-full object-contain p-2">
      </div>

      <!-- Product Details -->
      <div class="flex-grow min-w-0">
        <h3 class="text-lg md:text-xl font-black mb-2 group-hover:text-accent transition-colors truncate">
          ${item.title}
        </h3>
        <p class="text-secondary/70 text-sm mb-4">Product ID: ${item.productId}</p>

        <!-- Quantity Controls -->
        <div class="flex items-center gap-3 mb-4">
          <button class="decrease-qty w-8 h-8 rounded-lg bg-white/5 hover:bg-accent/20 flex items-center justify-center text-accent font-bold transition-all" 
                  data-product-id="${item.productId}" title="Decrease quantity">
            −
          </button>
          <input type="number" class="qty-input w-12 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white font-bold" 
                 value="${item.quantity}" readonly min="1">
          <button class="increase-qty w-8 h-8 rounded-lg bg-white/5 hover:bg-accent/20 flex items-center justify-center text-accent font-bold transition-all" 
                  data-product-id="${item.productId}" title="Increase quantity">
            +
          </button>
        </div>

        <!-- Price & Remove -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-secondary/70">Unit Price: <span class="text-white font-bold">$${item.price.toFixed(2)}</span></p>
            <p class="text-lg font-black text-accent">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button class="remove-item px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm transition-all" 
                  data-product-id="${item.productId}">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');

  setupCartEventListeners();
  updateCartSummary();
}

// ===== CART EVENT LISTENERS =====
function setupCartEventListeners() {
  // Increase quantity buttons
  document.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = btn.dataset.productId;
      if (window.Cart) {
        window.Cart.increaseQuantity(productId);
      }
    });
  });

  // Decrease quantity buttons
  document.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = btn.dataset.productId;
      if (window.Cart) {
        window.Cart.decreaseQuantity(productId);
      }
    });
  });

  // Remove item buttons
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = btn.dataset.productId;
      if (window.Cart) {
        window.Cart.removeFromCart(productId);
      }
    });
  });
}

// ===== UPDATE SUMMARY =====
function updateCartSummary() {
  const cart = window.Cart ? window.Cart.getCart() : [];
  const subtotal = window.Cart ? window.Cart.getCartTotal() : 0;

  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl) {
    subtotalEl.textContent = '$' + subtotal.toFixed(2);
  }

  if (totalEl) {
    totalEl.textContent = '$' + subtotal.toFixed(2);
  }
}

// ===== PROCEED TO CHECKOUT =====
function setupProceedButton() {
  // Find the button more reliably
  const buttons = document.querySelectorAll('button');
  let checkoutBtn = null;

  for (let btn of buttons) {
    if (btn.textContent.includes('PROCEED TO CHECKOUT')) {
      checkoutBtn = btn;
      break;
    }
  }

  if (!checkoutBtn) {
    // Fallback: find the button in the order summary panel
    const summaryPanel = document.querySelector('.sticky');
    if (summaryPanel) {
      checkoutBtn = summaryPanel.querySelector('button');
    }
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const cart = window.Cart ? window.Cart.getCart() : [];

      if (cart.length === 0) {
        alert('Your cart is empty. Add items before proceeding to checkout.');
        return;
      }

      // Redirect to checkout
      window.location.href = 'checkout.html';
    });
  }
}
