// backend/src/services/courseService.js
const { getPool } = require('../db/pool');

const getAllCourses = async () => {
  const pool = getPool();
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.course_id,
        c.course_code,
        c.title,
        c.credits,
        co.offering_id,
        co.max_seats,
        co.professor_id
      FROM courses c
      LEFT JOIN course_offerings co ON c.course_id = co.course_id
      LIMIT 100
    `);
    return rows;
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
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

        // 1. Update seat limit in course_offerings
        await connection.query(
            'UPDATE course_offerings SET max_seats = ? WHERE offering_id = ?',
            [maxSeats, offeringId]
        );

        // 2. Get course_id associated with this offering
        const [offeringRows] = await connection.query(
            'SELECT course_id FROM course_offerings WHERE offering_id = ?',
            [offeringId]
        );
        
        if (offeringRows.length === 0) throw new Error("Offering not found");
        const course_id = offeringRows[0].course_id;

        // 3. Update or Insert all 6 weight parameters
        // included weight_major, weight_minor, and weight_elective
        await connection.query(
            `INSERT INTO priority_rules (
                course_id, 
                weight_cpi, 
                weight_year, 
                weight_dept_match, 
                weight_major, 
                weight_minor, 
                weight_elective
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                weight_cpi        = VALUES(weight_cpi), 
                weight_year       = VALUES(weight_year), 
                weight_dept_match = VALUES(weight_dept_match),
                weight_major      = VALUES(weight_major),
                weight_minor      = VALUES(weight_minor),
                weight_elective   = VALUES(weight_elective)`,
            [
                course_id, 
                rules.cpi, 
                rules.year, 
                rules.dept, 
                rules.major, 
                rules.minor, 
                rules.elective
            ]
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

        // 1. Get Ranking based on the new weighted sum formula
        const [rankedStudents] = await connection.query(`
            SELECT 
                r.student_id,
                (
                    (sp.cpi * pr.weight_cpi) + 
                    (sp.academic_year * pr.weight_year) + 
                    (IF(sp.department = c.department, 1, 0) * pr.weight_dept_match) +
                    (CASE 
                        WHEN r.intent = 'major' THEN pr.weight_major
                        WHEN r.intent = 'minor' THEN pr.weight_minor
                        ELSE pr.weight_elective 
                     END)
                ) AS score
            FROM enrollments r
            JOIN student_profiles sp ON r.student_id = sp.user_id
            JOIN course_offerings co ON r.offering_id = co.offering_id
            JOIN courses c ON co.course_id = c.course_id
            JOIN priority_rules pr ON co.course_id = pr.course_id
            WHERE r.offering_id = ?
            ORDER BY score DESC, r.requested_at ASC
        `, [offeringId]);

        // 2. Get Max Seats for this specific offering
        const [[offeringData]] = await connection.query(
            'SELECT max_seats FROM course_offerings WHERE offering_id = ?', 
            [offeringId]
        );
        
        if (!offeringData) throw new Error("Offering not found");
        const maxSeats = offeringData.max_seats;

        // 3. Distribute Seats: Accept top students, reject the rest
        for (let i = 0; i < rankedStudents.length; i++) {
            const status = (i < maxSeats) ? 'accepted' : 'rejected';
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

// prof -> add new course offering
const addCourse = async (professorId, courseId, academicId, maxSeats = 30) => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Verify professor exists
        const [[professor]] = await connection.query(
            'SELECT user_id FROM users WHERE user_id = ? AND role = "professor"',
            [professorId]
        );
        if (!professor) {
            throw new Error('Invalid professor ID');
        }

        // 2. Verify course exists
        const [[course]] = await connection.query(
            'SELECT course_id FROM courses WHERE course_id = ?',
            [courseId]
        );
        if (!course) {
            throw new Error('Course not found');
        }

        // 3. Verify academic period exists
        const [[academic]] = await connection.query(
            'SELECT academic_id FROM academics WHERE academic_id = ?',
            [academicId]
        );
        if (!academic) {
            throw new Error('Academic period not found');
        }

        // 4. Create course offering
        const result = await connection.query(
            'INSERT INTO course_offerings (course_id, professor_id, academic_id, max_seats) VALUES (?, ?, ?, ?)',
            [courseId, professorId, academicId, maxSeats]
        );

        await connection.commit();
        return { offering_id: result[0].insertId, message: 'Course offering created successfully' };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

// prof -> add prerequisite for a course
const addPrerequisite = async (courseId, prerequisiteId) => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Verify course exists
        const [[course]] = await connection.query(
            'SELECT course_id FROM courses WHERE course_id = ?',
            [courseId]
        );
        if (!course) {
            throw new Error('Course not found');
        }

        // 2. Verify prerequisite course exists
        const [[prerequisite]] = await connection.query(
            'SELECT course_id FROM courses WHERE course_id = ?',
            [prerequisiteId]
        );
        if (!prerequisite) {
            throw new Error('Prerequisite course not found');
        }

        // 3. Check if same course
        if (courseId === prerequisiteId) {
            throw new Error('A course cannot be its own prerequisite');
        }

        // 4. Check if prerequisite already exists
        const [[existing]] = await connection.query(
            'SELECT * FROM prerequisites WHERE course_id = ? AND prerequisite_id = ?',
            [courseId, prerequisiteId]
        );
        if (existing) {
            throw new Error('This prerequisite already exists for the course');
        }

        // 5. Insert prerequisite
        await connection.query(
            'INSERT INTO prerequisites (course_id, prerequisite_id) VALUES (?, ?)',
            [courseId, prerequisiteId]
        );

        await connection.commit();
        return { message: 'Prerequisite added successfully' };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = { getAllCourses, requestCourse, updateOfferingRules, processAllocations, addCourse, addPrerequisite };