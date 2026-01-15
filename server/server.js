/**
 * Student Registration Backend Server
 * Express API with MySQL database
 */

// Load environment variables FIRST before any other requires
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { testConnection } = require('./config/database');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for avatar data
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/students', studentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Student Registration API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            students: '/api/students',
            createStudent: 'POST /api/students',
            getStudents: 'GET /api/students',
            getStudent: 'GET /api/students/:id',
            searchStudents: 'GET /api/students/search/:term'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Endpoint not found',
            status: 404
        }
    });
});

// Start server
async function startServer() {
    // Test database connection first
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.error('Failed to connect to database. Please check your configuration.');
        console.error('Make sure MySQL is running and credentials in .env are correct.');
        process.exit(1);
    }
    
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(` Server running on http://localhost:${PORT}`);
        console.log(` API Documentation: http://localhost:${PORT}/`);
        console.log(` Health Check: http://localhost:${PORT}/api/health`);
        console.log(`========================================\n`);
    });
}

startServer();

module.exports = app;
