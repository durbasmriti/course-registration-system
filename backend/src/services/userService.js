const { getPool } = require('../db/pool');

const getUserProfile = async (userId) => {
  const pool = getPool();
  
  // 1. Get base user
  const [userRows] = await pool.query(
    'SELECT user_id, username, email, role FROM users WHERE user_id = ?', 
    [userId]
  );

  if (userRows.length === 0) return null;
  const user = userRows[0];

  // 2. Decorate with profile data
  let details = [];
  if (user.role === 'student') {
    [details] = await pool.query(
      'SELECT name, roll_no, department, academic_year, cpi FROM student_profiles WHERE user_id = ?',
      [userId]
    );
  } else if (user.role === 'professor') {
    [details] = await pool.query(
      'SELECT name, department FROM professor_profiles WHERE user_id = ?',
      [userId]
    );
  }

  return { ...user, ...(details[0] || {}) };
};

module.exports = { getUserProfile };