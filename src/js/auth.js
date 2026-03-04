// ========================================
// TechGear Authentication System
// LocalStorage-based user management
// ========================================

class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Load current user from localStorage
    const userData = localStorage.getItem('techgear_current_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // Check if user is logged in
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get dashboard URL based on role
  getDashboardUrl() {
    if (!this.currentUser) {
      return 'auth/login.html';
    }
    return this.currentUser.role === 'admin'
      ? 'auth/admin/admin-dashboard.html'
      : 'auth/user/user-dashboard.html';
  }

  // Protect routes based on authentication and role
  protectRoute(requiredRole = null) {
    if (!this.isAuthenticated()) {
      Toast.error('Please log in first');
      setTimeout(() => {
        window.location.href = 'auth/login.html';
      }, 1000);
      return false;
    }

    if (requiredRole && this.currentUser.role !== requiredRole) {
      Toast.error('Access denied. Insufficient permissions.');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
      return false;
    }

    return true;
  }

  // Sign up new user
  signup(userData) {
    const { name, email, password } = userData;

    // Validate input
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }

    if (!this.validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists or is reserved admin email
    const users = this.getAllUsers();
    if (users.find(u => u.email === email) || email.toLowerCase() === 'admin@gmail.com') {
      return { success: false, message: 'Email already registered or restricted' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      role: 'user',
      createdAt: new Date().toISOString(),
      viewedProducts: [],
      interactions: []
    };

    // Save to users list
    users.push(newUser);
    localStorage.setItem('techgear_users', JSON.stringify(users));

    // Do not auto-login. Require user to sign in manually.
    // this.login({ email, password });

    return { success: true, message: 'Account created successfully', user: newUser };
  }

  // Login user
  login(credentials) {
    const { email, password } = credentials;

    // Validate input
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    // SPECIAL: Hardcoded Admin check
    if (email === 'admin@gmail.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin-voltgear-root',
        name: 'VoltGear Admin',
        email: 'admin@gmail.com',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z'
      };
      this.currentUser = adminUser;
      localStorage.setItem('techgear_current_user', JSON.stringify(adminUser));

      // Update last login
      adminUser.lastLogin = new Date().toISOString();

      return { success: true, message: 'Welcome back, Root Administrator.', user: adminUser };
    }

    // Find user
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Set current user
    this.currentUser = user;
    localStorage.setItem('techgear_current_user', JSON.stringify(user));

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.updateUser(user);

    return { success: true, message: 'Login successful', user };
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('techgear_current_user');

    // Clear cart on logout
    if (window.Cart) {
      window.Cart.clearCart();
    }

    // Dispatch logout event
    window.dispatchEvent(new Event('logout'));

    return { success: true, message: 'Logged out successfully' };
  }

  // Get all users
  getAllUsers() {
    const users = localStorage.getItem('techgear_users');
    return users ? JSON.parse(users) : [];
  }

  // Update user data
  updateUser(updatedUser) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);

    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('techgear_users', JSON.stringify(users));

      // Update current user if it's the same
      if (this.currentUser && this.currentUser.id === updatedUser.id) {
        this.currentUser = updatedUser;
        localStorage.setItem('techgear_current_user', JSON.stringify(updatedUser));
      }

      return { success: true };
    }

    return { success: false, message: 'User not found' };
  }

  // Add viewed product
  addViewedProduct(productId, productName) {
    if (!this.isAuthenticated()) return;

    const user = this.getCurrentUser();
    if (!user.viewedProducts) user.viewedProducts = [];

    // Add to beginning of array (most recent first)
    user.viewedProducts.unshift({
      id: productId,
      name: productName,
      viewedAt: new Date().toISOString()
    });

    // Keep only last 10
    user.viewedProducts = user.viewedProducts.slice(0, 10);

    this.updateUser(user);
  }

  // Add interaction
  addInteraction(type, description) {
    if (!this.isAuthenticated()) return;

    const user = this.getCurrentUser();
    if (!user.interactions) user.interactions = [];

    user.interactions.unshift({
      type,
      description,
      timestamp: new Date().toISOString()
    });

    // Keep only last 20
    user.interactions = user.interactions.slice(0, 20);

    this.updateUser(user);
  }

  // Email validation
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

// Initialize global auth instance
const auth = new AuthSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthSystem;
}
