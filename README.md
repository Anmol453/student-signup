# Student Registration System

A complete student registration system with dynamic landing page, face detection, AI-generated avatars, and MySQL database integration.

## Features

- **Dynamic Landing Page**: Card-based layout displaying all registered students
- **Face Detection**: AI validates human faces before registration
- **Smart Avatars**: DiceBear avatars generated based on facial characteristics
- **MySQL Database**: Avatars stored as blobs, all data persistent
- **Real-time Validation**: Age, phone number, and image validation
- **Responsive Design**: Works on desktop, tablet, and mobile

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

```bash
# From signup-form directory
python -m http.server 8000
# OR
npx http-server
```

### 5. Open Application

Navigate to: `http://localhost:8000/landing.html`

## Project Structure

```
signup-form/
├── landing.html              # Student directory
├── index.html                # Registration form
├── src/
│   ├── css/
│   │   ├── landing.css      # Landing page styles
│   │   └── styles.css       # Form styles
│   └── js/
│       ├── landing.js       # Landing page controller
│       ├── landingUIManager.js
│       ├── app.js           # Form controller
│       ├── faceDetection.js
│       ├── avatarGenerator.js
│       ├── avatarUploadHandler.js
│       ├── formValidator.js
│       ├── validators.js
│       ├── studentRepository.js
│       └── uiManager.js
└── server/
    ├── server.js            # Express server
    ├── database.sql         # Database schema
    ├── config/
    │   └── database.js
    └── routes/
        └── students.js      # API endpoints
```

## Database Schema

```sql
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    desired_course VARCHAR(100) NOT NULL,
    avatar_data LONGBLOB,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Validation Rules

- **Avatar**: Must contain one human face
- **Age**: Minimum 10 years old
- **Phone**: 10 digits, realistic patterns
- **Image**: Maximum 5MB, valid image format

## Technologies

**Frontend**: HTML5, CSS3, JavaScript ES6+, face-api.js, DiceBear API  
**Backend**: Node.js, Express.js, MySQL, mysql2

## Usage Flow

1. **Landing Page** → View all registered students
2. Click **"Register New Student"** → Opens registration form
3. Upload photo → AI validates face and generates avatar
4. Fill form → Submit registration
5. Click **"Back to Directory"** → Return to landing page

## Development

### Adding New Validation
Edit `src/js/validators.js` and `src/js/formValidator.js`

### Customizing Avatars
Modify `src/js/avatarGenerator.js` to change avatar styles or characteristics

### Database Migration
If upgrading from URL-based avatars:
```bash
mysql -u root -p < server/migrate_avatar_to_blob.sql
```

## Troubleshooting

**Backend won't start**
- Check MySQL is running
- Verify `.env` credentials
- Ensure database exists

**No students showing**
- Check backend is running: `http://localhost:3000/api/health`
- Verify database connection
- Check browser console for errors

**Face detection fails**
- Ensure photo shows clear human face
- Try different lighting/angle
- Check browser console for errors
