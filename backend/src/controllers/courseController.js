//backend/src/controller/courseController.js
const {
  getAllCourses,
  requestCourse,
  updateOfferingRules,
  processAllocations,
  addCourse,
  addPrerequisite
} = require('../services/courseService');

const getCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestCourseController = async (req, res) => {
  try {
    const { user_id, offering_id, intent } = req.body;

    if (!user_id || !offering_id) {
      return res.status(400).json({
        message: "Missing fields"
      });
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
    const { professor_id, course_id, academic_id, max_seats } = req.body;

    if (!professor_id || !course_id || !academic_id) {
      return res.status(400).json({
        message: "Missing required fields: professor_id, course_id, academic_id"
      });
    }

    const result = await addCourse(professor_id, course_id, academic_id, max_seats);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/courses/:courseId/prerequisites
const addPrerequisiteController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { prerequisite_id } = req.body;

    if (!courseId || !prerequisite_id) {
      return res.status(400).json({
        message: "Missing required fields: courseId in params, prerequisite_id in body"
      });
    }

    await addPrerequisite(parseInt(courseId), prerequisite_id);
    res.status(201).json({ message: "Prerequisite added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




module.exports = {
  getCourses,
  requestCourseController,
  updateRulesController,
  runAllocationController,
  addCourseController,
  addPrerequisiteController
};