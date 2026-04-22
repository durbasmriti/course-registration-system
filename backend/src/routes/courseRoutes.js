const express = require('express');
const router = express.Router();
const { getCourses } = require('../controllers/courseController');

// get course api call
router.get('/', getCourses);

module.exports = router;