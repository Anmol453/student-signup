/**
 * Validation Module
 * Handles all form field validation logic
 */

export class Validators {
    /**
     * Enhanced phone number validation
     * Checks format, length, and realistic number patterns
     */
    static isValidPhoneNumber(phoneNumber) {
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        
        if (!/^\d{10}$/.test(cleanPhone)) {
            return false;
        }
        
        const invalidPatterns = [
            /^(\d)\1{9}$/,
            /^1234567890$/,
            /^0987654321$/,
            /^0123456789$/,
            /^(\d{2})\1{4}$/,
            /^(\d)\1{6,}/,
            /^(\d)(\d)(?:\1\2){4}$/,
            /^9999999999$/,
            /^1231231234$/,
        ];
        
        for (let pattern of invalidPatterns) {
            if (pattern.test(cleanPhone)) {
                return false;
            }
        }
        
        if (cleanPhone.startsWith('000') || 
            cleanPhone.startsWith('111') ||
            cleanPhone === '1111111111' ||
            cleanPhone === '2222222222') {
            return false;
        }
        
        return true;
    }

    /**
     * Validate date of birth for age requirements
     */
    static isValidDateOfBirth(dateOfBirth) {
        // Parse date string (YYYY-MM-DD format from date input)
        const [year, month, day] = dateOfBirth.split('-').map(Number);
        const birthDate = new Date(year, month - 1, day); // month is 0-indexed
        
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        
        // Check if date is in valid range
        if (birthDate > today || birthDate < minDate) {
            return false;
        }
        
        // Check if age is at least 10
        const age = this.calculateAge(birthDate);
        return age >= 10;
    }

    /**
     * Calculate exact age from birth date
     */
    static calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Validate image file
     */
    static isValidImageFile(file) {
        if (!file.type.startsWith('image/')) {
            return { valid: false, error: 'Please upload a valid image file (JPG, PNG, etc.)' };
        }

        if (file.size > 5 * 1024 * 1024) {
            return { valid: false, error: 'Image file is too large. Please upload an image smaller than 5MB.' };
        }

        return { valid: true };
    }

    /**
     * Properly capitalize a name string
     */
    static capitalizeProperName(name) {
        if (!name || typeof name !== 'string') {
            return '';
        }
        
        const trimmedName = name.trim().toLowerCase();
        
        if (trimmedName.length === 0) {
            return '';
        }
        
        return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
    }
}
