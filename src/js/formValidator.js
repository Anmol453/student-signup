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
            this.uiManager.showAvatarError('Please upload a valid photo with a human face.');
            return false;
        }

        const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'desiredCourse'];
        let isValid = true;

        // Validate each required field
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                this.uiManager.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.uiManager.clearFieldError(field);
            }
        });

        // Phone number validation
        const phoneField = document.getElementById('phoneNumber');
        if (phoneField.value && !Validators.isValidPhoneNumber(phoneField.value)) {
            this.uiManager.showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }

        // Date of birth validation
        const dateField = document.getElementById('dateOfBirth');
        if (dateField.value) {
            // Parse date string correctly (YYYY-MM-DD format)
            const [year, month, day] = dateField.value.split('-').map(Number);
            const birthDate = new Date(year, month - 1, day);
            const age = Validators.calculateAge(birthDate);
            
            if (!Validators.isValidDateOfBirth(dateField.value)) {
                if (age < 10) {
                    this.uiManager.showErrorPopup('Student must be at least 10 years old to register for courses.');
                    this.uiManager.showFieldError(dateField, 'Student must be at least 10 years old');
                } else {
                    this.uiManager.showFieldError(dateField, 'Please enter a valid date of birth');
                }
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Real-time phone number validation
     */
    validatePhoneNumber() {
        const phoneInput = document.getElementById('phoneNumber');
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        
        if (phoneValue.length > 10) {
            phoneInput.value = phoneValue.substring(0, 10);
        }
        
        if (phoneInput.value && !Validators.isValidPhoneNumber(phoneInput.value)) {
            this.uiManager.showFieldError(phoneInput, 'Please enter a valid phone number');
        } else {
            this.uiManager.clearFieldError(phoneInput);
        }
    }

    /**
     * Real-time date of birth validation
     */
    validateDateOfBirth() {
        const dateInput = document.getElementById('dateOfBirth');
        
        if (dateInput.value) {
            // Parse date string correctly (YYYY-MM-DD format)
            const [year, month, day] = dateInput.value.split('-').map(Number);
            const birthDate = new Date(year, month - 1, day);
            const age = Validators.calculateAge(birthDate);
            
            if (!Validators.isValidDateOfBirth(dateInput.value)) {
                if (age < 10) {
                    this.uiManager.showFieldError(dateInput, 'Student must be at least 10 years old');
                } else {
                    this.uiManager.showFieldError(dateInput, 'Please enter a valid date of birth');
                }
            } else {
                this.uiManager.clearFieldError(dateInput);
            }
        }
    }

    /**
     * Auto-capitalize name field
     */
    capitalizeNameField(event) {
        const field = event.target;
        const cursorPosition = field.selectionStart;
        const originalValue = field.value;
        
        const capitalizedValue = Validators.capitalizeProperName(originalValue);
        
        if (originalValue !== capitalizedValue) {
            field.value = capitalizedValue;
            const newCursorPosition = Math.min(cursorPosition, capitalizedValue.length);
            field.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    }
}
