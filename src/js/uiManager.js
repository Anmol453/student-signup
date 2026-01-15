/**
 * UI Manager Module
 * Handles all UI updates, animations, and user feedback
 */

export class UIManager {
    constructor() {
        this.elements = this.initializeElements();
    }

    /**
     * Initialize all DOM element references
     */
    initializeElements() {
        return {
            form: document.getElementById('studentForm'),
            studentCount: document.getElementById('studentCount'),
            successPopup: document.getElementById('successPopup'),
            errorPopup: document.getElementById('errorPopup'),
            errorMessage: document.getElementById('errorMessage'),
            errorOkButton: document.getElementById('errorOkButton'),
            
            // Avatar elements
            avatarUpload: document.getElementById('avatarUpload'),
            uploadBtn: document.getElementById('uploadBtn'),
            fileName: document.getElementById('fileName'),
            avatarPreview: document.getElementById('avatarPreview'),
            generatedAvatar: document.getElementById('generatedAvatar'),
            avatarError: document.getElementById('avatarError'),
            avatarLoading: document.getElementById('avatarLoading')
        };
    }

    /**
     * Show field error message
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#dc3545';
    }

    /**
     * Clear field error message
     */
    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '#e1e5e9';
    }

    /**
     * Show success popup
     */
    showSuccessPopup() {
        this.elements.form.style.pointerEvents = 'none';
        this.elements.form.style.opacity = '0.7';
        
        if (this.elements.successPopup) {
            this.elements.successPopup.classList.remove('hidden');
        }
        
        setTimeout(() => {
            if (this.elements.successPopup) {
                this.elements.successPopup.classList.add('hidden');
            }
            this.elements.form.style.pointerEvents = 'auto';
            this.elements.form.style.opacity = '1';
        }, 3000);
    }

    /**
     * Show error popup
     */
    showErrorPopup(message) {
        if (this.elements.errorPopup && this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
            this.elements.errorPopup.classList.remove('hidden');
        }
    }

    /**
     * Hide error popup
     */
    hideErrorPopup() {
        if (this.elements.errorPopup) {
            this.elements.errorPopup.classList.add('hidden');
        }
    }

    /**
     * Add shake animation to form
     */
    shakeForm() {
        this.elements.form.classList.add('form-shake');
        setTimeout(() => {
            this.elements.form.classList.remove('form-shake');
        }, 400);
    }

    /**
     * Update student count with animation
     */
    updateStudentCount(count) {
        const previousCount = parseInt(this.elements.studentCount.textContent) || 0;
        this.elements.studentCount.textContent = count;
        
        if (count > previousCount) {
            this.elements.studentCount.classList.add('counter-pop');
            setTimeout(() => {
                this.elements.studentCount.classList.remove('counter-pop');
            }, 500);
        }
    }

    /**
     * Avatar UI methods
     */
    showAvatarLoading() {
        this.elements.avatarLoading.classList.remove('hidden');
    }

    hideAvatarLoading() {
        this.elements.avatarLoading.classList.add('hidden');
    }

    showAvatarPreview(avatarUrl) {
        console.log('showAvatarPreview called with URL:', avatarUrl);
        console.log('Avatar image element:', this.elements.generatedAvatar);
        console.log('Avatar preview container:', this.elements.avatarPreview);
        
        if (!avatarUrl) {
            console.error('Avatar URL is null or undefined!');
            return;
        }
        
        // Add load and error handlers to debug image loading
        this.elements.generatedAvatar.onload = () => {
            console.log('✓ Avatar image loaded successfully!');
        };
        
        this.elements.generatedAvatar.onerror = (error) => {
            console.error('✗ Avatar image failed to load:', error);
            console.error('Failed URL:', avatarUrl);
        };
        
        this.elements.generatedAvatar.src = avatarUrl;
        this.elements.avatarPreview.classList.remove('hidden');
        
        console.log('Avatar preview should now be visible');
        console.log('Preview classes:', this.elements.avatarPreview.className);
        console.log('Image src set to:', this.elements.generatedAvatar.src);
    }

    hideAvatarPreview() {
        this.elements.avatarPreview.classList.add('hidden');
    }

    showAvatarError(message) {
        this.elements.avatarError.textContent = message;
        this.elements.avatarError.classList.remove('hidden');
        this.elements.avatarError.classList.remove('avatar-warning');
        this.elements.avatarError.classList.add('avatar-error');
    }

    hideAvatarError() {
        this.elements.avatarError.classList.add('hidden');
    }

    showAvatarWarning(message) {
        this.elements.avatarError.textContent = '⚠️ ' + message;
        this.elements.avatarError.classList.remove('hidden');
        this.elements.avatarError.classList.remove('avatar-error');
        this.elements.avatarError.classList.add('avatar-warning');
    }

    updateFileName(name) {
        this.elements.fileName.textContent = name;
    }

    /**
     * Show submit button loading state
     */
    showSubmitLoading() {
        const submitBtn = this.elements.form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
        }
    }

    /**
     * Hide submit button loading state
     */
    hideSubmitLoading() {
        const submitBtn = this.elements.form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register Student';
        }
    }

    /**
     * Reset all form fields and UI state
     */
    resetForm() {
        this.elements.form.reset();
        
        // Reset avatar UI
        this.updateFileName('No file chosen');
        this.hideAvatarPreview();
        this.hideAvatarError();
        this.hideAvatarLoading();
        
        // Remove all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        // Reset field border colors
        const inputs = this.elements.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '#e1e5e9';
        });
    }
}
