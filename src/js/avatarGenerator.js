/**
 * Avatar Generator Module
 * Generates intelligent DiceBear avatars based on facial characteristics
 */

export class AvatarGenerator {
    /**
     * Generate intelligent avatar based on facial characteristics
     */
    static generateIntelligentAvatar(characteristics) {
        console.log('=== generateIntelligentAvatar START ===');
        console.log('Input characteristics:', JSON.stringify(characteristics, null, 2));
        
        const { gender, age, skinTone, hasGlasses, faceShape } = characteristics;
        
        console.log('Extracted values:', { gender, age, skinTone, hasGlasses, faceShape });
        
        // Choose appropriate style based on gender
        const style = gender === 'female' ? 'lorelei' : 'micah';
        console.log('Selected style:', style);
        
        // Create a simple seed
        const seed = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        console.log('Generated seed:', seed);
        
        // Build avatar URL with simpler parameters
        const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=200&radius=50`;
        
        console.log('=== FINAL AVATAR URL ===');
        console.log(url);
        console.log('=== generateIntelligentAvatar END ===');
        
        return url;
    }

    /**
     * Create a consistent seed based on characteristics
     */
    static createCharacteristicSeed(characteristics) {
        const { gender, age, skinTone, hasGlasses, faceShape } = characteristics;
        return `${gender}-${age}-${skinTone}-${hasGlasses}-${faceShape}-${Date.now()}`;
    }

    /**
     * Select hair style based on age and gender
     */
    static selectHairStyle(age, gender) {
        if (gender === 'female') {
            if (age < 25) {
                return 'variant01,variant02,variant03,variant04';
            } else if (age < 40) {
                return 'variant05,variant06,variant07,variant08';
            } else {
                return 'variant09,variant10,variant11,variant12';
            }
        } else {
            if (age < 25) {
                return 'variant01,variant02,variant03,variant04';
            } else if (age < 40) {
                return 'variant05,variant06,variant07,variant08';
            } else {
                return 'variant09,variant10,variant11,variant12';
            }
        }
    }

    /**
     * Select hair color based on age
     */
    static selectHairColor(age) {
        if (age < 30) {
            return '0e0e0e,3c3c3c,4a312c,2c1b18,b58143,d6b370';
        } else if (age < 50) {
            return '4a312c,2c1b18,3c3c3c,5d5d5d';
        } else {
            return '929598,e8e8e8,afafaf';
        }
    }

    /**
     * Select eye style based on glasses
     */
    static selectEyeStyle(hasGlasses) {
        if (hasGlasses) {
            return 'variant01,variant02,variant03';
        }
        return 'variant01,variant02,variant03,variant04,variant05';
    }

    /**
     * Select mouth style based on age
     */
    static selectMouthStyle(age) {
        if (age < 25) {
            return 'variant01,variant02,variant03,variant04';
        } else if (age < 40) {
            return 'variant05,variant06,variant07,variant08';
        } else {
            return 'variant09,variant10,variant11,variant12';
        }
    }

    /**
     * Select nose style based on face shape
     */
    static selectNoseStyle(faceShape) {
        switch (faceShape) {
            case 'round':
                return 'variant01,variant02';
            case 'oval':
                return 'variant03,variant04';
            case 'heart':
                return 'variant05,variant06';
            case 'long':
                return 'variant07,variant08';
            default:
                return 'variant01,variant02,variant03,variant04';
        }
    }

    /**
     * Select facial hair based on age (for male avatars)
     */
    static selectFacialHair(age) {
        if (age < 20) {
            return 'variant01'; // Clean shaven
        } else if (age < 35) {
            return 'variant01,variant02,variant03,variant04'; // Mix
        } else {
            return 'variant02,variant03,variant04,variant05'; // More facial hair
        }
    }

    /**
     * Map skin tone to DiceBear color values
     */
    static mapSkinToneToColor(skinTone) {
        const skinToneMap = {
            'light': 'ffdbb4,edb98a,fd9841',
            'medium-light': 'd08b5b,ae5d29,8d5524',
            'medium': 'ae5d29,8d5524,614335',
            'medium-dark': '614335,4a312c,2c1b18',
            'dark': '4a312c,2c1b18,0e0e0e'
        };
        
        return skinToneMap[skinTone] || skinToneMap['medium'];
    }

    /**
     * Generate fallback avatar (when facial analysis fails)
     */
    static generateFallbackAvatar() {
        console.log('=== generateFallbackAvatar START ===');
        
        const seed = `fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const style = Math.random() > 0.5 ? 'lorelei' : 'micah';
        
        console.log('Fallback seed:', seed);
        console.log('Fallback style:', style);
        
        const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=200&radius=50`;
        
        console.log('=== FALLBACK AVATAR URL ===');
        console.log(url);
        console.log('=== generateFallbackAvatar END ===');
        
        return url;
    }

    /**
     * Get available avatar styles
     */
    static getAvailableStyles() {
        return [
            { value: 'lorelei', label: 'Lorelei', description: 'Professional female style' },
            { value: 'micah', label: 'Micah', description: 'Professional male style' }
        ];
    }
}
