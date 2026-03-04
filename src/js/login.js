/**
 * login.js
 * Logic for the TechGear Login page with Admin/User separation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (auth.isAuthenticated()) {
        const user = auth.getCurrentUser();
        const dashboardUrl = user && user.role === 'admin'
            ? 'admin/admin-dashboard.html'
            : 'user/user-dashboard.html';
        window.location.href = dashboardUrl;
    }

    const loginForm = document.getElementById('login-form');
    let loginType = 'user'; // default

    if (loginForm) {
        // Tab Selection Logic
        const userTab = document.getElementById('user-tab');
        const adminTab = document.getElementById('admin-tab');
        const adminError = document.getElementById('admin-error');

        const switchTab = (type) => {
            loginType = type;
            if (adminError) adminError.classList.add('hidden');

            if (type === 'user') {
                userTab.classList.add('active');
                userTab.setAttribute('aria-selected', 'true');
                adminTab.classList.remove('active');
                adminTab.setAttribute('aria-selected', 'false');
            } else {
                adminTab.classList.add('active');
                adminTab.setAttribute('aria-selected', 'true');
                userTab.classList.remove('active');
                userTab.setAttribute('aria-selected', 'false');
            }
        };

        if (userTab && adminTab) {
            userTab.addEventListener('click', () => switchTab('user'));
            adminTab.addEventListener('click', () => switchTab('admin'));
        }

        // Password Toggle
        const toggleBtn = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');

        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Toggle Icon
                toggleBtn.innerHTML = type === 'password'
                    ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`
                    : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`;
            });
        }

        // Handle Login Submission
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (adminError) adminError.classList.add('hidden');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (loginType === 'admin') {
                // Strictly enforce admin credentials (admin123)
                if (email === 'admin@gmail.com' && password === 'admin123') {
                    const result = auth.login({ email, password });
                    if (result.success) {
                        Toast.success('Admin access authorized. Redirecting...');
                        setTimeout(() => {
                            window.location.href = 'admin/admin-dashboard.html';
                        }, 1000);
                    }
                } else {
                    if (adminError) {
                        adminError.classList.remove('hidden');
                        adminError.classList.add('animate-shake');
                        setTimeout(() => adminError.classList.remove('animate-shake'), 500);
                    }
                }
            } else {
                // User login - allow any valid email/password
                if (FormValidator.validateEmail(email)) {
                    // We'll simulate a user login here
                    const userData = {
                        id: 'simulated-user-' + Date.now(),
                        name: email.split('@')[0],
                        email: email,
                        role: 'user'
                    };
                    localStorage.setItem('techgear_current_user', JSON.stringify(userData));

                    Toast.success('Login successful! Welcome to VoltGear.');

                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectUrl = urlParams.get('redirect');

                    // Security check for redirect
                    const isSafeRedirect = (url) => {
                        if (!url) return false;
                        // Prevent absolute URLs to external domains or file protocol
                        if (url.includes('://') || url.startsWith('//')) return false;
                        return true;
                    };

                    setTimeout(() => {
                        if (isSafeRedirect(redirectUrl)) {
                            window.location.href = decodeURIComponent(redirectUrl);
                        } else {
                            // Default to user dashboard or admin dashboard
                            const user = auth.getCurrentUser();
                            window.location.href = user && user.role === 'admin'
                                ? 'admin/admin-dashboard.html'
                                : 'user/user-dashboard.html';
                        }
                    }, 1000);
                } else {
                    Toast.error('Please enter a valid email address');
                }
            }
        });
    }
});
