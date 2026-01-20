# Student Registration System

A complete student registration system with student directory, individual student cards, face detection, AI-generated avatars, and MySQL database integration.

## Features

- **Student Directory**: Table-based layout displaying all registered students with search and filtering
- **Individual Student Cards**: Dedicated page for each student with detailed information
- **Face Detection**: AI validates human faces before registration
- **Smart Avatars**: DiceBear avatars generated based on facial characteristics
- **MySQL Database**: Secure data storage with unique validation for emails and phone numbers
- **Real-time Validation**: Email uniqueness, phone number uniqueness, and image validation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Emoji Icons**: Modern emoji-based icons for better visual appeal

## Quick Start

### 1. Database Setup

```bash
cd signup-form/server
mysql -u root -p < database.sql
```

### 2. Configure Environment

Create `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_registration
DB_PORT=3306
PORT=3000
```

### 3. Start Backend

```bash
cd server
npm install
npm run dev
```

### 4. Start Frontend

Open `landing.html` with Live Server or any local web server.

### 5. Open Application

Navigate to: `http://localhost:5500/landing.html` (or your Live Server port)

## Project Structure

```
signup-form/
├── landing.html              # Student directory (main page)
├── student-card.html         # Individual student card page
├── index.html                # Registration form
├── src/
│   ├── css/
│   │   ├── landing.css      # Landing page styles
│   │   ├── student-card.css # Student card page styles
│   │   └── styles.css       # Registration form styles
│   └── js/
│       ├── landing.js       # Landing page controller
│       ├── landingUIManager.js # Landing page UI manager
│       ├── student-card.js  # Student card page controller
│       ├── app.js           # Registration form controller
│       ├── faceDetection.js # Face detection logic
│       ├── avatarGenerator.js # Avatar generation
│       ├── avatarUploadHandler.js
│       ├── formValidator.js
│       ├── validators.js
│       ├── studentRepository.js # API communication
│       └── uiManager.js
└── server/
    ├── server.js            # Express server
    ├── database.sql         # Database schema
    ├── config/
    │   └── database.js      # Database configuration
    └── routes/
        └── students.js      # API endpoints with validation
```

## Database Schema

```sql
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    email VARCHAR(100) NOT NULL,
    avatar_data LONGBLOB,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Students API (`/api/students`)

- `GET /` - Get all students
- `GET /count` - Get total student count
- `GET /search/:term` - Search students by name, company, or email
- `GET /:id` - Get specific student by ID
- `POST /` - Register new student (with validation)
- `DELETE /:id` - Delete student by ID

## Validation Rules

### Registration Form
- **Avatar**: Must contain exactly one human face
- **Full Name**: Required field
- **Company**: Required field
- **Phone Number**: Required, 10 digits, must be unique
- **Alternate Phone**: Optional, 10 digits if provided, must be unique
- **Email**: Required, valid email format, must be unique
- **Image**: Maximum 5MB, valid image format

### Server-Side Validation
- Email uniqueness check before insertion
- Phone number uniqueness check (both primary and alternate)
- Duplicate detection with clear error messages

## Technologies

**Frontend**: 
- HTML5, CSS3, JavaScript ES6+ (Modules)
- face-api.js for face detection
- DiceBear API for avatar generation
- SessionStorage for page navigation

**Backend**: 
- Node.js with Express.js
- MySQL database with mysql2
- RESTful API architecture
- CORS enabled for cross-origin requests

## Usage Flow

1. **Landing Page** (`landing.html`) → View all registered students in a table
2. Click **"Open Student Card"** → Navigate to individual student card page
3. **Student Card Page** (`student-card.html`) → View detailed student information
4. Click **"← Back to Student Directory"** → Return to landing page
5. Click **"+ Register New Student"** → Opens registration form
6. Upload photo → AI validates face and generates avatar
7. Fill form → Submit registration with validation
8. Success → Redirected back to student directory

## Key Features Explained

### Unique Validation
The system ensures data integrity by validating:
- **Email addresses** must be unique across all students
- **Phone numbers** (both primary and alternate) must be unique
- Clear error messages guide users when duplicates are detected

### Student Cards
Each student has a dedicated card page showing:
- Avatar with status indicators
- Full name in large, readable font
- Company 
- Phone numbers 
- Email 

### Navigation
- Seamless navigation between directory and individual cards
- Back button with hover effects
- Data passed via SessionStorage for performance

## Development

### Adding New Validation
1. Edit `src/js/validators.js` for client-side rules
2. Edit `src/js/formValidator.js` for form validation logic
3. Edit `server/routes/students.js` for server-side validation

### Customizing Student Cards
Modify `src/css/student-card.css` to change card appearance and layout

### Database Operations

**Clear all students:**
```bash
mysql -u root -p -e "USE student_registration; DELETE FROM students;"
```

**View all students:**
```bash
mysql -u root -p -e "USE student_registration; SELECT * FROM students;"
```

## Troubleshooting

**Backend won't start**
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` credentials match your MySQL setup
- Ensure database exists: `SHOW DATABASES;`

**No students showing on landing page**
- Check backend is running: `http://localhost:3000/api/students`
- Verify database connection in server logs
- Check browser console for errors (F12)

**Face detection fails**
- Ensure photo shows clear human face (front-facing)
- Try different lighting/angle
- Check image file size (max 5MB)
- Verify face-api.js models are loading

**Duplicate validation not working**
- Ensure server is running and connected to database
- Check server console for validation errors
- Verify API endpoint is being called correctly

**Student card page is blank**
- Check if SessionStorage has student data
- Verify navigation from landing page (not direct URL access)
- Check browser console for JavaScript errors

