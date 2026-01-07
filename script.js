/**
 * Handles form submission, validation, and student data storage
 * Features: Age validation (15+), phone number validation, real-time feedback
 */

class StudentRegistration {
    constructor() {
        // Array to store all registered students
        this.students = [];
        
        // DOM element references for efficient access
        this.studentCountElement = document.getElementById('studentCount');
        this.form = document.getElementById('studentForm');
        this.successMessage = document.getElementById('successMessage');
        this.successPopup = document.getElementById('successPopup');
        
        // Debug: Check if popup element exists
        console.log('Success popup element:', this.successPopup);
        
        // Initialize the application
        this.initializeEventListeners();
        this.updateStudentCount();
    }

    // Set up all event listeners for form interactions //
    
    initializeEventListeners() {
        // Handle form submission with validation
        this.form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            this.handleFormSubmission();
        });

        // Real-time phone number validation and formatting
        const phoneInput = document.getElementById('phoneNumber');
        phoneInput.addEventListener('input', this.validatePhoneNumber.bind(this));

        // Date of birth validation for age requirements
        const dateInput = document.getElementById('dateOfBirth');
        dateInput.addEventListener('change', this.validateDateOfBirth.bind(this));

        // Auto-capitalize name fields as user types
        const nameFields = ['firstName', 'middleName', 'lastName'];
        nameFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('input', this.capitalizeNameField.bind(this));
            field.addEventListener('blur', this.capitalizeNameField.bind(this));
        });
    }

    // Main form submission handler//
    handleFormSubmission() {
        // Only proceed if all validation passes
        if (!this.validateForm()) {
            // Add shake animation to form on validation failure
            this.form.classList.add('form-shake');
            setTimeout(() => {
                this.form.classList.remove('form-shake');
            }, 400);
            return;
        }

        // Collect and process form data
        const studentData = this.collectFormData();
        this.registerStudent(studentData);
        
        // Show success feedback and reset form
        this.showSuccessPopup();
        this.resetForm();
        this.updateStudentCount();
    }

    /**
     * Comprehensive for validation
     * @returns {boolean} True if all validation passes, false otherwise
     */
    validateForm() {
        // List of required form fields
        const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'desiredCourse'];
        let isValid = true;

        // Validate each required field
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Enhanced phone number validation
        const phoneField = document.getElementById('phoneNumber');
        if (phoneField.value && !this.isValidPhoneNumber(phoneField.value)) {
            this.showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }

        // Age validation - must be at least 15 years old
        const dateField = document.getElementById('dateOfBirth');
        if (dateField.value) {
            const birthDate = new Date(dateField.value);
            const age = this.calculateAge(birthDate);
            
            if (!this.isValidDateOfBirth(dateField.value)) {
                if (age < 10) {
                    // Show alert for age requirement
                    alert('Student must be at least 10 years old to register for courses.');
                    this.showFieldError(dateField, 'Student must be at least 10 years old');
                } else {
                    this.showFieldError(dateField, 'Please enter a valid date of birth');
                }
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Collect all form data into a structured student object
     * @returns {Object} Complete student data object
     */
    collectFormData() {
        return {
            id: this.generateStudentId(),
            firstName: document.getElementById('firstName').value.trim(),
            middleName: document.getElementById('middleName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            dateOfBirth: document.getElementById('dateOfBirth').value,
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            desiredCourse: document.getElementById('desiredCourse').value,
            registrationDate: new Date().toISOString()
        };
    }

    /**
     * Add student to the internal storage array
     * Also logs registration for debugging purposes
     * @param {Object} studentData Complete student information
     */
    registerStudent(studentData) {
        this.students.push(studentData);
        console.log('Student registered:', studentData);
        console.log('Total students:', this.students.length);
    }

    /**
     * Generate unique student ID using timestamp and random number
     * Format: STU + timestamp + random3digits
     * @returns {string} Unique student identifier
     */
    generateStudentId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `STU${timestamp}${random}`;
    }

    /**
     * Enhanced phone number validation
     * Checks format, length, and realistic number patterns
     * Rejects common invalid patterns like all zeros, sequential numbers
     * @param {string} phoneNumber Phone number to validate
     * @returns {boolean} True if phone number is valid
     */
    isValidPhoneNumber(phoneNumber) {
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        
        // Must be exactly 10 digits
        if (!/^\d{10}$/.test(cleanPhone)) {
            return false;
        }
        
        // Array of invalid phone number patterns
       const invalidPatterns = [
              /^(\d)\1{9}$/,              // All digits same
              /^1234567890$/,             // Sequential
              /^0987654321$/,             // Reverse sequential
              /^0123456789$/,             // Sequential from 0
              /^(\d{2})\1{4}$/,            // Repeating pairs
              /^(\d)\1{6,}/,               // Too many repeated digits
              /^(\d)(\d)(?:\1\2){4}$/,     // Alternating digits
              /^9999999999$/,              // Common placeholder
              /^1231231234$/,              // Repeating blocks
              /^[0-5]\d{9}$/               // Invalid Indian mobile start
  
        ];
        
        // Check against all invalid patterns
        for (let pattern of invalidPatterns) {
            if (pattern.test(cleanPhone)) {
                return false;
            }
        }
        
        // Additional checks for common invalid prefixes
        if (cleanPhone.startsWith('000') || 
            cleanPhone.startsWith('111') ||
            cleanPhone === '1111111111' ||
            cleanPhone === '2222222222') {
            return false;
        }
        
        return true;
    }

    /**
     * Validate date of birth for age requirements and realistic dates
     * Must be at least 15 years old and not in the future
     * @param {string} dateOfBirth Date string to validate
     * @returns {boolean} True if date is valid and meets age requirement
     */
    isValidDateOfBirth(dateOfBirth) {
        const date = new Date(dateOfBirth);
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        
        // Date must not be in future or more than 100 years ago
        if (date > today || date < minDate) {
            return false;
        }
        
        // Must be at least 10 years old
        const age = this.calculateAge(date);
        return age >= 10;
    }

    /**
     * Calculate exact age from birth date
     * Considers year, month, and day for accurate calculation
     * @param {Date} birthDate Date of birth
     * @returns {number} Age in complete years
     */
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Real-time phone number validation and formatting
     * Limits input to 10 digits and shows validation feedback
     */
    validatePhoneNumber() {
        const phoneInput = document.getElementById('phoneNumber');
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        
        // Limit to 10 digits maximum
        if (phoneValue.length > 10) {
            phoneInput.value = phoneValue.substring(0, 10);
        }
        
        // Show validation feedback
        if (phoneInput.value && !this.isValidPhoneNumber(phoneInput.value)) {
            this.showFieldError(phoneInput, 'Please enter a valid phone number');
        } else {
            this.clearFieldError(phoneInput);
        }
    }

    /**
     * Real-time date of birth validation
     * Checks age requirement as user selects date
     */
    validateDateOfBirth() {
        const dateInput = document.getElementById('dateOfBirth');
        
        if (dateInput.value) {
            const birthDate = new Date(dateInput.value);
            const age = this.calculateAge(birthDate);
            
            // Show appropriate error message
            if (!this.isValidDateOfBirth(dateInput.value)) {
                if (age < 10) {
                    this.showFieldError(dateInput, 'Student must be at least 10 years old');
                } else {
                    this.showFieldError(dateInput, 'Please enter a valid date of birth');
                }
            } else {
                this.clearFieldError(dateInput);
            }
        }
    }

    /**
     * Auto-capitalize name fields (First letter uppercase, rest lowercase)
     * Handles cases like: john → John, DOE → Doe, mCdONALD → Mcdonald
     * @param {Event} event Input event from name field
     */
    capitalizeNameField(event) {
        const field = event.target;
        const cursorPosition = field.selectionStart;
        const originalValue = field.value;
        
        // Capitalize first letter, lowercase the rest
        const capitalizedValue = this.capitalizeProperName(originalValue);
        
        // Only update if the value actually changed to avoid cursor jumping
        if (originalValue !== capitalizedValue) {
            field.value = capitalizedValue;
            
            // Restore cursor position after formatting
            const newCursorPosition = Math.min(cursorPosition, capitalizedValue.length);
            field.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    }

    /**
     * Properly capitalize a name string
     * Examples: john → John, DOE → Doe, mary-jane → Mary-jane, o'connor → O'connor
     * @param {string} name Name string to capitalize
     * @returns {string} Properly capitalized name
     */
    capitalizeProperName(name) {
        if (!name || typeof name !== 'string') {
            return '';
        }
        
        // Trim whitespace and convert to lowercase
        const trimmedName = name.trim().toLowerCase();
        
        if (trimmedName.length === 0) {
            return '';
        }
        
        // Capitalize first letter and keep rest lowercase
        return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
    }

    /**
     * Display error message below form field
     * Creates and styles error element dynamically
     * @param {HTMLElement} field Form field with error
     * @param {string} message Error message to display
     */
    showFieldError(field, message) {
        // Clear any existing error first
        this.clearFieldError(field);
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        
        // Add error to DOM and style field
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#dc3545';
    }

    /**
     * Remove error message and reset field styling
     * @param {HTMLElement} field Form field to clear error from
     */
    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '#e1e5e9';
    }

    /**
     * Show success popup modal for 3 seconds
     * Temporarily disables form to prevent duplicate submissions
     */
    showSuccessPopup() {
        // Disable form during popup display
        this.form.style.pointerEvents = 'none';
        this.form.style.opacity = '0.7';
        
        console.log('Showing success popup...'); // Debug log
        console.log('Popup element:', this.successPopup); // Debug log
        
        // Show popup modal - SIMPLE VERSION
        if (this.successPopup) {
            this.successPopup.classList.remove('hidden');
            console.log('Popup should now be visible'); // Debug log
            console.log('Popup classes after show:', this.successPopup.className); // Debug log
        } else {
            console.error('Success popup element not found!');
        }
        
        // Auto-hide after 3 seconds and re-enable form
        setTimeout(() => {
            console.log('Hiding popup...'); // Debug log
            if (this.successPopup) {
                this.successPopup.classList.add('hidden');
            }
            this.form.style.pointerEvents = 'auto';
            this.form.style.opacity = '1';
        }, 3000);
    }

    /**
     * Legacy success message method (kept for compatibility)
     * Shows inline success message for 3 seconds
     */
    showSuccessMessage() {
        this.successMessage.classList.remove('hidden');
        
        // Trigger fade-in animation
        setTimeout(() => {
            this.successMessage.classList.add('show');
        }, 10);
        
        // Start fade-out after 2.5 seconds, then hide
        setTimeout(() => {
            this.successMessage.classList.add('fade-out');
            this.successMessage.classList.remove('show');
            
            setTimeout(() => {
                this.successMessage.classList.add('hidden');
                this.successMessage.classList.remove('fade-out');
            }, 400);
        }, 2500);
    }

    /**
     * Reset form to initial state after successful submission
     * Clears all fields, error messages, and styling
     */
    resetForm() {
        // Reset all form fields
        this.form.reset();
        
        // Remove all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        // Reset field border colors
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '#e1e5e9';
        });
    }

    /**
     * Update the student count display in header
     * Shows current number of registered students
     */
    updateStudentCount() {
        const previousCount = parseInt(this.studentCountElement.textContent) || 0;
        const newCount = this.students.length;
        
        this.studentCountElement.textContent = newCount;
        
        // Add pop animation only when count increases
        if (newCount > previousCount) {
            this.studentCountElement.classList.add('counter-pop');
            setTimeout(() => {
                this.studentCountElement.classList.remove('counter-pop');
            }, 500);
        }
    }

    /**
     * Get copy of all registered students
     * Used for debugging and potential future features
     * @returns {Array} Array of all student objects
     */
    getAllStudents() {
        return [...this.students];
    }

    /**
     * Search students by name (first, middle, or last)
     * Case-insensitive search across all name fields
     * @param {string} searchTerm Search query
     * @returns {Array} Filtered array of matching students
     */
    searchStudents(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.students.filter(student => 
            student.firstName.toLowerCase().includes(term) ||
            student.lastName.toLowerCase().includes(term) ||
            (student.middleName && student.middleName.toLowerCase().includes(term))
        );
    }
}

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studentRegistration = new StudentRegistration();
});

// Expose utility functions to global scope for debugging and testing
window.getStudents = () => window.studentRegistration?.getAllStudents() || [];
window.searchStudents = (term) => window.studentRegistration?.searchStudents(term) || [];