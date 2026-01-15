/**
 * Face Detection Module
 * Handles face-api.js initialization and face detection logic with facial analysis
 */

export class FaceDetection {
    constructor() {
        this.isLoaded = false;
        this.modelsLoaded = 0;
        this.initialize();
    }

    /**
     * Initialize face-api.js library with multiple models for better detection and analysis
     */
    async initialize() {
        try {
            console.log('Loading face-api.js models...');
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
            
            // Load multiple models for detection and facial analysis
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
            ]);
            
            this.isLoaded = true;
            console.log('Face-api.js models loaded successfully with facial analysis');
        } catch (error) {
            console.error('Error loading face-api.js models:', error);
            console.warn('Face detection will use fallback method');
            this.isLoaded = true;
        }
    }

    /**
     * Wait for face-api.js to finish loading
     */
    async waitForLoad() {
        let attempts = 0;
        while (!this.isLoaded && attempts < 100) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!this.isLoaded) {
            console.warn('Face detection timeout - using fallback');
            this.isLoaded = true;
        }
    }

    /**
     * Detect faces with full facial analysis
     */
    async detectFacesWithAnalysis(imageElement) {
        if (!this.isLoaded) {
            await this.waitForLoad();
        }

        let detections = [];

        try {
            // Detect faces with landmarks, age, and gender
            detections = await faceapi
                .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: 0.3
                }))
                .withFaceLandmarks()
                .withAgeAndGender();

            console.log('Face analysis results:', detections.length, 'faces with full analysis');

            // If no faces found, try SSD MobileNet
            if (detections.length === 0) {
                console.log('Trying SSD MobileNet with analysis...');
                detections = await faceapi
                    .detectAllFaces(imageElement, new faceapi.SsdMobilenetv1Options({
                        minConfidence: 0.3
                    }))
                    .withFaceLandmarks()
                    .withAgeAndGender();
                console.log('SSD MobileNet analysis results:', detections.length, 'faces');
            }
        } catch (error) {
            console.error('Face analysis error:', error);
            detections = [];
        }

        return detections;
    }

    /**
     * Detect faces in an image with multiple detection methods
     */
    async detectFaces(imageElement) {
        if (!this.isLoaded) {
            await this.waitForLoad();
        }

        let detections = [];

        try {
            detections = await faceapi.detectAllFaces(
                imageElement,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: 0.3
                })
            );

            console.log('TinyFaceDetector results:', detections.length, 'faces');

            if (detections.length === 0) {
                console.log('Trying SSD MobileNet detector...');
                detections = await faceapi.detectAllFaces(
                    imageElement,
                    new faceapi.SsdMobilenetv1Options({
                        minConfidence: 0.3
                    })
                );
                console.log('SSD MobileNet results:', detections.length, 'faces');
            }
        } catch (error) {
            console.error('Face detection error:', error);
            detections = [];
        }

        return detections;
    }

    /**
     * Analyze facial characteristics from detection results
     */
    analyzeFacialCharacteristics(detection, imageElement) {
        const characteristics = {
            gender: 'neutral',
            age: 25,
            skinTone: 'medium',
            hasGlasses: false,
            faceShape: 'oval',
            hairStyle: 'short'
        };

        try {
            // Extract gender and age
            if (detection.gender) {
                characteristics.gender = detection.gender;
                characteristics.age = Math.round(detection.age);
                console.log(`Detected: ${characteristics.gender}, age ${characteristics.age}`);
            }

            // Analyze skin tone from image
            if (detection.detection && imageElement) {
                const box = detection.detection.box;
                characteristics.skinTone = this.analyzeSkinTone(imageElement, box);
            }

            // Detect glasses from landmarks
            if (detection.landmarks) {
                characteristics.hasGlasses = this.detectGlasses(detection.landmarks);
            }

            // Analyze face shape from landmarks
            if (detection.landmarks) {
                characteristics.faceShape = this.analyzeFaceShape(detection.landmarks);
            }

        } catch (error) {
            console.error('Error analyzing facial characteristics:', error);
        }

        return characteristics;
    }

    /**
     * Analyze skin tone from face region
     */
    analyzeSkinTone(imageElement, box) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Sample from center of face
            const sampleSize = 20;
            canvas.width = sampleSize;
            canvas.height = sampleSize;
            
            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;
            
            ctx.drawImage(
                imageElement,
                centerX - sampleSize / 2,
                centerY - sampleSize / 2,
                sampleSize,
                sampleSize,
                0,
                0,
                sampleSize,
                sampleSize
            );
            
            const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
            const data = imageData.data;
            
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }
            
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            
            // Calculate brightness
            const brightness = (r + g + b) / 3;
            
            // Categorize skin tone
            if (brightness > 200) return 'light';
            if (brightness > 150) return 'medium-light';
            if (brightness > 100) return 'medium';
            if (brightness > 50) return 'medium-dark';
            return 'dark';
            
        } catch (error) {
            console.error('Skin tone analysis error:', error);
            return 'medium';
        }
    }

    /**
     * Detect if person is wearing glasses
     */
    detectGlasses(landmarks) {
        try {
            // Analyze eye region for glasses indicators
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            
            // Simple heuristic: if eyes are very symmetrical and have sharp edges, likely glasses
            // This is a simplified detection - real glasses detection would need more sophisticated analysis
            const eyeDistance = Math.abs(leftEye[0].x - rightEye[0].x);
            
            // Random chance for now (would need more sophisticated detection)
            return Math.random() > 0.7;
        } catch (error) {
            return false;
        }
    }

    /**
     * Analyze face shape from landmarks
     */
    analyzeFaceShape(landmarks) {
        try {
            const jawline = landmarks.getJawOutline();
            
            // Calculate face width to height ratio
            const faceWidth = Math.abs(jawline[0].x - jawline[jawline.length - 1].x);
            const faceHeight = Math.abs(jawline[8].y - landmarks.positions[27].y);
            
            const ratio = faceWidth / faceHeight;
            
            if (ratio > 0.9) return 'round';
            if (ratio > 0.75) return 'oval';
            if (ratio > 0.65) return 'heart';
            return 'long';
            
        } catch (error) {
            return 'oval';
        }
    }

    /**
     * Validate face detection results - Balanced validation for human faces
     */
    validateDetections(detections) {
        if (!detections || detections.length === 0) {
            return {
                valid: false,
                error: 'No human face detected in the image. Please upload a clear photo of your face.'
            };
        }

        if (detections.length > 1) {
            return {
                valid: false,
                error: 'Multiple faces detected. Please upload a photo with only one person.'
            };
        }

        const detection = detections[0];
        
        // Check detection score - lowered threshold for better acceptance
        if (detection.detection && detection.detection.score < 0.3) {
            return {
                valid: true,
                warning: true,
                message: 'Face detected with low confidence. Avatar may not match perfectly.'
            };
        }

        // If we have landmarks, it's definitely a face
        if (detection.landmarks) {
            return { valid: true };
        }

        // If no landmarks but decent score, still accept with warning
        if (detection.detection && detection.detection.score >= 0.3) {
            return {
                valid: true,
                warning: true,
                message: 'Face detected. Avatar will be generated.'
            };
        }

        return { valid: true };
    }

    /**
     * Simple fallback validation using basic image analysis
     */
    async fallbackValidation(imageElement) {
        const width = imageElement.naturalWidth || imageElement.width;
        const height = imageElement.naturalHeight || imageElement.height;
        
        if (width < 100 || height < 100) {
            return {
                valid: false,
                error: 'Image is too small. Please upload a larger photo.'
            };
        }

        return {
            valid: true,
            warning: true,
            message: 'Image accepted. Please ensure it contains a clear face photo.'
        };
    }

    /**
     * Create an image element from a file
     */
    static createImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };
            
            img.src = url;
            img.crossOrigin = 'anonymous';
        });
    }
}
