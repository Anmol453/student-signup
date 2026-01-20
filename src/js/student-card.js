// Load and display student card data
document.addEventListener('DOMContentLoaded', () => {
    const studentData = sessionStorage.getItem('selectedStudent');
    
    if (!studentData) {
        // If no student data, redirect back to landing page
        window.location.href = 'landing.html';
        return;
    }

    const student = JSON.parse(studentData);
    displayStudentCard(student);
});

function formatPhoneNumber(phone) {
    if (!phone || phone === '-' || phone === 'N/A') {
        return phone;
    }
    
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXX
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Return original if not 10 digits
    return phone;
}

function displayStudentCard(student) {
    const fullName = student.full_name || 'N/A';
    const company = student.company || 'N/A';
    const phoneNumber = formatPhoneNumber(student.phone_number);
    const alternatePhone = student.alternate_phone ? formatPhoneNumber(student.alternate_phone) : '';
    const email = student.email || 'N/A';
    const avatarUrl = student.avatar_data || getDefaultAvatar();

    // Update DOM elements
    document.getElementById('studentName').textContent = fullName;
    document.getElementById('studentCompany').textContent = company;
    document.getElementById('studentPhone').textContent = phoneNumber;
    document.getElementById('studentEmail').textContent = email;
    
    const avatarImg = document.getElementById('studentAvatar');
    avatarImg.src = avatarUrl;
    avatarImg.alt = fullName;
    avatarImg.onerror = function() {
        this.src = getDefaultAvatar();
    };

    // Handle alternate phone
    const alternatePhoneSection = document.getElementById('alternatePhoneSection');
    if (alternatePhone && alternatePhone !== '-') {
        alternatePhoneSection.innerHTML = `
            <span class="info-emoji">☎️</span>
            <span class="info-text phone-number">${alternatePhone}</span>
        `;
    }

    // Update page title
    document.title = `${fullName} - Student Card`;
}

function getDefaultAvatar() {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23e1e5e9'/%3E%3Cpath d='M75 70c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 10c-15 0-45 7.5-45 22.5V115h90v-12.5c0-15-30-22.5-45-22.5z' fill='%23999'/%3E%3C/svg%3E`;
}
