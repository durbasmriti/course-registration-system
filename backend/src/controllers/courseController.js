//backend/src/controller/courseController.js
const {
  getAllCourses,
  requestCourse,
  updateOfferingRules,
  processAllocations
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
    
    await processAllocations(offering_id);
    res.json({ message: "Allocation process completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCourses,
  requestCourseController,
  updateRulesController,
  runAllocationController
};