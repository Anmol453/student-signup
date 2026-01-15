/**
 * Avatar Upload Handler Module
 * Orchestrates avatar upload, validation, and generation
 */

import { Validators } from './validators.js';
import { FaceDetection } from './faceDetection.js';
import { AvatarGenerator } from './avatarGenerator.js';

export class AvatarUploadHandler {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.faceDetection = new FaceDetection();
        this.isValid = false;
        this.avatarUrl = null;
    }

    /**
     * Handle avatar file upload
     */
    async handleUpload(file) {
        if (!file) {
            return;
        }

        this.uiManager.updateFileName(file.name);
        this.uiManager.hideAvatarError();
        this.uiManager.hideAvatarPreview();

        // Validate file
        const fileValidation = Validators.isValidImageFile(file);
        if (!fileValidation.valid) {
            this.uiManager.showAvatarError(fileValidation.error);
            this.isValid = false;
            return;
        }

        // Show loading state
        this.uiManager.showAvatarLoading();

        try {
            // Detect face in image
            await this.detectAndValidateFace(file);
        } catch (error) {
            console.error('Avatar upload error:', error);
            this.uiManager.hideAvatarLoading();
            this.uiManager.showAvatarError('Error processing image. Please try another photo.');
            this.isValid = false;
        }
    }

    /**
     * Detect and validate face in uploaded image
     */
    async detectAndValidateFace(file) {
        let img;
        try {
            // Create image element
            img = await FaceDetection.createImageFromFile(file);
            
            console.log('Image loaded, starting facial analysis...');
            
            // Detect faces with full facial analysis
            const detections = await this.faceDetection.detectFacesWithAnalysis(img);
            
            console.log('Face detections with analysis:', detections);

            // Hide loading
            this.uiManager.hideAvatarLoading();

            // Validate detections
            const validation = this.faceDetection.validateDetections(detections);
            
            if (!validation.valid) {
                this.uiManager.showAvatarError(validation.error);
                this.isValid = false;
                return;
            }

            // Show warning if present but still allow
            if (validation.warning) {
                console.warn('Face detection warning:', validation.message);
                this.uiManager.showAvatarWarning(validation.message);
            }

            // Analyze facial characteristics if detection successful
            let characteristics = null;
            if (detections && detections.length > 0) {
                // Check if we have gender/age data
                if (detections[0].gender) {
                    characteristics = this.faceDetection.analyzeFacialCharacteristics(detections[0], img);
                    console.log('Analyzed characteristics:', characteristics);
                } else {
                    console.warn('No gender/age data available, using fallback avatar');
                }
            }

            // Face detected successfully - generate intelligent avatar
            console.log('Face validation passed! Generating avatar...');
            this.isValid = true;
            await this.generateAvatar(file, characteristics);

        } catch (error) {
            console.error('Face detection error:', error);
            this.uiManager.hideAvatarLoading();
            
            // Use fallback validation instead of rejecting
            console.log('Using fallback validation...');
            
            try {
                // Try to create image if not already created
                if (!img) {
                    img = await FaceDetection.createImageFromFile(file);
                }
                
                const fallbackResult = await this.faceDetection.fallbackValidation(img);
                
                if (fallbackResult.valid) {
                    if (fallbackResult.warning) {
                        this.uiManager.showAvatarWarning(fallbackResult.message);
                    }
                    this.isValid = true;
                    // Generate fallback avatar without characteristics
                    console.log('Generating fallback avatar...');
                    await this.generateAvatar(file, null);
                } else {
                    this.uiManager.showAvatarError(fallbackResult.error);
                    this.isValid = false;
                }
            } catch (fallbackError) {
                console.error('Fallback validation error:', fallbackError);
                // If everything fails, still allow with strong warning
                this.uiManager.showAvatarWarning('Could not verify face. Proceeding with upload.');
                this.isValid = true;
                console.log('Generating emergency fallback avatar...');
                await this.generateAvatar(file, null);
            }
        }
    }

    /**
     * Generate and display avatar based on facial characteristics
     */
    async generateAvatar(file, characteristics) {
        try {
            console.log('generateAvatar called with characteristics:', characteristics);
            
            let avatarUrl;
            if (characteristics) {
                // Generate intelligent avatar based on facial analysis
                avatarUrl = AvatarGenerator.generateIntelligentAvatar(characteristics);
                console.log('Intelligent avatar URL generated:', avatarUrl);
            } else {
                // Generate fallback avatar
                avatarUrl = AvatarGenerator.generateFallbackAvatar();
                console.log('Fallback avatar URL generated:', avatarUrl);
            }
            
            if (!avatarUrl) {
                throw new Error('Avatar URL is null or undefined');
            }
            
            // Convert avatar URL to blob
            this.avatarUrl = await this.convertAvatarToBlob(avatarUrl);
            console.log('Avatar converted to blob, size:', this.avatarUrl.length);
            
            console.log('Showing avatar preview with URL:', avatarUrl);
            this.uiManager.showAvatarPreview(avatarUrl);
            console.log('Avatar preview should now be visible');
            
        } catch (error) {
            console.error('Avatar generation error:', error);
            this.uiManager.showAvatarError('Failed to generate avatar. Please try again.');
            this.isValid = false;
        }
    }

    /**
     * Convert avatar URL to base64 blob data
     */
    async convertAvatarToBlob(avatarUrl) {
        try {
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting avatar to blob:', error);
            throw error;
        }
    }

    /**
     * Reset avatar state
     */
    reset() {
        this.isValid = false;
        this.avatarUrl = null;
    }

    /**
     * Get validation state
     */
    getValidationState() {
        return {
            isValid: this.isValid,
            avatarUrl: this.avatarUrl
        };
    }
}
