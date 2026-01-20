export class LandingUIManager {
    constructor() {
        this.studentsTable = document.getElementById('studentsTable');
        this.studentsTableBody = document.getElementById('studentsTableBody');
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
        this.studentsTable.style.display = 'block';
    }

    hideAllStates() {
        this.loadingState.style.display = 'none';
        this.emptyState.style.display = 'none';
        this.errorState.style.display = 'none';
        this.studentsTable.style.display = 'none';
    }

    renderStudents(students) {
        if (!students || students.length === 0) {
            this.showEmpty();
            return;
        }

        this.studentsTableBody.innerHTML = '';
        
        students.forEach(student => {
            const row = this.createStudentRow(student);
            this.studentsTableBody.appendChild(row);
        });

        this.showStudents();
    }

    createStudentRow(student) {
        const row = document.createElement('tr');
        row.className = 'student-row';

        const fullName = student.full_name || '-';
        const company = student.company || '-';
        const phoneNumber = student.phone_number || '-';
        const alternatePhone = student.alternate_phone || '-';
        const email = student.email || '-';
        const studentId = student.id;

        row.innerHTML = `
            <td class="student-name-cell">${fullName}</td>
            <td>${company}</td>
            <td>${phoneNumber}</td>
            <td>${alternatePhone}</td>
            <td class="email-cell">${email}</td>
            <td class="action-cell">
                <a href="#" class="view-card-link" data-student-id="${studentId}">Open Student Card</a>
            </td>
        `;

        // Add event listener for the link
        const link = row.querySelector('.view-card-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this.openStudentCard(student);
        });

        return row;
    }

    openStudentCard(student) {
        // Store student data in sessionStorage
        sessionStorage.setItem('selectedStudent', JSON.stringify(student));
        // Navigate to student card page
        window.location.href = 'student-card.html';
    }

    formatPhoneNumber(phone) {
        if (!phone) return '';
        return phone;
    }

    getDefaultAvatar() {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23e1e5e9'/%3E%3Cpath d='M75 70c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 10c-15 0-45 7.5-45 22.5V115h90v-12.5c0-15-30-22.5-45-22.5z' fill='%23999'/%3E%3C/svg%3E`;
    }
}
