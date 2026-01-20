const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM students ORDER BY registration_date DESC'
        );
        
        const students = rows.map(student => {
            if (student.avatar_data && Buffer.isBuffer(student.avatar_data)) {
                const base64 = student.avatar_data.toString('base64');
                student.avatar_data = `data:image/svg+xml;base64,${base64}`;
            } else if (student.avatar_url) {
                student.avatar_data = student.avatar_url;
            } else {
                student.avatar_data = null;
            }
            return student;
        });
        
        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch students'
        });
    }
});

router.get('/count', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM students'
        );
        
        res.json({
            success: true,
            count: rows[0].count
        });
    } catch (error) {
        console.error('Error counting students:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to count students'
        });
    }
});

router.get('/search/:term', async (req, res) => {
    try {
        const searchTerm = `%${req.params.term}%`;
        
        const [rows] = await pool.query(
            `SELECT * FROM students 
             WHERE full_name LIKE ? 
             OR company LIKE ? 
             OR email LIKE ?
             ORDER BY registration_date DESC`,
            [searchTerm, searchTerm, searchTerm]
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search students'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM students WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        const student = rows[0];
        if (student.avatar_data) {
            student.avatar_data = `data:image/svg+xml;base64,${student.avatar_data.toString('base64')}`;
        } else if (student.avatar_url) {
            student.avatar_data = student.avatar_url;
        }
        
        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch student'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            id,
            fullName,
            company,
            phoneNumber,
            alternatePhone,
            email,
            avatarData,
            registrationDate
        } = req.body;
        
        if (!id || !fullName || !company || !phoneNumber || !email) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        // Check if email already exists
        const [emailCheck] = await pool.query(
            'SELECT id FROM students WHERE email = ?',
            [email]
        );
        
        if (emailCheck.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Email already exists. Please use a different email address.'
            });
        }
        
        // Check if phone number already exists
        const [phoneCheck] = await pool.query(
            'SELECT id FROM students WHERE phone_number = ? OR alternate_phone = ?',
            [phoneNumber, phoneNumber]
        );
        
        if (phoneCheck.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Phone number already exists. Please use a different phone number.'
            });
        }
        
        // Check if alternate phone already exists (if provided)
        if (alternatePhone && alternatePhone !== '-') {
            const [altPhoneCheck] = await pool.query(
                'SELECT id FROM students WHERE phone_number = ? OR alternate_phone = ?',
                [alternatePhone, alternatePhone]
            );
            
            if (altPhoneCheck.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: 'Alternate phone number already exists. Please use a different phone number.'
                });
            }
        }
        
        const mysqlRegistrationDate = registrationDate 
            ? new Date(registrationDate).toISOString().slice(0, 19).replace('T', ' ')
            : new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let avatarBuffer = null;
        if (avatarData) {
            try {
                const base64Data = avatarData.replace(/^data:image\/[a-z+]+;base64,/, '');
                avatarBuffer = Buffer.from(base64Data, 'base64');
            } catch (error) {
                console.error('Error converting avatar:', error);
            }
        }
        
        await pool.query(
            `INSERT INTO students 
             (id, full_name, company, phone_number, alternate_phone, email, avatar_data, registration_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, fullName, company, phoneNumber, alternatePhone || null, email, avatarBuffer, mysqlRegistrationDate]
        );
        
        const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
        
        const student = rows[0];
        if (student.avatar_data && Buffer.isBuffer(student.avatar_data)) {
            student.avatar_data = `data:image/svg+xml;base64,${student.avatar_data.toString('base64')}`;
        }
        
        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: student
        });
        
    } catch (error) {
        console.error('Error creating student:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                error: 'Student with this ID already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to register student'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM students WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete student'
        });
    }
});

module.exports = router;
