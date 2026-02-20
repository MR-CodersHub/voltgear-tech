/**
 * checkout.js
 * Checkout page logic with form validation and order processing
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check login status first
  checkLoginStatus();
  renderOrderSummary();
  setupFormValidation();
  setupFormSubmission();
});

// ===== LOGIN PROTECTION =====
function checkLoginStatus() {
  const currentUser = JSON.parse(localStorage.getItem('techgear_current_user') || 'null');

  if (!currentUser) {
    // Redirect to login
    Toast.warning('Please log in to proceed with checkout');
    setTimeout(() => {
      window.location.href = '../../auth/login.html?redirect=checkout';
    }, 1000);
    return false;
  }

  return true;
}

// ===== RENDER ORDER SUMMARY =====
function renderOrderSummary() {
  const cart = window.Cart.getCart();
  const container = document.getElementById('checkout-items');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-secondary/70 text-sm">Your cart is empty</p>
        <a href="cart.html" class="text-accent text-xs font-bold mt-4 inline-block hover:text-accent/80">← Back to Cart</a>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="flex justify-between items-center pb-4 border-b border-white/5 last:border-b-0">
      <div class="flex-grow">
        <p class="font-semibold text-sm text-white">${item.title}</p>
        <p class="text-xs text-secondary/70">${item.quantity}x @ $${item.price.toFixed(2)}</p>
      </div>
      <p class="font-bold text-accent text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
    </div>
  `).join('');

  updateOrderTotals();
}

// ===== UPDATE TOTALS =====
function updateOrderTotals() {
  const subtotal = window.Cart.getCartTotal();
  const tax = window.Cart.calculateTax(subtotal);
  const total = window.Cart.getOrderTotal();

  const subtotalEl = document.getElementById('checkout-subtotal');
  const taxEl = document.getElementById('checkout-tax');
  const totalEl = document.getElementById('checkout-total');

  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');

  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('focus', () => {
      clearFieldError(input);
    });
  });
}

function validateField(input) {
  const name = input.name;
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';

  if (!value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else {
    switch (name) {
      case 'fullName':
        if (value.length < 3) {
          isValid = false;
          errorMessage = 'Name must be at least 3 characters';
        }
        break;
      case 'email':
        if (!isValidEmail(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!isValidPhone(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
        break;
      case 'address':
        if (value.length < 5) {
          isValid = false;
          errorMessage = 'Please enter a valid address';
        }
        break;
      case 'city':
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'Please enter a valid city name';
        }
        break;
    }
  }

  if (!isValid) {
    showFieldError(input, errorMessage);
  } else {
    clearFieldError(input);
  }

  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
}

function showFieldError(input, message) {
  input.classList.add('border-red-500', 'focus:border-red-500');
  const errorEl = input.parentElement.querySelector('.error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
}

function clearFieldError(input) {
  input.classList.remove('border-red-500', 'focus:border-red-500');
  const errorEl = input.parentElement.querySelector('.error-message');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }
}

// ===== FORM SUBMISSION =====
function setupFormSubmission() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    let allValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        allValid = false;
      }
    });

    if (!allValid) {
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    const orderData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      paymentMethod: formData.get('paymentMethod')
    };

    // Add user ID if logged in
    const currentUser = JSON.parse(localStorage.getItem('techgear_current_user') || 'null');
    if (currentUser) {
      orderData.userId = currentUser.id;
    }

    // Create order
    processOrder(orderData);
  });
}

function processOrder(orderData) {
  try {
    // Create order using cart manager
    const order = window.Cart.createOrder(orderData);

    // Show success message
    showOrderSuccess(order);

    // Redirect to dashboard after delay
    setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser && currentUser.role === 'admin') {
        window.location.href = '../../auth/admin/admin-dashboard.html';
      } else if (currentUser) {
        window.location.href = '../../auth/user/user-dashboard.html';
      } else {
        window.location.href = '../../index.html';
      }
    }, 2000);
  } catch (error) {
    console.error('Order processing failed:', error);
    alert('There was an error processing your order. Please try again.');
  }
}

function showOrderSuccess(order) {
  // Create success modal
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="glass-panel max-w-md w-full p-12 text-center border-white/10 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none"></div>
      
      <div class="relative z-10">
        <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 class="text-3xl font-black mb-3 tracking-tighter">ORDER CONFIRMED</h2>
        <p class="text-secondary/80 mb-2">Order ID: <span class="text-accent font-bold">${order.id}</span></p>
        <p class="text-secondary/80 mb-6">Total: <span class="text-2xl font-black text-accent">$${order.total.toFixed(2)}</span></p>
        
        <p class="text-sm text-secondary/70">
          A confirmation email has been sent to <strong>${order.shippingAddress.email}</strong>
        </p>
        
        <p class="text-xs text-secondary/50 mt-6">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}
