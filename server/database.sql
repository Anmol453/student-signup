-- Create database
CREATE DATABASE IF NOT EXISTS student_registration;
USE student_registration;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    email VARCHAR(100) NOT NULL,
    avatar_data LONGBLOB,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_full_name (full_name),
    INDEX idx_company (company),
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    INDEX idx_registration_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
