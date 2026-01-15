/**
 * Student Repository Module
 * Handles student data storage via API
 */

export class StudentRepository {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api/students';
        this.students = []; // Cache for local display
    }

    /**
     * Add a new student via API
     */
    async add(studentData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to register student');
            }

            const result = await response.json();
            console.log('Student registered in database:', result.data);
            
            // Update local cache
            this.students.push(result.data);
            
            return result.data;
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    }

    /**
     * Get all students from API
     */
    async getAll() {
        try {
            const response = await fetch(this.apiUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const result = await response.json();
            this.students = result.data || [];
            
            return this.students;
        } catch (error) {
            console.error('Error fetching students:', error);
            return this.students; // Return cached data on error
        }
    }

    /**
     * Get student count from API
     */
    async getCount() {
        try {
            const response = await fetch(`${this.apiUrl}/count`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch count');
            }

            const result = await response.json();
            return result.count;
        } catch (error) {
            console.error('Error fetching count:', error);
            return this.students.length; // Return cached count on error
        }
    }

    /**
     * Search students by name via API
     */
    async searchByName(searchTerm) {
        try {
            const response = await fetch(`${this.apiUrl}/search/${encodeURIComponent(searchTerm)}`);
            
            if (!response.ok) {
                throw new Error('Failed to search students');
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error searching students:', error);
            // Fallback to local search
            const term = searchTerm.toLowerCase();
            return this.students.filter(student => 
                student.first_name.toLowerCase().includes(term) ||
                student.last_name.toLowerCase().includes(term) ||
                (student.middle_name && student.middle_name.toLowerCase().includes(term))
            );
        }
    }

    /**
     * Generate unique student ID
     */
    static generateId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `STU${timestamp}${random}`;
    }

    /**
     * Create student data object for API
     */
    static createStudentData(formData, avatarData) {
        return {
            id: this.generateId(),
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            phoneNumber: formData.phoneNumber,
            desiredCourse: formData.desiredCourse,
            avatarData: avatarData,
            registrationDate: new Date().toISOString()
        };
    }
}
