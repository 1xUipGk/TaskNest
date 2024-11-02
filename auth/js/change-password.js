document.addEventListener('DOMContentLoaded', () => {
    const changePasswordForm = document.getElementById('changePasswordForm');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const passwordHint = document.querySelector('.password-hint');

    // Password validation
    newPasswordInput.addEventListener('input', () => {
        if (newPasswordInput.value.length > 0) {
            passwordHint.style.display = 'block';
            if (newPasswordInput.value.length < 8) {
                passwordHint.style.color = 'var(--error-color)';
                newPasswordInput.classList.add('input-error');
            } else {
                passwordHint.style.display = 'none';
                newPasswordInput.classList.remove('input-error');
            }
        } else {
            passwordHint.style.display = 'none';
            newPasswordInput.classList.remove('input-error');
        }
        
        // Check password match
        if (confirmPasswordInput.value.length > 0) {
            checkPasswordsMatch();
        }
    });

    // Check passwords match
    confirmPasswordInput.addEventListener('input', checkPasswordsMatch);

    function checkPasswordsMatch() {
        if (confirmPasswordInput.value !== newPasswordInput.value) {
            confirmPasswordInput.classList.add('input-error');
            showMessage('Passwords do not match');
        } else {
            confirmPasswordInput.classList.remove('input-error');
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    }

    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            btn.classList.toggle('fa-eye');
            btn.classList.toggle('fa-eye-slash');
        });
    });

    // Handle form submission
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate new password length
        if (newPasswordInput.value.length < 8) {
            showMessage('New password must be at least 8 characters');
            return;
        }

        // Validate passwords match
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            showMessage('Passwords do not match');
            return;
        }

        try {
            const user = firebase.auth().currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                currentPasswordInput.value
            );

            // Reauthenticate user
            await user.reauthenticateWithCredential(credential);

            // Update password
            await user.updatePassword(newPasswordInput.value);

            showMessage('Password updated successfully!', false);
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    showMessage('Current password is incorrect');
                    break;
                case 'auth/weak-password':
                    showMessage('New password is too weak');
                    break;
                case 'auth/requires-recent-login':
                    showMessage('Please log in again to change your password');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                    break;
                default:
                    showMessage(error.message);
            }
        }
    });

    // Show message function
    function showMessage(message, isError = true) {
        const existingMessage = document.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = isError ? 'error-message' : 'success-message';
        messageDiv.textContent = message;
        
        changePasswordForm.insertBefore(messageDiv, changePasswordForm.firstChild);
    }
}); 