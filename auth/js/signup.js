import { auth } from '../../firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
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
        
        // التحقق من تطابق كلمتي المرور
        if (confirmPasswordInput.value.length > 0) {
            checkPasswordsMatch();
        }
    });

    // التحقق من تطابق كلمتي المرور عند الكتابة
    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordInput.classList.add('input-error');
            showError('Passwords do not match');
        } else {
            confirmPasswordInput.classList.remove('input-error');
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    });

    // دالة التحقق من تطابق كلمتي المرور
    function checkPasswordsMatch() {
        const errorMessage = document.querySelector('.password-match-error');
        if (errorMessage) {
            errorMessage.remove();
        }

        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordInput.classList.add('input-error');
            const matchError = document.createElement('div');
            matchError.className = 'input-error-message password-match-error';
            matchError.textContent = 'Passwords do not match';
            confirmPasswordInput.closest('.input-group').insertAdjacentElement('afterend', matchError);
        } else {
            confirmPasswordInput.classList.remove('input-error');
        }
    }

    // Toggle password visibility for both password fields
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // الحصول على حقل كلمة المرور المرتبط بالزر
            const input = btn.previousElementSibling;
            
            // تبديل نوع الحقل
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            // تبديل الأيقونة
            btn.classList.toggle('fa-eye');
            btn.classList.toggle('fa-eye-slash');
        });
    });

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError('Passwords do not match');
            return;
        }

        // Validate password length
        if (passwordInput.value.length < 8) {
            showError('Password must be at least 8 characters');
            return;
        }

        try {
            // Create user with email and password
            await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);

            // Redirect to dashboard
            window.location.href = '../dashboard.html';
            
        } catch (error) {
            handleFirebaseError(error);
        }
    });

    // Google Sign Up
    googleBtn.addEventListener('click', async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            window.location.href = '../dashboard.html';
        } catch (error) {
            handleFirebaseError(error);
        }
    });

    // Helper functions
    function showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        signupForm.insertBefore(errorDiv, signupForm.firstChild);
        
        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 5000);
    }

    function handleFirebaseError(error) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                showError('This email is already registered. Please login instead.');
                break;
            case 'auth/invalid-email':
                showError('Please enter a valid email address.');
                break;
            case 'auth/operation-not-allowed':
                showError('Email/password accounts are not enabled. Please contact support.');
                break;
            case 'auth/weak-password':
                showError('Please choose a stronger password.');
                break;
            default:
                showError(error.message);
        }
    }
}); 