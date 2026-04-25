//backend/src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();

const {
  getCourses,
  getProfessorCoursesController,
  requestCourseController,
  updateRulesController,
  runAllocationController,
  addCourseController,
  addPrerequisiteController,
  getStudentEnrollmentsController,
  getProfessorRequestsController
} = require('../controllers/courseController');

// GET all courses
router.get('/', getCourses); // working  // working

// Professor: Get only the courses they coordinate
router.get('/professor/courses', getProfessorCoursesController);

// Professor: Get incoming requests for their courses
router.get('/professor/requests', getProfessorRequestsController);

// Student: Get their enrollments and applied credits
router.get('/student-enrollments', getStudentEnrollmentsController);

// Student only: Request a course
router.post('/request', requestCourseController);  // working


// Professor only: Set weights and max_seats
router.put('/offering/:offering_id/rules', updateRulesController);  // working

// Admin or Professor: Run allocation
router.post('/offering/:offering_id/allocate', runAllocationController);  // working


// prof -> add course
router.post('/add', addCourseController); // working

// prof -> add prerequisite for a course
router.post('/:courseId/prerequisites', addPrerequisiteController); // working

// login api




module.exports = router;