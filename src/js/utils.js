// ========================================
// TechGear Utility Functions
// Form validation, toast notifications, etc.
// ========================================

// Form Validation
class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePassword(password, minLength = 6) {
        return password.length >= minLength;
    }

    static validateRequired(value) {
        return value.trim().length > 0;
    }

    static validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    static showError(inputElement, message) {
        const errorDiv = inputElement.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        } else {
            const error = document.createElement('div');
            error.className = 'error-message text-red-500 text-sm mt-1';
            error.textContent = message;
            inputElement.parentElement.appendChild(error);
        }
        inputElement.classList.add('border-red-500');
    }

    static clearError(inputElement) {
        const errorDiv = inputElement.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
        inputElement.classList.remove('border-red-500');
    }

    static clearAllErrors(formElement) {
        const errors = formElement.querySelectorAll('.error-message');
        errors.forEach(error => error.classList.add('hidden'));

        const inputs = formElement.querySelectorAll('input, textarea');
        inputs.forEach(input => input.classList.remove('border-red-500'));
    }
}

// URL Parameter Helper
class URLHelper {
    static getParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    static getAllParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }
}

// Toast Notifications
class Toast {
    static show(message, type = 'info', duration = 3000) {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-fade-in-up';

        // Set color based on type
        const colors = {
            success: 'bg-green-600 text-white',
            error: 'bg-red-600 text-white',
            warning: 'bg-yellow-600 text-white',
            info: 'bg-blue-600 text-white'
        };

        toast.className += ' ' + (colors[type] || colors.info);

        toast.innerHTML = `
      <div class="flex items-center space-x-3">
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    static error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }

    static warning(message, duration = 3000) {
        this.show(message, 'warning', duration);
    }

    static info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Route Protection
function protectRoute(requiredRole = null) {
    if (!auth.isAuthenticated()) {
        window.location.href = '/auth/login.html';
        return false;
    }

    if (requiredRole) {
        const user = auth.getCurrentUser();
        if (user.role !== requiredRole) {
            Toast.error('Access denied');
            window.location.href = '/';
            return false;
        }
    }

    return true;
}

// Local Storage Helpers
class StorageHelper {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}

// Date Formatting
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }

    return 'just now';
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll to Top
function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// Copy to Clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        Toast.success('Copied to clipboard');
        return true;
    } catch (error) {
        Toast.error('Failed to copy');
        return false;
    }
}

// Generate Random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Truncate Text
function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + suffix;
}

// Activity Logger
class ActivityLogger {
    static log(action, details = {}) {
        const user = auth.getCurrentUser();
        const activityLog = StorageHelper.get('techgear_activity_log', []);

        const event = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            userId: user ? user.id : 'guest',
            userName: user ? user.name : 'Guest',
            action: action, // e.g., 'View Product', 'Signup', 'Login'
            details: details // e.g., { productId: 'gaming-gear' }
        };

        activityLog.unshift(event); // Add to beginning
        StorageHelper.set('techgear_activity_log', activityLog.slice(0, 100)); // Keep last 100

        // Also update user's own interactions if logged in
        if (user) {
            const users = auth.getAllUsers();
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                if (!users[userIndex].interactions) users[userIndex].interactions = [];
                users[userIndex].interactions.unshift({
                    type: action,
                    description: details.description || action,
                    timestamp: event.timestamp
                });
                StorageHelper.set('techgear_users', users);
            }
        }
    }

    static getLog() {
        return StorageHelper.get('techgear_activity_log', []);
    }
}

// Sidebar Manager - Handles sidebar open/close behavior
class SidebarManager {
    static closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (sidebar) {
            sidebar.classList.remove('open');
        }
        if (overlay) {
            overlay.classList.remove('open');
        }
    }

    static openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (sidebar) {
            sidebar.classList.add('open');
        }
        if (overlay) {
            overlay.classList.add('open');
        }
    }

    static toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (sidebar && sidebar.classList.contains('open')) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    static setupSidebarCloseHandlers() {
        // Handle all sidebar links (including logout) - close on click at mobile sizes
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close sidebar on screens <= 1024px
                if (window.innerWidth <= 1024) {
                    this.closeSidebar();
                }
            });
        });

        // Handle overlay click to close sidebar
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Handle hamburger toggle
        const toggle = document.getElementById('sidebar-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
    }
}

// Buy Now Functionality
class PurchaseManager {
    static buyNow(productData, quantity = 1) {
        if (!window.Cart) {
            console.error('Cart manager not loaded');
            return;
        }

        // Add to cart first with specified quantity
        window.Cart.addToCart(productData, quantity);

        // Determine paths based on current location
        const path = window.location.pathname;
        const isDeep = path.includes('/public/pages/') || path.includes('/auth/');

        let checkoutPage = 'public/pages/checkout.html';
        let loginPage = 'auth/login.html';

        // If we are in public/pages, paths are different
        if (path.includes('/public/pages/')) {
            checkoutPage = 'checkout.html';
            loginPage = '../../auth/login.html';
        } else if (path.includes('/auth/')) {
            checkoutPage = '../public/pages/checkout.html';
            loginPage = 'login.html';
        }

        const checkoutUrl = `${checkoutPage}?productId=${productData.id}`;

        if (!auth.isAuthenticated()) {
            Toast.info('Please login to continue your purchase');

            // The redirect URL must be relative to the login page
            // From auth/login.html, checkout is at ../public/pages/checkout.html
            const relativeRedirect = `../public/pages/checkout.html?productId=${productData.id}`;

            setTimeout(() => {
                window.location.href = `${loginPage}?redirect=${encodeURIComponent(relativeRedirect)}`;
            }, 1000);
            return;
        }

        // Redirect to checkout
        Toast.success('Redirecting to checkout...');
        setTimeout(() => {
            window.location.href = checkoutUrl;
        }, 800);
    }

    static setupListeners() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.buy-now-btn');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                try {
                    const data = JSON.parse(btn.getAttribute('data-product-data'));
                    this.buyNow(data);
                } catch (err) {
                    console.error('Error processing Buy Now:', err);
                }
            }
        });
    }
}

// Initialize listeners
document.addEventListener('DOMContentLoaded', () => {
    PurchaseManager.setupListeners();
});

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FormValidator,
        Toast,
        StorageHelper,
        protectRoute,
        ActivityLogger,
        SidebarManager,
        URLHelper,
        PurchaseManager,
        formatDate,
        formatDateTime,
        timeAgo,
        debounce,
        scrollToTop,
        copyToClipboard,
        generateId,
        truncateText
    };
} else {
    // For browser global scope
    window.FormValidator = FormValidator;
    window.Toast = Toast;
    window.StorageHelper = StorageHelper;
    window.protectRoute = protectRoute;
    window.ActivityLogger = ActivityLogger;
    window.SidebarManager = SidebarManager;
    window.URLHelper = URLHelper;
    window.PurchaseManager = PurchaseManager;
}
