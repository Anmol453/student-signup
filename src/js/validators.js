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
     * Validate email address
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
}
