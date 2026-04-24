// backend/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Optional: for logging requests
require('dotenv').config();

// Import Routes
const courseRoutes = require('./routes/courseRoutes');
// const studentRoutes = require('./src/routes/studentRoutes'); // For later

const app = express();

// --- Middleware ---

// Enable CORS so your React frontend (usually on port 3000) can communicate with this API
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies (if you plan to use standard HTML forms)
app.use(express.urlencoded({ extended: true }));

// Request logging for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Routes ---

// Health check route to verify the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is running smoothly' });
});

// Get all courses
app.get('/getCourses', async (req, res) => {
    try {
        const { getPool } = require('./db/pool');
        const pool = getPool();
        const [courses] = await pool.query('SELECT * FROM courses');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mounting your feature-specific routes
// This prefix means all course routes will start with /api/courses
app.use('/api/courses', courseRoutes);

// --- Error Handling Middleware ---

// Catch-all for 404 errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Global error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message || 'Internal Server Error'
        }
    });
});

module.exports = app;