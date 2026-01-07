# Student Registration Form

A simple, responsive web form for student course registration with validation and real-time feedback.

## Features

- **Student Registration**: Collect name, date of birth, phone, and course selection
- **Age Validation**: Students must be at least 15 years old
- **Phone Validation**: Rejects invalid patterns (all zeros, sequential numbers, etc.)
- **Real-time Feedback**: Instant validation as users type
- **Success Popup**: 3-second confirmation modal after registration
- **Student Counter**: Displays total registered students
- **Responsive Design**: Works on desktop and mobile devices

## Files

- `index.html` - Main form structure
- `styles.css` - Clean white theme styling
- `script.js` - Form validation and data handling

## Usage

1. Open `index.html` in a web browser
2. Fill out the registration form
3. Submit to register student
4. View success confirmation
5. Form automatically resets for next registration

## Validation Rules

- **Required Fields**: First Name, Last Name, Date of Birth, Phone Number, Course
- **Age Requirement**: Minimum 10 years old
- **Phone Format**: 10 digits, realistic number patterns only
- **Date Range**: Valid birth dates (not future, not over 100 years ago)

