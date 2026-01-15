/**
 * Database Configuration
 * MySQL connection setup using mysql2
 */

const mysql = require('mysql2');

// Environment variables are loaded in server.js

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_registration',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
async function testConnection() {
    try {
        const connection = await promisePool.getConnection();
        console.log('✓ MySQL Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('✗ MySQL Database connection failed:', error.message);
        return false;
    }
}

module.exports = {
    pool: promisePool,
    testConnection
};
