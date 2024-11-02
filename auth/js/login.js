document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const googleBtn = document.querySelector('.google-btn');
    const passwordHint = document.querySelector('.password-hint');

// Password validation
passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length > 0) {
        passwordHint.style.display = 'block';
        if (passwordInput.value.length < 8) {
            passwordHint.style.color = 'var(--error-color)';
            passwordInput.classList.add('input-error');
        } else {
            passwordHint.style.display = 'none';
            passwordInput.classList.remove('input-error');
        }
    } else {
        passwordHint.style.display = 'none';
        passwordInput.classList.remove('input-error');
    }
});

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    const input = passwordInput;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    togglePasswordBtn.classList.toggle('fa-eye');
    togglePasswordBtn.classList.toggle('fa-eye-slash');
});


    // Email validation
    emailInput.addEventListener('input', () => {
        removeError(emailInput);
        if (!isValidEmail(emailInput.value) && emailInput.value.length > 0) {
            showInputError(emailInput, 'Please enter a valid email address and try again.');
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        removeAllErrors();
        
        // Validate email
        if (!isValidEmail(emailInput.value)) {
            showInputError(emailInput, 'Please enter a valid email address and try again.');
            return;
        }

        // Validate password
        if (passwordInput.value.length < 8) {
            showInputError(passwordInput, 'Password must be at least 8 characters');
            return;
        }
        
        try {
            await firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value);
            window.location.href = '../dashboard.html';
        } catch (error) {
            handleFirebaseError(error);
        }
    });

    // Google Sign In
    googleBtn.addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
            window.location.href = '../dashboard.html';
        } catch (error) {
            handleFirebaseError(error);
        }
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const input = passwordInput;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        togglePasswordBtn.classList.toggle('fa-eye');
        togglePasswordBtn.classList.toggle('fa-eye-slash');
    });

    // Helper functions
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showInputError(inputElement, message) {
        const inputGroup = inputElement.closest('.input-group');
        
        // Remove existing error if any
        removeError(inputElement);
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error-message';
        errorDiv.textContent = message;
        
        // Add error class to input
        inputElement.classList.add('input-error');
        
        // Insert error message after input group
        inputGroup.insertAdjacentElement('afterend', errorDiv);
    }

    function removeError(inputElement) {
        const inputGroup = inputElement.closest('.input-group');
        const errorMessage = inputGroup.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('input-error-message')) {
            errorMessage.remove();
        }
        inputElement.classList.remove('input-error');
    }

    function removeAllErrors() {
        document.querySelectorAll('.input-error-message').forEach(error => error.remove());
        document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
    }

    function handleFirebaseError(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                showInputError(emailInput, 'Email address not found. Please check your email or sign up.');
                break;
            case 'auth/wrong-password':
                showInputError(passwordInput, 'Incorrect password. Please try again.');
                break;
            case 'auth/invalid-email':
                showInputError(emailInput, 'Please enter a valid email address and try again.');
                break;
            case 'auth/too-many-requests':
                showInputError(passwordInput, 'Too many failed attempts. Please try again later.');
                break;
            default:
                showInputError(emailInput, error.message);
        }
    }
}); 