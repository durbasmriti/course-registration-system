// backend/src/services/courseService.js
const { getPool } = require('../db/pool');

const getAllCourses = async () => {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT 
      c.course_code as id,
      c.title as name,
      u.name as instructor,
      c.credits,
      co.max_seats,
      'Available' as status,
      'DE' as type
    FROM course_offerings co
    JOIN courses c ON co.course_id = c.course_id
    JOIN users u ON co.professor_id = u.user_id
    JOIN academics a ON co.academic_id = a.academic_id
    WHERE a.is_active = TRUE
  `);
  return rows;
};

// check if student has completed all pre-req
const checkPrerequisites = async (userId, offeringId) => {
    const pool = getPool();
    const query = `
        SELECT p.prerequisite_id 
        FROM prerequisites p
        JOIN course_offerings co ON p.course_id = co.course_id
        WHERE co.offering_id = ?
        AND p.prerequisite_id NOT IN (
            SELECT co_past.course_id 
            FROM student_transcript st
            JOIN course_offerings co_past ON st.offering_id = co_past.offering_id
            WHERE st.student_id = ?
            AND st.is_passed = TRUE
        )
    `;
    const [missing] = await pool.query(query, [offeringId, userId]);
    return missing.length === 0; // True if no missing prerequisites
};

const requestCourse = async (userId, offeringId, intent ) => {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Prerequisite Check
        const hasPrereqs = await checkPrerequisites(userId, offeringId);
        if (!hasPrereqs) {
            throw new Error('Prerequisites not met for this course.');
        }

        // 2. Check Duplicate
        const [existing] = await connection.query(
            'SELECT * FROM enrollments WHERE student_id=? AND offering_id=?',
            [userId, offeringId]
        );
        if (existing.length > 0) throw new Error('Already requested');

        // 3. Insert Request
        await connection.query(
            'INSERT INTO enrollments (student_id, offering_id, reg_type_id, intent) VALUES (?, ?, 3, ?)',
            [userId, offeringId, intent]
        );

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

// prof can set the max_seat and priority_rules weights
const updateOfferingRules = async (offeringId, rules, maxSeats) => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Update seat limit
        await connection.query(
            'UPDATE course_offerings SET max_seats = ? WHERE offering_id = ?',
            [maxSeats, offeringId]
        );

        // Get course_id
        const [[{ course_id }]] = await connection.query(
            'SELECT course_id FROM course_offerings WHERE offering_id = ?',
            [offeringId]
        );

        // Update or Insert weights
        await connection.query(
            `INSERT INTO priority_rules (course_id, weight_cpi, weight_year, weight_dept_match) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             weight_cpi = VALUES(weight_cpi), 
             weight_year = VALUES(weight_year), 
             weight_dept_match = VALUES(weight_dept_match)`,
            [course_id, rules.cpi, rules.year, rules.dept]
        );

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

// allocation logic
const processAllocations = async (offeringId) => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get Ranking based on weighted sum
        const [rankedStudents] = await connection.query(`
            SELECT 
                r.student_id,
                ((sp.cpi * pr.weight_cpi) + (sp.year * pr.weight_year) + 
                (IF(sp.department = co.department, 1, 0) * pr.weight_dept_match)) AS score
            FROM enrollments r
            JOIN student_profiles sp ON r.student_id = sp.user_id
            JOIN course_offerings co ON r.offering_id = co.offering_id
            JOIN priority_rules pr ON co.course_id = pr.course_id
            WHERE r.offering_id = ?
            ORDER BY score DESC, r.requested_at ASC
        `, [offeringId]);

        // 2. Get Max Seats
        const [[{ max_seats }]] = await connection.query(
            'SELECT max_seats FROM course_offerings WHERE offering_id = ?', [offeringId]
        );

        // 3. Distribute Seats
        for (let i = 0; i < rankedStudents.length; i++) {
            const status = (i < max_seats) ? 'accepted' : 'rejected';
            await connection.query(
                'UPDATE enrollments SET status = ? WHERE student_id = ? AND offering_id = ?',
                [status, rankedStudents[i].student_id, offeringId]
            );
        }

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = { getAllCourses, requestCourse, updateOfferingRules, processAllocations };