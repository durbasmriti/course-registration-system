//backend/src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();

const {
  getCourses,
  requestCourseController,
  updateRulesController,
  runAllocationController,
  addCourseController,
  addPrerequisiteController
} = require('../controllers/courseController');

// GET all courses
router.get('/', getCourses); // working

// student-> request course
router.post('/request', requestCourseController); // working

// prof -> set weights and max_seats
router.put('/offering/:id/rules', updateRulesController); // working

// admin -> run allocation
router.post('/offering/:id/allocate', runAllocationController); 

// prof -> add course
router.post('/add', addCourseController); // working

// prof -> add prerequisite for a course
router.post('/:courseId/prerequisites', addPrerequisiteController); // working

module.exports = router;