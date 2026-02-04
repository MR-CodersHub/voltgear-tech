/**
 * login.js
 * Logic for the TechGear Login page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (auth.isAuthenticated()) {
        window.location.href = auth.getDashboardUrl();
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
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
                setTimeout(() => {
                    window.location.href = auth.getDashboardUrl();
                }, 1000);
            } else {
                Toast.error(result.message);
            }
        });
    }
});
