document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');

    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Show message function
    function showMessage(message, isError = true) {
        const existingMessage = document.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = isError ? 'error-message' : 'success-message';
        messageDiv.textContent = message;
        
        resetForm.insertBefore(messageDiv, resetForm.firstChild);

        if (!isError) {
            // Disable the form and input after successful submission
            emailInput.disabled = true;
            resetForm.querySelector('button').disabled = true;
        }
    }

    // Handle form submission
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isValidEmail(emailInput.value)) {
            showMessage('Please enter a valid email address.');
            return;
        }

        try {
            await firebase.auth().sendPasswordResetEmail(emailInput.value);
            showMessage('Password reset link has been sent to your email.', false);
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);

        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    showMessage('No account found with this email address.');
                    break;
                case 'auth/invalid-email':
                    showMessage('Please enter a valid email address.');
                    break;
                case 'auth/too-many-requests':
                    showMessage('Too many attempts. Please try again later.');
                    break;
                default:
                    showMessage(error.message);
            }
        }
    });
}); 