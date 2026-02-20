/**
 * navbar.js
 * Professional dynamic Navbar component for VoltGear
 */

class Navbar {
  constructor() {
    this.basePath = this.getBasePath();
    this.init();
  }

  init() {
    this.injectNavbar();
    this.setupEventListeners();
    this.updateAuthState();
    this.setActiveLink();
    this.setupCartCounter();
  }

  getBasePath() {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/' || path.split('/').pop() === '') {
      return '';
    }
    if (path.includes('/public/pages/')) {
      return '../../';
    }
    if (path.includes('/auth/')) {
      if (path.includes('/admin/') || path.includes('/user/')) {
        return '../../';
      }
      return '../';
    }
    return './';
  }

  injectNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    const navbarHTML = `
      <nav class="navbar-aurora fixed top-0 left-0 right-0 z-50 bg-dark-primary/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            
            <!-- LEFT: Brand Name -->
            <div class="flex-shrink-0 order-1 flex items-center space-x-2">
              <a href="${this.basePath}index.html" class="flex items-center gap-2 text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                <img src="${this.basePath}assets/img/logo.svg" alt="VoltGear Logo" class="h-10 w-10">
                <span>Volt<span class="text-accent font-italic">Gear</span></span>
              </a>
            </div>

            <!-- CENTER: Main Navigation Links -->
            <div class="hidden lg:flex items-center space-x-8 order-2">
              <a href="${this.basePath}index.html" class="nav-link text-sm font-semibold tracking-wider transition">HOME</a>
              <a href="${this.basePath}public/pages/home-2.html" class="nav-link text-sm font-semibold tracking-wider transition">GEAR LAB</a>
              <a href="${this.basePath}public/pages/services.html" class="nav-link text-sm font-semibold tracking-wider transition">PRODUCTS</a>
              <a href="${this.basePath}public/pages/about.html" class="nav-link text-sm font-semibold tracking-wider transition">ABOUT</a>
              <a href="${this.basePath}public/pages/blog.html" class="nav-link text-sm font-semibold tracking-wider transition">BLOG</a>
              <a href="${this.basePath}public/pages/contact.html" class="nav-link text-sm font-semibold tracking-wider transition">CONTACT</a>
            </div>

            <!-- RIGHT: Profile & Cart -->
            <div class="flex items-center space-x-4 order-3">
              <!-- Cart Link (NEW) -->
              <a href="${this.basePath}public/pages/cart.html" class="p-2.5 rounded-full hover:bg-white/5 transition relative group" title="View Cart">
                <svg class="w-6 h-6 text-white group-hover:text-accent transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span id="cart-count" class="absolute top-1 right-1 bg-accent text-dark-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center opacity-0 transition-opacity">0</span>
              </a>

              <div class="relative">
                <button id="profile-btn" class="flex items-center space-x-2 p-1.5 rounded-full hover:bg-white/5 transition group ring-1 ring-white/10 hover:ring-accent/50">
                  <div class="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-accent transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </button>

                <!-- Dropdown Menu -->
                <div id="profile-dropdown" class="absolute right-0 mt-4 w-56 glass-panel bg-dark-primary shadow-2xl opacity-0 invisible translate-y-2 transition-all duration-300 z-50 overflow-hidden border-white/10">
                  <div id="auth-links" class="py-2">
                    <!-- Dynamically populated -->
                  </div>
                </div>
              </div>

              <!-- Mobile Toggle -->
              <button id="mobile-menu-btn" class="lg:hidden text-white hover:text-accent transition p-2">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>

          </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="lg:hidden glass-panel bg-dark-primary border-t border-white/5 h-0 overflow-hidden transition-all duration-300 rounded-none">
          <div class="px-6 pt-4 pb-8 space-y-3" id="mobile-nav-container">
            <a href="${this.basePath}index.html" class="block py-3 text-lg font-bold hover:text-accent transition">HOME</a>
            <a href="${this.basePath}public/pages/home-2.html" class="block py-3 text-lg font-bold hover:text-accent transition">GEAR LAB</a>
            <a href="${this.basePath}public/pages/services.html" class="block py-3 text-lg font-bold hover:text-accent transition">PRODUCTS</a>
            <a href="${this.basePath}public/pages/about.html" class="block py-3 text-lg font-bold hover:text-accent transition">ABOUT</a>
            <a href="${this.basePath}public/pages/blog.html" class="block py-3 text-lg font-bold hover:text-accent transition">BLOG</a>
            <a href="${this.basePath}public/pages/contact.html" class="block py-3 text-lg font-bold hover:text-accent transition">CONTACT</a>
            <div class="border-t border-white/10 pt-6 mt-6" id="mobile-auth-links">
                <!-- Auth links -->
            </div>
          </div>
        </div>
      </nav>
    `;

    navbarContainer.innerHTML = navbarHTML;
  }

  setupEventListeners() {
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle Profile Dropdown
    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('opacity-0');
        profileDropdown.classList.toggle('invisible');
        profileDropdown.classList.toggle('translate-y-2');
        profileDropdown.classList.toggle('translate-y-0');
      });
    }

    // Toggle Mobile Menu
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.style.height !== '0px' && mobileMenu.style.height !== '';
        mobileMenu.style.height = isOpen ? '0px' : `${mobileMenu.scrollHeight}px`;
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (profileDropdown && !profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        profileDropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
        profileDropdown.classList.remove('translate-y-0');
      }
    });
  }

  updateAuthState() {
    if (typeof auth === 'undefined') return;

    const authLinks = document.getElementById('auth-links');
    const mobileAuthLinks = document.getElementById('mobile-auth-links');
    const user = auth.getCurrentUser();

    let desktopAuthHTML = '';
    let mobileAuthHTML = '';

    if (user) {
      const dashboardPath = user.role === 'admin'
        ? `${this.basePath}auth/admin/admin-dashboard.html`
        : `${this.basePath}auth/user/user-dashboard.html`;

      desktopAuthHTML = `
                <div class="px-4 py-2 border-b border-white/5 mb-1">
                    <p class="text-xs text-secondary mb-1">Signed in as</p>
                    <p class="text-sm font-bold truncate text-accent">${user.name}</p>
                </div>
                <a href="${dashboardPath}" class="block px-4 py-3 text-sm hover:bg-white/5 hover:text-accent transition">My Dashboard</a>
                <button onclick="auth.logout()" class="w-full text-left block px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition border-t border-white/5">Sign Out</button>
            `;
      mobileAuthHTML = `
                <div class="px-3 py-2 mb-2">
                    <p class="text-xs text-secondary">Signed in as</p>
                    <p class="text-sm font-bold text-accent">${user.name}</p>
                </div>
                <a href="${dashboardPath}" class="block px-3 py-3 text-base font-medium rounded-lg hover:bg-white/5 transition">Dashboard</a>
                <button onclick="auth.logout()" class="w-full text-left block px-3 py-3 text-base font-medium rounded-lg text-red-400 hover:bg-white/5 transition">Sign Out</button>
            `;
    } else {
      desktopAuthHTML = `
                <a href="${this.basePath}auth/login.html" class="block px-4 py-3 text-sm hover:bg-white/5 hover:text-accent transition">Sign In</a>
                <a href="${this.basePath}auth/signup.html" class="block px-4 py-3 text-sm hover:bg-white/5 hover:text-accent transition border-t border-white/5">Create Account</a>
            `;
      mobileAuthHTML = `
                <a href="${this.basePath}auth/login.html" class="block w-full text-center px-4 py-3 mb-3 text-base font-bold text-white border border-white/20 rounded-xl hover:bg-white/10 hover:border-accent hover:text-accent transition-all duration-300">Sign In</a>
                <a href="${this.basePath}auth/signup.html" class="block w-full text-center px-4 py-3 text-base font-bold bg-accent text-dark-primary rounded-xl hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300">Create Account</a>
            `;
    }

    if (authLinks) authLinks.innerHTML = desktopAuthHTML;
    if (mobileAuthLinks) mobileAuthLinks.innerHTML = mobileAuthHTML;
  }

  setActiveLink() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('#mobile-nav-container a');
    const allNavLinks = [...navLinks, ...mobileNavLinks];

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      let isMatch = false;
      const normalizedHref = href.toLowerCase();

      // Extract just the filename from both paths
      const currentFile = currentPath.split('/').filter(p => p).pop() || 'index.html';
      const linkFile = normalizedHref.split('/').filter(p => p).pop() || 'index.html';

      // Home page special case
      if ((currentFile === '' || currentFile === 'index.html') &&
        (normalizedHref.includes('index.html') || normalizedHref === '.' || normalizedHref === './' || normalizedHref === '')) {
        isMatch = true;
      }
      // Check for exact filename match (more precise than path includes)
      else if (currentFile && linkFile && currentFile === linkFile && !currentFile.includes('?')) {
        isMatch = true;
      }
      // Fallback: partial match for nested paths
      else if (normalizedHref.length > 0 && normalizedHref !== '.' && normalizedHref !== './' &&
        currentPath.includes(normalizedHref.replace(/\.\.\//g, '').replace(/\.\//g, ''))) {
        // Make sure we're not matching "services" with "service-details"
        const cleanHref = normalizedHref.replace(/\.\.\//g, '').replace(/\.\//g, '').split('?')[0];
        const currentFile2 = currentPath.split('/').pop().split('?')[0];
        if (cleanHref === currentFile2) {
          isMatch = true;
        }
      }

      if (isMatch) {
        link.classList.add('text-accent');
        link.classList.remove('text-white');
      } else {
        link.classList.remove('text-accent');
        link.classList.add('text-white');
      }
    });
  }

  setupCartCounter() {
    // Update cart count immediately
    this.updateCartCount();

    // Listen for cart updates
    if (window.Cart) {
      window.Cart.onCartUpdate(() => {
        this.updateCartCount();
      });
    }
  }

  updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (!cartCountEl || !window.Cart) return;

    const count = window.Cart.getCartCount();
    cartCountEl.textContent = count;

    if (count > 0) {
      cartCountEl.classList.remove('opacity-0');
    } else {
      cartCountEl.classList.add('opacity-0');
    }
  }
}

// Global Logout function to handle redirect correctly
const originalLogout = typeof auth !== 'undefined' ? auth.logout : null;
if (typeof auth !== 'undefined') {
  auth.logout = function () {
    const basePath = (new Navbar()).basePath;
    StorageHelper.remove('techgear_current_user');
    ActivityLogger.log('Logout');
    window.location.href = `${basePath}index.html`;
  };
}

// Initialize Navbar on page load
document.addEventListener('DOMContentLoaded', () => {
  window.navbarInstance = new Navbar();
});
