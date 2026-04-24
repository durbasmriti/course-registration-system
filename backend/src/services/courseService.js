// backend/src/services/courseService.js
const { getPool } = require('../db/pool');

const getAllCourses = async () => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM courses');
  return rows;
};

// check if student has completed all pre-req
const checkPrerequisites = async (userId, offeringId) => {
    const pool = getPool();
    const query = `
        SELECT cp.prerequisite_course_id 
        FROM course_prerequisites cp
        JOIN course_offerings co ON cp.course_id = co.course_id
        WHERE co.offering_id = ?
        AND cp.prerequisite_course_id NOT IN (
            SELECT co_past.course_id 
            FROM enrollments e
            JOIN course_offerings co_past ON e.offering_id = co_past.offering_id
            WHERE e.user_id = ?
        )
    `;
    const [missing] = await pool.query(query, [offeringId, userId]);
    return missing.length === 0; // True if no missing prerequisites
};

const requestCourse = async (userId, offeringId, intent = 'major') => {
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
            'SELECT * FROM requests WHERE user_id=? AND offering_id=?',
            [userId, offeringId]
        );
        if (existing.length > 0) throw new Error('Already requested');

        // 3. Insert Request
        await connection.query(
            'INSERT INTO requests (user_id, offering_id, intent) VALUES (?, ?, ?)',
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

        // Update or Insert weights
        await connection.query(
            `INSERT INTO priority_rules (offering_id, weight_cpi, weight_year, weight_dept) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             weight_cpi = VALUES(weight_cpi), 
             weight_year = VALUES(weight_year), 
             weight_dept = VALUES(weight_dept)`,
            [offeringId, rules.cpi, rules.year, rules.dept]
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
                r.user_id,
                ((s.cpi * pr.weight_cpi) + (s.year * pr.weight_year) + 
                (IF(s.dept = co.department, 1, 0) * pr.weight_dept)) AS score
            FROM requests r
            JOIN students s ON r.user_id = s.user_id
            JOIN course_offerings co ON r.offering_id = co.offering_id
            JOIN priority_rules pr ON co.offering_id = pr.offering_id
            WHERE r.offering_id = ?
            ORDER BY score DESC, r.requested_at ASC
        `, [offeringId]);

        // 2. Get Max Seats
        const [[{ max_seats }]] = await connection.query(
            'SELECT max_seats FROM course_offerings WHERE offering_id = ?', [offeringId]
        );

        // 3. Distribute Seats
        for (let i = 0; i < rankedStudents.length; i++) {
            const status = (i < max_seats) ? 'accepted' : 'waitlisted';
            await connection.query(
                'UPDATE requests SET status = ? WHERE user_id = ? AND offering_id = ?',
                [status, rankedStudents[i].user_id, offeringId]
            );
            
            if (status === 'accepted') {
                await connection.query(
                    'INSERT IGNORE INTO enrollments (user_id, offering_id) VALUES (?, ?)',
                    [rankedStudents[i].user_id, offeringId]
                );
            }
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