//backend/src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();

const {
  getCourses,
  requestCourseController
} = require('../controllers/courseController');

// GET all courses
router.get('/', getCourses);

// student-> request course
router.post('/request', requestCourseController);

// prof -> set weights and max_seats
router.put('/offering/:id/rules', async (req, res) => {
    try {
        const { rules, max_seats } = req.body;
        await updateOfferingRules(req.params.id, rules, max_seats);
        res.json({ message: "Rules updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// admin -> run allocation
router.post('/offering/:id/allocate', async (req, res) => {
    try {
        await processAllocations(req.params.id);
        res.json({ message: "Allocation process complete" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;