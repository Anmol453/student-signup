/**
 * Main Application Module
 * Orchestrates all modules and handles application flow
 */

import { UIManager } from './uiManager.js';
import { AvatarUploadHandler } from './avatarUploadHandler.js';
import { FormValidator } from './formValidator.js';
import { StudentRepository } from './studentRepository.js';

export class StudentRegistrationApp {
    constructor() {
        // Initialize modules
        this.uiManager = new UIManager();
        this.avatarHandler = new AvatarUploadHandler(this.uiManager);
        this.formValidator = new FormValidator(this.uiManager, this.avatarHandler);
        this.studentRepository = new StudentRepository();
        
        // Initialize event listeners
        this.initializeEventListeners();
        this.updateStudentCount();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Form submission
        this.uiManager.elements.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmission();
        });

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.handleCancelForm();
            });
        }

        // Avatar upload
        this.uiManager.elements.uploadBtn.addEventListener('click', () => {
            this.uiManager.elements.avatarUpload.click();
        });

        this.uiManager.elements.avatarUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            this.avatarHandler.handleUpload(file);
        });

        // Phone number validation
        const phoneInput = document.getElementById('phoneNumber');
        phoneInput.addEventListener('input', () => {
            this.formValidator.validatePhoneNumber('phoneNumber');
        });

        // Alternate phone validation
        const altPhoneInput = document.getElementById('alternatePhone');
        altPhoneInput.addEventListener('input', () => {
            this.formValidator.validatePhoneNumber('alternatePhone');
        });

        // Email validation
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('blur', () => {
            this.formValidator.validateEmail();
        });

        // Error popup OK button
        if (this.uiManager.elements.errorOkButton) {
            this.uiManager.elements.errorOkButton.addEventListener('click', () => {
                this.uiManager.hideErrorPopup();
            });
        }

        // Cancel popup buttons
        const cancelYesButton = document.getElementById('cancelYesButton');
        const cancelNoButton = document.getElementById('cancelNoButton');
        
        if (cancelYesButton) {
            cancelYesButton.addEventListener('click', () => {
                this.uiManager.hideCancelPopup();
                this.resetForm();
            });
        }
        
        if (cancelNoButton) {
            cancelNoButton.addEventListener('click', () => {
                this.uiManager.hideCancelPopup();
            });
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission() {
        if (!this.formValidator.validate()) {
            this.uiManager.shakeForm();
            return;
        }

        const formData = this.collectFormData();
        const avatarUrl = this.avatarHandler.getValidationState().avatarUrl;
        
        const studentData = StudentRepository.createStudentData(formData, avatarUrl);
        
        try {
            // Show loading state
            this.uiManager.showSubmitLoading();
            
            // Save to database via API
            await this.studentRepository.add(studentData);
            
            // Hide loading and show success
            this.uiManager.hideSubmitLoading();
            this.uiManager.showSuccessPopup();
            
            // Reset form and update count
            this.resetForm();
            await this.updateStudentCount();
            
        } catch (error) {
            console.error('Registration error:', error);
            this.uiManager.hideSubmitLoading();
            // Display the actual error message from the server
            const errorMessage = error.message || 'Failed to register student. Please try again.';
            this.uiManager.showErrorPopup(errorMessage);
        }
    }

    /**
     * Handle cancel form - clear all entries
     */
    handleCancelForm() {
        this.uiManager.showCancelPopup();
    }

    /**
     * Collect form data
     */
    collectFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            company: document.getElementById('company').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            alternatePhone: document.getElementById('alternatePhone').value.trim(),
            email: document.getElementById('email').value.trim()
        };
    }

    /**
     * Reset form
     */
    resetForm() {
        this.uiManager.resetForm();
        this.avatarHandler.reset();
    }

    /**
     * Update student count display
     */
    async updateStudentCount() {
        try {
            const count = await this.studentRepository.getCount();
            this.uiManager.updateStudentCount(count);
        } catch (error) {
            console.error('Error updating count:', error);
        }
    }

    /**
     * Public API methods
     */
    async getAllStudents() {
        return await this.studentRepository.getAll();
    }

    async searchStudents(term) {
        return await this.studentRepository.searchByName(term);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.studentRegistration = new StudentRegistrationApp();
});

// Expose utility functions for debugging
window.getStudents = () => window.studentRegistration?.getAllStudents() || [];
window.searchStudents = (term) => window.studentRegistration?.searchStudents(term) || [];
