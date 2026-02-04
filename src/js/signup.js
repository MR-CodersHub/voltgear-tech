/**
 * signup.js
 * Logic for the TechGear Signup page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (auth.isAuthenticated()) {
        window.location.href = auth.getDashboardUrl();
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
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;

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

            if (password !== confirmPassword) {
                FormValidator.showError(document.getElementById('confirm-password'), 'Passwords do not match');
                isValid = false;
            }

            if (!termsAccepted) {
                Toast.error('Please accept the terms and conditions');
                isValid = false;
            }

            if (!isValid) return;

            // Attempt signup
            const result = auth.signup({ name, email, password });

            if (result.success) {
                // Log activity
                ActivityLogger.log('Signup', { email: result.user.email });
                ActivityLogger.log('Login', { description: 'Automatic login after signup' });

                Toast.success('Account created successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = auth.getDashboardUrl();
                }, 1000);
            } else {
                Toast.error(result.message);
            }
        });
    }
});
