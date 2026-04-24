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

// student-> request course
router.post('/request', requestCourseController); // working

// prof -> set weights and max_seats
router.put('/offering/:id/rules', updateRulesController);

// admin -> run allocation
router.post('/offering/:id/allocate', runAllocationController);

module.exports = router;