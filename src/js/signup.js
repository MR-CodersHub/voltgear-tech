/**
 * signup.js
 * Logic for the TechGear Signup page
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

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            FormValidator.clearAllErrors(this);

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validate
            let isValid = true;

            if (!FormValidator.validateRequired(name)) {
                FormValidator.showError(document.getElementById('name'), 'Name is required');
                isValid = false;
            }

            if (!FormValidator.validateEmail(email)) {
                FormValidator.showError(document.getElementById('email'), 'Please enter a valid email');
                isValid = false;
            }

            if (!FormValidator.validatePassword(password)) {
                FormValidator.showError(document.getElementById('password'), 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!isValid) return;

            // Attempt signup
            const result = auth.signup({ name, email, password });

            if (result.success) {
                Toast.success('Account created successfully. Please sign in.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                Toast.error(result.message);
            }
        });
    }
});
