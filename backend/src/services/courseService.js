// backend/src/services/courseService.js
const db = require('../db');

const getAllCourses = async () => {
  const [rows] = await db.execute('SELECT * FROM courses');
  return rows;
};

const registerForCourse = async (studentId, courseId) => {
  // Example of using a transaction for priority-based logic
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      'INSERT INTO registration_requests (student_id, course_id, status) VALUES (?, ?, "pending")',
      [studentId, courseId]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { getAllCourses, registerForCourse };