/**
 * Form Validator Module
 * Handles comprehensive form validation
 */

import { Validators } from './validators.js';

export class FormValidator {
    constructor(uiManager, avatarHandler) {
        this.uiManager = uiManager;
        this.avatarHandler = avatarHandler;
    }

    /**
     * Validate entire form
     */
    validate() {
        // Check avatar validation first
        if (!this.avatarHandler.getValidationState().isValid) {
            this.uiManager.showAvatarError('Please upload a valid photo with a clear human face. Ensure the image shows only one person.');
            return false;
        }

        const requiredFields = ['fullName', 'company', 'phoneNumber', 'email'];
        let isValid = true;

        // Validate each required field
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                let fieldLabel = field.previousElementSibling?.textContent || fieldName;
                this.uiManager.showFieldError(field, `${fieldLabel} is required and cannot be empty`);
                isValid = false;
            } else {
                this.uiManager.clearFieldError(field);
            }
        });

        // Phone number validation
        const phoneField = document.getElementById('phoneNumber');
        if (phoneField.value && !Validators.isValidPhoneNumber(phoneField.value)) {
            const cleanPhone = phoneField.value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                this.uiManager.showFieldError(phoneField, `Phone number must be exactly 10 digits. You entered ${cleanPhone.length} digits. Format: 1234567890`);
            } else {
                this.uiManager.showFieldError(phoneField, 'Invalid phone number pattern. Please enter a valid 10-digit phone number (e.g., 4302032033)');
            }
            isValid = false;
        }

        // Alternate phone validation (optional field)
        const altPhoneField = document.getElementById('alternatePhone');
        if (altPhoneField.value && !Validators.isValidPhoneNumber(altPhoneField.value)) {
            const cleanPhone = altPhoneField.value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                this.uiManager.showFieldError(altPhoneField, `Alternate phone must be exactly 10 digits. You entered ${cleanPhone.length} digits. Format: 1234567890`);
            } else {
                this.uiManager.showFieldError(altPhoneField, 'Invalid alternate phone pattern. Please enter a valid 10-digit phone number (e.g., 4102012011)');
            }
            isValid = false;
        }

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField.value && !Validators.isValidEmail(emailField.value)) {
            const email = emailField.value;
            if (!email.includes('@')) {
                this.uiManager.showFieldError(emailField, 'Email must contain @ symbol. Format: username@domain.com');
            } else if (!email.includes('.')) {
                this.uiManager.showFieldError(emailField, 'Email must contain a domain extension. Format: username@domain.com');
            } else if (email.indexOf('@') > email.lastIndexOf('.')) {
                this.uiManager.showFieldError(emailField, 'Domain must come after @ symbol. Format: username@domain.com');
            } else {
                this.uiManager.showFieldError(emailField, 'Invalid email format. Please use format: username@domain.com (e.g., aron.smith@gmail.com)');
            }
            isValid = false;
        }

        return isValid;
    }

    /**
     * Real-time phone number validation
     */
    validatePhoneNumber(fieldId) {
        const phoneInput = document.getElementById(fieldId);
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        
        if (phoneValue.length > 10) {
            phoneInput.value = phoneValue.substring(0, 10);
        }
        
        if (phoneInput.value && !Validators.isValidPhoneNumber(phoneInput.value)) {
            const cleanPhone = phoneInput.value.replace(/\D/g, '');
            const fieldLabel = fieldId === 'alternatePhone' ? 'Alternate phone' : 'Phone number';
            
            if (cleanPhone.length < 10) {
                this.uiManager.showFieldError(phoneInput, `${fieldLabel} must be 10 digits. Currently ${cleanPhone.length} digits. Format: 1234567890`);
            } else if (cleanPhone.length === 10) {
                this.uiManager.showFieldError(phoneInput, `Invalid ${fieldLabel.toLowerCase()} pattern. Avoid repeated digits. Format: 4302032033`);
            }
        } else {
            this.uiManager.clearFieldError(phoneInput);
        }
    }

    /**
     * Real-time email validation
     */
    validateEmail() {
        const emailInput = document.getElementById('email');
        
        if (emailInput.value && !Validators.isValidEmail(emailInput.value)) {
            const email = emailInput.value;
            if (!email.includes('@')) {
                this.uiManager.showFieldError(emailInput, 'Email must contain @ symbol. Format: username@domain.com');
            } else if (!email.includes('.')) {
                this.uiManager.showFieldError(emailInput, 'Email must have domain extension. Format: username@domain.com');
            } else {
                this.uiManager.showFieldError(emailInput, 'Invalid email format. Use: username@domain.com (e.g., aron.smith@gmail.com)');
            }
        } else {
            this.uiManager.clearFieldError(emailInput);
        }
    }
}
