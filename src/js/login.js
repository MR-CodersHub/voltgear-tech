/**
 * login.js
 * Logic for the TechGear Login page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (auth.isAuthenticated()) {
        const user = auth.getCurrentUser();
        const dashboardUrl = user && user.role === 'admin'
            ? '../auth/admin/admin-dashboard.html'
            : '../auth/user/user-dashboard.html';
        window.location.href = dashboardUrl;
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
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

        // Reset Password Modal Logic
        const resetModal = document.getElementById('reset-modal');
        const forgotLink = document.getElementById('forgot-password-link');
        const closeResetBtn = document.getElementById('close-reset-modal');
        const resetForm = document.getElementById('reset-form');

        if (resetModal && forgotLink && closeResetBtn) {
            const toggleModal = (show) => {
                if (show) {
                    resetModal.classList.remove('hidden');
                    // Small delay to allow display:block to apply before opacity transition
                    requestAnimationFrame(() => {
                        resetModal.classList.remove('opacity-0');
                        document.getElementById('reset-modal-content').classList.remove('scale-95');
                        document.getElementById('reset-modal-content').classList.add('scale-100');
                    });
                } else {
                    resetModal.classList.add('opacity-0');
                    document.getElementById('reset-modal-content').classList.remove('scale-100');
                    document.getElementById('reset-modal-content').classList.add('scale-95');
                    setTimeout(() => {
                        resetModal.classList.add('hidden');
                    }, 300);
                }
            };

            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(true);
            });

            closeResetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(false);
            });

            // Close on outside click
            resetModal.addEventListener('click', (e) => {
                if (e.target === resetModal) toggleModal(false);
            });

            // Handle Reset Submission
            if (resetForm) {
                resetForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = document.getElementById('reset-email').value;

                    if (!FormValidator.validateEmail(email)) {
                        Toast.error('Please enter a valid email address');
                        return;
                    }

                    // Simulate API call
                    const btn = resetForm.querySelector('button');
                    const originalText = btn.innerText;
                    btn.disabled = true;
                    btn.innerText = 'Transmitting...';

                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerText = originalText;
                        toggleModal(false);
                        Toast.success('Recovery link sent to secure channel.');
                        resetForm.reset();
                    }, 1500);
                });
            }
        }

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            FormValidator.clearAllErrors(this);

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validate
            let isValid = true;

            if (!FormValidator.validateEmail(email)) {
                FormValidator.showError(document.getElementById('email'), 'Please enter a valid email');
                isValid = false;
            }

            if (!FormValidator.validatePassword(password)) {
                FormValidator.showError(document.getElementById('password'), 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!isValid) return;

            // Attempt login
            const result = auth.login({ email, password });

            if (result.success) {
                // Log activity
                ActivityLogger.log('Login', { description: 'Successful login' });

                Toast.success('Login successful! Redirecting...');
                // Redirect to correct dashboard
                const user = result.user;
                const dashboardPath = user.role === 'admin'
                    ? '../auth/admin/admin-dashboard.html'
                    : '../auth/user/user-dashboard.html';

                setTimeout(() => {
                    window.location.href = dashboardPath;
                }, 1000);
            } else {
                Toast.error(result.message);
            }
        });
    }
});
