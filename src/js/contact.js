/**
 * contact.js
 * Logic for the TechGear Contact page
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            FormValidator.clearAllErrors(this);

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            let isValid = true;

            // Validate name
            if (!FormValidator.validateRequired(name)) {
                FormValidator.showError(document.getElementById('name'), 'Name is required');
                isValid = false;
            }

            // Validate email
            if (!FormValidator.validateEmail(email)) {
                FormValidator.showError(document.getElementById('email'), 'Please enter a valid email');
                isValid = false;
            }

            // Validate phone (if provided)
            if (phone && !FormValidator.validatePhone(phone)) {
                FormValidator.showError(document.getElementById('phone'), 'Please enter a valid phone number');
                isValid = false;
            }

            // Validate subject
            if (!subject) {
                FormValidator.showError(document.getElementById('subject'), 'Please select a subject');
                isValid = false;
            }

            // Validate message
            if (!FormValidator.validateRequired(message)) {
                FormValidator.showError(document.getElementById('message'), 'Message is required');
                isValid = false;
            }

            if (isValid) {
                // Save to localStorage
                const contacts = StorageHelper.get('techgear_contacts', []);
                contacts.push({
                    id: generateId(),
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    date: new Date().toISOString()
                });
                StorageHelper.set('techgear_contacts', contacts);

                // Show success message
                Toast.success('Message sent successfully! We\'ll get back to you soon.');

                // Reset form
                this.reset();

                // Track interaction if logged in
                if (auth.isAuthenticated()) {
                    auth.addInteraction('contact', 'Submitted contact form');
                }
            }
        });
    }
});
