export class LandingUIManager {
    constructor() {
        this.studentsGrid = document.getElementById('studentsGrid');
        this.loadingState = document.getElementById('loadingState');
        this.emptyState = document.getElementById('emptyState');
        this.errorState = document.getElementById('errorState');
        this.errorMessage = document.getElementById('errorMessage');
    }

    showLoading() {
        this.hideAllStates();
        this.loadingState.style.display = 'block';
    }

    showEmpty() {
        this.hideAllStates();
        this.emptyState.style.display = 'block';
    }

    showError(message = 'Failed to load students. Please try again.') {
        this.hideAllStates();
        this.errorMessage.textContent = message;
        this.errorState.style.display = 'block';
    }

    showStudents() {
        this.hideAllStates();
        this.studentsGrid.style.display = 'grid';
    }

    hideAllStates() {
        this.loadingState.style.display = 'none';
        this.emptyState.style.display = 'none';
        this.errorState.style.display = 'none';
        this.studentsGrid.style.display = 'none';
    }

    renderStudents(students) {
        if (!students || students.length === 0) {
            this.showEmpty();
            return;
        }

        this.studentsGrid.innerHTML = '';
        
        students.forEach(student => {
            const card = this.createStudentCard(student);
            this.studentsGrid.appendChild(card);
        });

        this.showStudents();
    }

    createStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'student-card';

        const fullName = this.getFullName(student);
        const formattedPhone = this.formatPhoneNumber(student.phone_number);
        const avatarUrl = student.avatar_data || this.getDefaultAvatar();
        const formattedDate = this.formatDate(student.date_of_birth);

        card.innerHTML = `
            <div class="card-header">
                <div class="avatar-container">
                    <img src="${avatarUrl}" alt="${fullName}" class="avatar" onerror="this.src='${this.getDefaultAvatar()}'">
                </div>
                <div class="student-info">
                    <h2 class="student-name">${fullName}</h2>
                    
                    <div class="info-row">
                        <div class="info-item">
                            <div class="info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                            </div>
                            <span class="info-text">${student.desired_course}</span>
                        </div>
                    </div>
                    
                    <div class="info-row">
                        <div class="info-item">
                            <div class="info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                            </div>
                            <span class="info-text">${formattedPhone}</span>
                        </div>
                        
                        <div class="phone-divider"></div>
                        
                        <div class="info-item">
                            <div class="info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                            </div>
                            <span class="info-text">${formattedDate}</span>
                        </div>
                    </div>
                    
                    <div class="info-row">
                        <div class="info-item">
                            <div class="info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                </svg>
                            </div>
                            <span class="info-text">ID: ${student.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    getFullName(student) {
        const parts = [
            student.first_name,
            student.middle_name,
            student.last_name
        ].filter(Boolean);
        
        return parts.join(' ');
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatPhoneNumber(phone) {
        if (!phone) return '';
        return phone;
    }

    calculateAge(dateOfBirth) {
        if (!dateOfBirth) return 0;

        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    getDefaultAvatar() {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23e1e5e9'/%3E%3Cpath d='M75 70c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 10c-15 0-45 7.5-45 22.5V115h90v-12.5c0-15-30-22.5-45-22.5z' fill='%23999'/%3E%3C/svg%3E`;
    }
}
