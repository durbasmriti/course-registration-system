//backend/src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();

const {
  getCourses,
  requestCourseController,
  updateRulesController,
  runAllocationController
} = require('../controllers/courseController');

// GET all courses
router.get('/', getCourses);

// Student only: Request a course
router.post('/request', requestCourseController);

// Professor only: Set weights and max_seats
router.put('/offering/:offering_id/rules', updateRulesController);  // working

// Admin or Professor: Run allocation
router.post('/offering/:offering_id/allocate', runAllocationController);

module.exports = router;