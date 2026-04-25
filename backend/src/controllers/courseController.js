//backend/src/controller/courseController.js
const {
  getAllCourses,
  getProfessorCourses,
  requestCourse,
  updateOfferingRules,
  processAllocations,
  addCourse,
  addPrerequisite,
  getStudentEnrollments
} = require('../services/courseService');

const getCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProfessorCoursesController = async (req, res) => {
  try {
    const professorId = req.query.user_id || req.headers['x-user-id'] || req.headers['user-id'];

    if (!professorId) {
      return res.status(400).json({ message: 'Professor ID missing' });
    }

    const courses = await getProfessorCourses(professorId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestCourseController = async (req, res) => {
  try {
    let { user_id, offering_id, course_id, intent } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required field: user_id"
      });
    }

    if (!offering_id && !course_id) {
      return res.status(400).json({
        message: "Missing required field: either offering_id or course_id must be provided"
      });
    }

    // If only course_id is provided, look up offering_id
    if (!offering_id && course_id) {
      const { getPool } = require('../db/pool');
      const pool = getPool();
      try {
        const [rows] = await pool.query(
          'SELECT offering_id FROM course_offerings WHERE course_id = ? LIMIT 1',
          [course_id]
        );
        if (rows.length === 0) {
          return res.status(404).json({
            message: `No offering found for course_id: ${course_id}`
          });
        }
        offering_id = rows[0].offering_id;
      } catch (err) {
        return res.status(500).json({
          message: `Error looking up offering: ${err.message}`
        });
      }
    }

    await requestCourse(user_id, offering_id, intent);

    res.status(201).json({
      message: "Course requested successfully"
    });

  } catch (err) {
    // pre-req not met or already requested course
    res.status(400).json({
      message: err.message
    });
  }
};

// PUT /api/courses/offering/:offering_id/rules
const updateRulesController = async (req, res) => {
  try {
    const { offering_id } = req.params;
    const { rules, max_seats } = req.body;

    if (!rules || max_seats === undefined) {
      return res.status(400).json({ message: "Rules and max_seats are required" });
    }

    await updateOfferingRules(offering_id, rules, max_seats);
    res.json({ message: "Priority rules and seats updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/courses/offering/:offering_id/allocate
const runAllocationController = async (req, res) => {
  try {
    const { offering_id } = req.params;
    
    if (!offering_id) {
      return res.status(400).json({ message: "Offering ID is required" });
    }

    await processAllocations(offering_id);
    res.json({ message: "Allocation process completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/courses/add
const addCourseController = async (req, res) => {
  try {
    const professor_id = req.body.professor_id || req.headers['x-user-id'] || req.headers['user-id'];
    const { course_code, course_name, course_credit, offering_dept, max_seats } = req.body;

    if (!professor_id || !course_code || !course_name || !course_credit || !offering_dept) {
      return res.status(400).json({
        message: "Missing required fields: professor_id, course_code, course_name, course_credit, offering_dept"
      });
    }

    const result = await addCourse(
      professor_id,
      String(course_code).trim().toUpperCase(),
      String(course_name).trim(),
      Number(course_credit),
      String(offering_dept).trim().toUpperCase(),
      max_seats
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/courses/:courseId/prerequisites
const addPrerequisiteController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const prerequisiteId = req.body?.prerequisite_id;

    if (!courseId || !prerequisiteId) {
      return res.status(400).json({
        message: "Missing required fields: courseId in params, prerequisite_id in body"
      });
    }

    await addPrerequisite(courseId, prerequisiteId);
    res.status(201).json({ message: "Prerequisite added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/courses/student-enrollments
const getStudentEnrollmentsController = async (req, res) => {
  try {
    const userId = req.query.user_id || req.headers['user-id'] || req.body?.user_id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID header missing" });
    }

    const enrollments = await getStudentEnrollments(userId);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProfessorRequestsController = async (req, res) => {
  try {
    const professorId = req.query.user_id || req.headers['x-user-id'] || req.headers['user-id'];

    if (!professorId) {
      return res.status(400).json({ message: 'Professor ID missing' });
    }

    const { getPool } = require('../db/pool');
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT 
         e.student_id,
         sp.roll_no,
         sp.name,
         co.offering_id,
         c.course_code AS course_id,
         c.title AS course_name,
         sp.cpi,
         e.status,
         e.intent,
         e.requested_at
       FROM enrollments e
       JOIN course_offerings co ON e.offering_id = co.offering_id
       JOIN courses c ON co.course_id = c.course_id
       JOIN student_profiles sp ON e.student_id = sp.user_id
       WHERE co.professor_id = ?
       ORDER BY e.requested_at DESC`,
      [professorId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getCourses,
  getProfessorCoursesController,
  requestCourseController,
  updateRulesController,
  runAllocationController,
  addCourseController,
  addPrerequisiteController,
  getStudentEnrollmentsController,
  getProfessorRequestsController
};